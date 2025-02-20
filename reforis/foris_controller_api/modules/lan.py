#  Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import typing

from flask import request, current_app, jsonify, Response
from flask_babel import _

from reforis.utils import APIError
from .utils import process_dhcp_get, process_dhcp_post

DHCP_LEASES_ERRORS = {
    "out-of-network": _("IP address does not fit the LAN network."),
    "disabled": _("DHCP is disabled for LAN."),
    "ip-exists": _("IP address is already used by another static lease."),
    "mac-exists": _("MAC address is already used by another static lease."),
    "mac-not-exists": _("No static lease has this MAC address assigned."),
    "hostname-exists": _("Hostname is already used by another static lease."),
}

FORWARDING_ERRORS = {
    "not-in-lan": _("IP address is not in the LAN network."),
    "not-user-defined": _("IP address is not a user-defined static lease."),
    "range-already-used": _("Port range is already used by another port forwarding rule."),
}


def dhcp_response_to_json_or_error(response: typing.Dict[str, str], error_message: str) -> Response:
    """Handle dhcp leases related responses

    Based on the `response['result']`, return either response as JSON (`flask.Response`)
    or raise ApiError with detailed description what went wrong.
    """
    if response["result"]:
        return jsonify(response)

    reason_of_failure = response.get("reason", "")
    raise APIError(f"{error_message} {_('Caused by')}: {DHCP_LEASES_ERRORS.get(reason_of_failure, _('Unknown'))}")


def port_forwarding_response_to_json_or_error(response: typing.Dict[str, str], error_message: str) -> Response:
    """Handle port forwarding related responses

    Based on the `response['result']`, return either response as JSON (`flask.Response`)
    or raise ApiError with detailed description what went wrong.
    """
    if response["result"]:
        return jsonify(response)

    reason_of_failure = response.get("reason", [{}])[0].get("msg", "")
    raise APIError(f"{error_message} {_('Caused by')}: {FORWARDING_ERRORS.get(reason_of_failure, _('Unknown'))}")


def lan_get():
    """
    .. http:get:: /api/lan
        Get LAN router settings.
        See ``get_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = current_app.backend.perform("lan", "get_settings")
    if response["mode"] == "managed":  # Router mode
        response["mode_managed"]["dhcp"] = process_dhcp_get(
            response["mode_managed"]["dhcp"],
            response["mode_managed"]["router_ip"],
            response["mode_managed"]["netmask"],
        )

    return jsonify(response)


def lan_post():
    """
    .. http:post:: /api/lan
        Get LAN router settings.
        See ``update_settings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    if data["mode"] == "managed" and data["mode_managed"]["dhcp"]["enabled"]:  # Router mode
        data["mode_managed"]["dhcp"] = process_dhcp_post(
            data["mode_managed"]["dhcp"],
            data["mode_managed"]["router_ip"],
            data["mode_managed"]["netmask"],
        )
    response = current_app.backend.perform("lan", "update_settings", data)
    return jsonify(response)


def lan_set_client():
    """
    .. http:post:: /api/lan/set_client
        Set LAN DHCP leases manually.
        See ``set_dhcp_client`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    if not data:
        return "Malformed request data", 400

    response = current_app.backend.perform("lan", "set_dhcp_client", data)
    return dhcp_response_to_json_or_error(response, _("Can't create DHCP lease."))


def lan_update_client(client_hostname: str):
    """
    .. http:put:: /api/lan/update_client
        Update LAN DHCP leases manually.
        See ``update_dhcp_client`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    if not data:
        return "Malformed request data", 400

    response = current_app.backend.perform("lan", "update_dhcp_client", {"hostname": client_hostname, **data})
    return dhcp_response_to_json_or_error(response, _("Can't update DHCP lease."))


def lan_delete_client(client_mac: str):
    """
    .. http:delete:: /api/lan/delete_client
        Delete LAN DHCP leases manually.
        See ``delete_dhcp_client`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = current_app.backend.perform("lan", "delete_dhcp_client", {"mac": client_mac})
    return dhcp_response_to_json_or_error(response, _("Can't delete DHCP lease."))


def lan_port_forwardings_get():
    """
    .. http:get:: /api/lan/port-forwarding
        Get LAN port forwardings.
        See ``get_port_forwardings`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = current_app.backend.perform("lan", "get_port_forwardings")
    return jsonify(response)


def lan_port_forwardings_set():
    """
    .. http:post:: /api/lan/port-forwarding
        Add LAN port forwarding.
        See ``port_forwarding_set`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    data = request.json
    if not data:
        return "Malformed request data", 400

    response = current_app.backend.perform("lan", "port_forwarding_set", data)
    return port_forwarding_response_to_json_or_error(response, _("Can't set port forwarding rule."))


def lan_port_forwardings_delete(rule_name: str):
    """Delete LAN port forwarding.
    .. http:delete:: /api/lan/port-forwarding/<rule_name>
        Delete LAN port forwarding.
        See ``port_forwarding_delete`` action in the `foris-controller lan module JSON schema
        <https://gitlab.nic.cz/turris/foris-controller/foris-controller/blob/master/foris_controller_modules/lan/schema/lan.json>`_.
    """
    response = current_app.backend.perform("lan", "port_forwarding_delete", {"names": [rule_name]})
    return port_forwarding_response_to_json_or_error(response, _("Can't delete port forwarding rule."))


# pylint: disable=invalid-name
views = [
    {"rule": "/lan", "view_func": lan_get, "methods": ["GET"]},
    {"rule": "/lan", "view_func": lan_post, "methods": ["POST"]},
    {"rule": "/lan/clients", "view_func": lan_get, "methods": ["GET"]},
    {"rule": "/lan/clients", "view_func": lan_set_client, "methods": ["POST"]},
    {"rule": "/lan/clients/<client_hostname>", "view_func": lan_update_client, "methods": ["PUT"]},
    {"rule": "/lan/clients/<client_mac>", "view_func": lan_delete_client, "methods": ["DELETE"]},
    {"rule": "/lan/port-forwarding", "view_func": lan_port_forwardings_get, "methods": ["GET"]},
    {"rule": "/lan/port-forwarding", "view_func": lan_port_forwardings_set, "methods": ["POST"]},
    {
        "rule": "/lan/port-forwarding/<rule_name>",
        "view_func": lan_port_forwardings_delete,
        "methods": ["DELETE"],
    },
]
