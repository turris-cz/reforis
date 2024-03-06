#  Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from reforis.config.prod import *  # noqa: F403

DEBUG = False

SECRET_KEY = "dev_secret_key"


# WebSockets
WS_PORT = 9081
