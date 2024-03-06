#  Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# ruff: noqa: F401

# Fix backward compatibility with plugins
from reforis.foris_controller_api.modules.utils import validate_json
from reforis.utils import log_error, APIError
