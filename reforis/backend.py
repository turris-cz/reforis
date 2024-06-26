#  Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

# pylint: disable=import-error,import-outside-toplevel

"""
Backend communication helpers.
"""

import time
from abc import ABC, abstractmethod

from flask import current_app
from foris_client.buses.base import ControllerError


class ExceptionInBackend(Exception):
    def __init__(self, query, remote_stacktrace, remote_description):
        super().__init__()
        self.query = query
        self.remote_stacktrace = remote_stacktrace
        self.remote_description = remote_description


class BackendTimeoutError(Exception):
    pass


class Backend(ABC):
    """Abstract backend"""

    def __init__(self, sender):
        self.sender = sender

    @abstractmethod
    def _send(self, module, action, data, controller_id):
        ...

    def __repr__(self):
        return type(self.sender).__name__

    # pylint: disable=too-many-arguments
    def perform(self, module, action, data=None, raise_exception_on_failure=True, controller_id=None):
        """
        Perform backend action

        :returns: None on error, response data otherwise
        :rtype: NoneType or dict
        :raises ExceptionInBackend: When command failed and raise_exception_on_failure is True
        """
        response = None
        start_time = time.time()
        try:
            response = self._send(module, action, data, controller_id)
        except ControllerError as e:
            current_app.logger.error("Exception in backend occurred. (%s)", e)
            if raise_exception_on_failure:
                error = e.errors[0]  # right now we are dealing only with the first error
                msg = {"module": module, "action": action, "kind": "request"}
                if data is not None:
                    msg["data"] = data
                raise ExceptionInBackend(msg, error["stacktrace"], error["description"]) from e
        except TimeoutError as e:
            raise BackendTimeoutError from e
        except RuntimeError as e:
            # This may occure when e.g. calling function is not present in backend
            current_app.logger.error("RuntimeError occurred during the communication with backend. (%s)", e)
            if raise_exception_on_failure:
                raise e
        except Exception as e:
            current_app.logger.error("Exception occurred during the communication with backend. (%s)", e)
            raise e
        finally:
            current_app.logger.debug("Query took %f: %s.%s - %s", time.time() - start_time, module, action, data)

        return response


class UBusBackend(Backend):
    """UBus backend"""

    def __init__(self, timeout, socket_path):
        self.socket_path = socket_path
        from foris_client.buses.ubus import UbusSender

        sender = UbusSender(socket_path, default_timeout=timeout)
        super().__init__(sender)

    def __repr__(self):
        sender_name = type(self.sender).__name__
        return f"{sender_name} ({self.socket_path})"

    def _send(self, module, action, data, controller_id):
        return self.sender.send(module, action, data)


class MQTTBackend(Backend):
    """MQTT backend"""

    def __init__(self, timeout, host, port, credentials_file, controller_id):  # pylint: disable=too-many-arguments
        """
        :param timeout: Timeout
        :param host: MQTT
        :param port:
        :param credentials_file:
        :param controller_id:
        """

        self.controller_id = None
        if controller_id:
            self.controller_id = controller_id

        credentials = None
        if credentials_file:
            credentials = self._parse_credentials(credentials_file)

        from foris_client.buses.mqtt import MqttSender

        sender = MqttSender(host, port, default_timeout=timeout, credentials=credentials)

        super().__init__(sender)

    def _send(self, module, action, data, controller_id=None):
        return self.sender.send(module, action, data, controller_id=controller_id or self.controller_id)

    @staticmethod
    def _parse_credentials(filepath):
        with open(filepath, "r", encoding="utf-8") as file:
            line = file.readline()[:-1]
            return tuple(line.split(":"))
