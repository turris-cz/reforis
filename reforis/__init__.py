#  Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=unused-variable,unused-argument,import-outside-toplevel

"""
The application factory approach is used in this project.
It allows to create more Flask applications with a different configuration for more thorough test-ing.
It also encourages to create a better application structure by defining all of the application dependencies in one
place.
See `Flask Application Factories <http://flask.pocoo.org/docs/1.0/patterns/appfactories/>`_.
"""


import json
from importlib.metadata import distribution, PackageNotFoundError
from http import HTTPStatus
from logging.config import dictConfig

from flask import jsonify, render_template

from .locale import get_translations


# pylint: disable=too-many-locals
def create_app(config):
    """
    Flask application factory.
    It creates applications and registered all blueprints and plugins.

    :param config: config name
    :rtype: Flask (applications)
    """
    from flask import Flask

    app = Flask(__name__)
    app.config.from_object(f"reforis.config.{config}")
    dictConfig(app.config["LOGGING"])

    app.static_folder = app.config.get("STATIC_DIR")

    from .sessions import Session

    Session(app)

    from flask_seasurf import SeaSurf

    SeaSurf(app)

    set_backend(app)
    set_locale(app)

    from .api import api
    from .foris_controller_api import foris_controller_api
    from .guide import guide
    from .views import views

    app.register_blueprint(views)
    app.register_blueprint(foris_controller_api)
    app.register_blueprint(api)
    app.register_blueprint(guide)

    register_plugins(app)

    app.register_error_handler(404, not_found_error)
    app.register_error_handler(500, internal_error)
    # Handle backend errors
    from .backend import ExceptionInBackend

    app.register_error_handler(ExceptionInBackend, foris_controller_error)
    # Handle API errors
    from .utils import APIError, log_error

    def handle_api_error(error):
        if error.status_code == HTTPStatus.INTERNAL_SERVER_ERROR:
            log_error(error.data)
        return jsonify(error.data), error.status_code

    app.register_error_handler(APIError, handle_api_error)

    # Handle timeout errors
    def handle_timeout_error(error):
        return (
            jsonify("Timeout occurred during performing foris controller action."),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    from .backend import BackendTimeoutError

    app.register_error_handler(BackendTimeoutError, handle_timeout_error)

    @app.context_processor
    def add_version_to_ctx():
        try:
            version = distribution("reforis").version
        except PackageNotFoundError:
            version = None
        return {"version": version}

    @app.template_filter("autoversion")
    def autoversion_filter(filename):
        try:
            version = distribution("reforis").version
        except PackageNotFoundError:
            version = None
        if version:
            newfilename = f"{filename}?v={version}"
        else:
            newfilename = f"{filename}"
        return newfilename

    return app


def not_found_error(error):
    return render_template("errors/404.html"), 404


def internal_error(error):
    return render_template("errors/500.html", error=error), 500


def foris_controller_error(e):
    """
    Add stacktrace, errors description in case of ``foris-controller`` error.

    :param e: error
    :return: rendered template, 500
    """
    error = {
        "error": f"Remote Exception: {e.remote_description}",
        "extra": f"{json.dumps(e.query)}",
        "trace": e.remote_stacktrace,
    }

    if e.remote_description.startswith("Incorrect input."):
        # indicates incorrect input, not actually a server error
        # but a client error so we'll return more appropriate status code
        return render_template("errors/400.html", **error), 400

    return render_template("errors/500.html", **error), 500


def set_backend(app):
    """
    Set ``foris-controller`` backend on the Flask applications.
    Then it can be used as following:

    .. code-block::

        from flask import current_app
        web_data = current_app.backend.perform('web', 'get_data')

    :param app: Flask (application)
    """
    bus = app.config["BUS"]
    bus_config = app.config["BUSES_CONF"][bus]

    if bus == "mqtt":
        from reforis.backend import MQTTBackend

        app.backend = MQTTBackend(**bus_config)
    if bus == "ubus":
        from reforis.backend import UBusBackend

        app.backend = UBusBackend(**bus_config)


def set_locale(app):
    """
    Set babel ``localeselector`` and add translations catalogs to context.
    Catalog is a dict of prepared translation messages by :class:`locale.TranslationsHelper` to the right format to be
    loaded and used by ``babel.js`` library.
    See implementation of ``get_translations()``.

    .. code-block:: js+jinja

        babel.Translations.load({{ babel_catalog | safe }}).install();

    :param app: Flask (application)
    """

    def get_locale():
        return _get_locale_from_backend(app)

    from flask_babel import Babel

    Babel(app, locale_selector=get_locale)

    @app.context_processor
    def add_translations_catalog_to_ctx():
        from flask_babel import get_locale

        return {"locale": get_locale(), **get_translations()}


def _get_locale_from_backend(app):
    # pylint: disable=fixme
    # TODO: better to cache.
    return app.backend.perform("web", "get_data")["language"]


def register_plugins(app):
    """
    Iterate over all plugins and register their blueprints.

    :param app: Flask (application)
    """
    from .plugins import get_plugins

    plugins = get_plugins()

    app.plugin_translations = []
    for plugin in plugins:
        app.register_blueprint(plugin["blueprint"])
        app.plugin_translations.append(plugin["translations_path"])

    @app.context_processor
    def add_plugins_to_ctx():
        return {"plugins_js_app_paths": [plugin["js_app_path"] for plugin in plugins]}
