/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import { API_STATE, Spinner, TextInput, Switch } from "foris";
import PropTypes from "prop-types";

import { HELP_TEXTS } from "portForwarding/constants";

RulesForm.propTypes = {
    formState: PropTypes.object.isRequired,
    setFormValue: PropTypes.func.isRequired,
    postNewRuleState: PropTypes.object.isRequired,
    postOldRuleState: PropTypes.object.isRequired,
    staticLeases: PropTypes.array.isRequired,
};

export default function RulesForm({
    formState,
    setFormValue,
    postNewRuleState,
    postOldRuleState,
    staticLeases,
}) {
    const [errorNameFeedback, setErrorNameFeedback] = useState(false);
    const [errorDestIpFeedback, setErrorDestIpFeedback] = useState(false);
    const [errorSrcDportFeedback, setErrorSrcDportFeedback] = useState(false);
    const [errorDestPortFeedback, setErrorDestPortFeedback] = useState(false);

    const formData = formState.data;
    const formErrors = formState.errors || {};

    if (!formData) return <Spinner className="text-center" />;

    const disabled =
        postNewRuleState.state === API_STATE.SENDING ||
        postOldRuleState.state === API_STATE.SENDING;
    return (
        <>
            <TextInput
                label={_("Name")}
                value={formData.name}
                error={errorNameFeedback ? formErrors.name : undefined}
                helpText={HELP_TEXTS.name}
                onChange={setFormValue((value) => ({
                    name: { $set: value },
                }))}
                onFocus={() => setErrorNameFeedback(true)}
                disabled={disabled}
            />
            <TextInput
                label={_("Internal IPv4 address")}
                value={formData.dest_ip}
                error={errorDestIpFeedback ? formErrors.dest_ip : undefined}
                helpText={HELP_TEXTS.dest_ip}
                list="addresses"
                onChange={setFormValue((value) => ({
                    dest_ip: { $set: value },
                }))}
                onFocus={() => setErrorDestIpFeedback(true)}
                disabled={disabled}
                className="rounded"
            >
                <datalist
                    id="addresses"
                    aria-label={_("List of available IPv4 addresses")}
                >
                    {staticLeases.map((lease) => (
                        <option
                            key={lease.ip}
                            value={lease.ip}
                            label={lease.hostname}
                        >
                            {lease.hostname}
                        </option>
                    ))}
                </datalist>
            </TextInput>
            <TextInput
                label={_("External port")}
                value={formData.src_dport}
                error={errorSrcDportFeedback ? formErrors.src_dport : undefined}
                helpText={HELP_TEXTS.src_dport}
                onChange={setFormValue((value) => ({
                    src_dport: { $set: value },
                }))}
                onFocus={() => setErrorSrcDportFeedback(true)}
                disabled={disabled}
            />
            <TextInput
                label={_("Internal port")}
                value={formData.dest_port}
                error={errorDestPortFeedback ? formErrors.dest_port : undefined}
                helpText={HELP_TEXTS.dest_port}
                onChange={setFormValue((value) => ({
                    dest_port: { $set: value },
                }))}
                onFocus={() => setErrorDestPortFeedback(true)}
                disabled={disabled}
            />
            <Switch
                label={_("Enabled")}
                checked={formData.enabled}
                helpText={HELP_TEXTS.enabled}
                onChange={setFormValue((value) => ({
                    enabled: { $set: value },
                }))}
                disabled={disabled}
            />
        </>
    );
}
