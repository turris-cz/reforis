/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button, Select, Spinner, TextInput, API_STATE } from "foris";
import PropTypes from "prop-types";

import useForwarderForm from "./hooks";
import IPAddressesForm from "./IPAddressesForm";
import forwarderPropTypes from "../propTypes";

const TLS_TYPES = {
    no: "No TLS",
    hostname: "Hostname",
    pin: "Pin",
};

const HELP_TEXTS = {
    tls_pin: _("Base 64 encoded SHA-256."),
    no_tls: _('"No TLS" means that the regular UDP-base DNS protocol is used.'),
};

ForwarderForm.propTypes = {
    forwarder: forwarderPropTypes,
    saveForwarderCallback: PropTypes.func,
};

export default function ForwarderForm({ forwarder, saveForwarderCallback }) {
    const [formState, setFormValue, postState, saveForwarder] =
        useForwarderForm(forwarder, saveForwarderCallback);

    if (!formState.data) return <Spinner className="text-center" />;

    const disabled = postState.state === API_STATE.SENDING;
    const formData = formState.data;
    const formErrors = formState.errors || {};

    return (
        <>
            <TextInput
                label={_("Name")}
                value={formData.description}
                error={formErrors.description}
                onChange={setFormValue((value) => ({
                    description: { $set: value },
                }))}
                disabled={disabled}
            />
            <IPAddressesForm
                ipVersion="ipv4"
                ipaddresses={formData.ipaddresses.ipv4}
                setFormValue={setFormValue}
                errors={(formErrors.ipaddresses || {}).ipv4}
                disabled={disabled}
            />
            <IPAddressesForm
                ipVersion="ipv6"
                ipaddresses={formData.ipaddresses.ipv6}
                setFormValue={setFormValue}
                errors={(formErrors.ipaddresses || {}).ipv6}
                disabled={disabled}
            />
            <Select
                label={_("TLS type")}
                value={formData.tls_type}
                choices={TLS_TYPES}
                helpText={formData.tls_type === "no" && HELP_TEXTS.no_tls}
                onChange={setFormValue((value) => {
                    const fieldsToAdd = {
                        hostname: "tls_hostname",
                        pin: "tls_pin",
                    };
                    return {
                        tls_type: { $set: value },
                        [fieldsToAdd[value]]: { $set: "" },
                    };
                })}
                disabled={disabled}
            />
            {formData.tls_type === "hostname" && (
                <TextInput
                    label={_("TLS hostname")}
                    value={formData.tls_hostname || ""}
                    error={formErrors.tls_hostname}
                    onChange={setFormValue((value) => ({
                        tls_hostname: { $set: value },
                    }))}
                    disabled={disabled}
                />
            )}

            {formData.tls_type === "pin" && (
                <TextInput
                    label={_("TLS pin")}
                    value={formData.tls_pin || ""}
                    error={formErrors.tls_pin}
                    helpText={HELP_TEXTS.tls_pin}
                    onChange={setFormValue((value) => ({
                        tls_pin: { $set: value },
                    }))}
                    disabled={disabled}
                />
            )}
            <Button
                onClick={saveForwarder}
                forisFormSize
                className="btn-primary col-lg-12 col-md-12"
                disabled={!!formState.errors}
            >
                {_("Save")}
            </Button>
        </>
    );
}
