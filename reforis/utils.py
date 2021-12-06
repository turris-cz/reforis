#  Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import base64
from http import HTTPStatus

from flask import request, current_app


class APIError(Exception):
    """
    Raised when an error occurred during processing request.
    """

    def __init__(self, data, status_code=HTTPStatus.BAD_REQUEST):
        super().__init__(self)
        self.data = data
        self.status_code = status_code


def log_error(message):
    """
    Report error using logger from current application. Request URL and data are added to the message.
    """
    current_app.logger.error('%s; URL: %s; data: %s', message, request.url, request.data)


def check_password(password):
    """Check given password with ``foris-controller``.

    :return: result: Password is correct or not set.
    :rtype: bool
    """
    decoded_password = _decode_password_to_base64(password)
    res = current_app.backend.perform(
        'password', 'check', {'password': decoded_password})

    # Consider unset password as successful auth maybe set some session variable in this case
    return res['status'] in ('unset', 'good')


def _decode_password_to_base64(password):
    return base64.b64encode(password.encode('utf-8')).decode('utf-8')
