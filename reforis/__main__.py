#
# reforis
# Copyright (C) 2021-2026 CZ.NIC, z.s.p.o. (http://www.nic.cz/)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software Foundation,
# Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
#


import logging
import socket
import pathlib

import click
from . import create_app

logger = logging.getLogger(__name__)

try:
    import eventlet
    from eventlet import wsgi

    eventlet.monkey_patch()
    logger.info("Eventlet server will be used")
    use_eventlet = True
except ImportError:
    use_eventlet = False
    logger.warn("Flask debug server is used")


class ScriptNameMidleware:
    def __init__(self, app, prefix=None):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):
        if environ["PATH_INFO"].startswith(self.prefix):
            environ["PATH_INFO"] = environ["PATH_INFO"][len(self.prefix) :]
            environ["SCRIPT_NAME"] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response("404", [("Content-Type", "text/plain")])
            return ["This url does not belong to the app.".encode()]


@click.command()
@click.option("--debug/--no-debug", default=False)
@click.option("--port", default=None)  # port option for debugging purposes
@click.option("--prefix", default="/reforis")
@click.option("--unix-socket", default="/var/run/reforis.sock")
def main(port, prefix, debug, unix_socket):
    app = create_app("prod")
    app.wsgi_app = ScriptNameMidleware(app.wsgi_app, prefix=prefix)

    if port:
        if use_eventlet:
            wsgi.server(eventlet.listen(("127.0.0.1", port)), app)
        else:
            # Runs server in development mode
            # this should be used in initial setup only
            # the preffered way is to use eventlet
            app.run(debug=debug, port=port, threaded=True)
    else:
        # Remove existing socket
        pathlib.Path(unix_socket).unlink(missing_ok=True)
        if use_eventlet:
            wsgi.server(eventlet.listen(unix_socket, family=socket.AF_UNIX), app)
        else:
            # Runs server in development mode
            # this should be used in initial setup only
            # the preffered way is to use eventlet
            app.run(debug=debug, host=f"unix://{unix_socket}", threaded=True)


if __name__ == "__main__":
    main()
