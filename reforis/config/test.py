#  Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# ruff: noqa: F403, F405

from reforis.config.dev import *

TESTING = True
BUSES_CONF["mqtt"]["credentials_file"] = None
