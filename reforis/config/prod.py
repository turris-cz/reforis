#  Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import os
from datetime import timedelta

STATIC_DIR = "../reforis_static/"

SESSION_FILE_DIR = "/tmp/foris-sessions"
PERMANENT_SESSION_LIFETIME = timedelta(minutes=10)
SESSION_COOKIE_SAMESITE = "Lax"

BUS = "mqtt"
BUSES_CONF = {
    "mqtt": {
        "host": "localhost",
        "port": int(os.environ.get("MQTT_PORT", 11883)),
        "controller_id": os.environ.get("CONTROLLER_ID"),
        "credentials_file": os.environ.get("MQTT_PASSWORD_FILE", "/etc/fosquitto/credentials.plain"),
        "timeout": 30000,
    },
    "ubus": {"path": "/var/run/ubus/ubus.sock", "timeout": 30000},
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "short": {"format": "%(levelname)s [%(filename)s:%(lineno)s] %(message)s", "datefmt": "%d/%b/%Y %H:%M:%S"},
        "long": {
            "format": "[%(asctime)s] %(levelname)s [%(pathname)s:%(lineno)s] %(message)s",
            "datefmt": "%d/%b/%Y %H:%M:%S",
        },
    },
    "handlers": {
        "stderr": {
            "level": os.environ.get("REFORIS_LOG_LEVEL", "WARNING"),
            "class": "logging.StreamHandler",
            "formatter": "short",
            "stream": "ext://sys.stderr",
        },
    },
    "root": {
        "level": os.environ.get("REFORIS_LOG_LEVEL", "WARNING"),
        "handlers": ["stderr"],
    },
}

MAX_CONTENT_LENGTH = 1024 * 1024  # 1 MB, represented as bytes
