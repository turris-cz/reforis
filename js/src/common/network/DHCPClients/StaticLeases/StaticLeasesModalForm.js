/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { API_STATE, Spinner, TextInput } from "foris";
import PropTypes from "prop-types";

StaticLeasesModalForm.propTypes = {
    formState: PropTypes.object,
    setFormValue: PropTypes.func,
    postState: PropTypes.object,
    clients: PropTypes.array,
};

export default function StaticLeasesModalForm({
    formState,
    setFormValue,
    postState,
    clients,
}) {
    if (!formState.data) return <Spinner className="text-center" />;

    const formErrors = formState.errors || {};
    const disabled = postState.state === API_STATE.SENDING;

    return (
        <>
            <TextInput
                label={_("Hostname")}
                value={formState.data.hostname}
                error={formErrors.hostname}
                list="hostnames"
                onChange={setFormValue((value) => ({
                    hostname: { $set: value },
                }))}
                disabled={disabled}
            >
                <datalist
                    id="hostnames"
                    aria-label={_("List of available hostnames")}
                >
                    {clients.map((client, index) => (
                        <option
                            key={index.toString()}
                            value={client.hostname}
                            label={client.hostname}
                        />
                    ))}
                </datalist>
            </TextInput>
            <TextInput
                label={_("IPv4 address")}
                value={formState.data.ip}
                error={formErrors.ip}
                list="addresses"
                onChange={setFormValue((value) => ({
                    ip: { $set: value },
                }))}
                disabled={disabled}
            >
                <datalist
                    id="addresses"
                    aria-label={_("List of available IPv4 addresses")}
                >
                    {clients.map((client, index) => (
                        <option
                            key={index.toString()}
                            value={client.ip}
                            label={client.hostname}
                        >
                            {client.hostname}
                        </option>
                    ))}
                </datalist>
            </TextInput>
            <TextInput
                label={_("MAC address")}
                value={formState.data.mac}
                error={formErrors.mac}
                list="macs"
                onChange={setFormValue((value) => ({
                    mac: { $set: value },
                }))}
                disabled={disabled}
            >
                <datalist
                    id="macs"
                    aria-label={_("List of available MAC addresses")}
                >
                    {clients.map((client, index) => (
                        <option
                            key={index.toString()}
                            value={client.mac}
                            label={client.hostname}
                        >
                            {client.hostname}
                        </option>
                    ))}
                </datalist>
            </TextInput>
        </>
    );
}
