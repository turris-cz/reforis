/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import {
    API_STATE,
    ALERT_TYPES,
    useAPIGet,
    useWSForisModule,
    useAPIDelete,
    useAlert,
    useAPIPost,
    useForm,
    undefinedIfEmpty,
    withoutUndefinedKeys,
    validateIPv4Address,
} from "foris";
import update from "immutability-helper";

import API_URLs from "common/API";
import { EMPTY_RULE } from "portForwarding/constants";

export function usePortForwarding() {
    const [lanDetails, setLanDetails] = useState({});
    const [portForwardingRules, setRules] = useState([]);

    const [lanState, getLanState] = useAPIGet(API_URLs.lan);
    const [portForwardingRulesState, getPortForwardingRules] = useAPIGet(
        API_URLs.portForwarding
    );

    useEffect(() => {
        getPortForwardingRules();
    }, [getPortForwardingRules]);

    useEffect(() => {
        getLanState();
    }, [getLanState]);

    useEffect(() => {
        if (portForwardingRulesState.state === API_STATE.SUCCESS) {
            setRules(portForwardingRulesState.data.rules || []);
        }
    }, [portForwardingRulesState]);

    useEffect(() => {
        if (lanState.state === API_STATE.SUCCESS) {
            setLanDetails(lanState.data);
        }
    }, [lanState]);

    return {
        lanDetails,
        portForwardingRules,
        lanState,
        portForwardingRulesState,
        getPortForwardingRules,
        setRules,
    };
}

export function usePortForwardingRuleDelete(ruleToBeDeleted, refetchRules) {
    const [setAlert] = useAlert();

    const [deleteRuleState, deleteRule] = useAPIDelete(
        `${API_URLs.portForwarding}/${ruleToBeDeleted}`
    );

    useEffect(() => {
        if (deleteRuleState.state === API_STATE.SUCCESS) {
            setAlert(_("Rule deleted successfully."), ALERT_TYPES.SUCCESS);
            refetchRules();
        } else if (deleteRuleState.state === API_STATE.ERROR) {
            setAlert(_("Can't delete rule."));
        }
    }, [deleteRuleState, setAlert, refetchRules]);

    return { deleteRule };
}

export function usePortForwardingWS(
    ws,
    setRules,
    postNewRuleState,
    postOldRuleState
) {
    function usePortForwardingWSAction(action, func) {
        const [wsPortForwardingData] = useWSForisModule(ws, "lan", action);
        useEffect(() => {
            if (
                postNewRuleState.state === API_STATE.SUCCESS ||
                postOldRuleState.state === API_STATE.SUCCESS
            ) {
                if (wsPortForwardingData) {
                    setRules((rules) => func(rules, wsPortForwardingData));
                }
            }
        }, [func, wsPortForwardingData]);
    }

    usePortForwardingWSAction(
        "port_forwarding_set",
        addOrUpdatePortForwardingRule
    );
    usePortForwardingWSAction(
        "port_forwarding_delete",
        deletePortForwardingRule
    );
}

function addOrUpdatePortForwardingRule(rules, rule) {
    const ruleIndex = rules.findIndex(
        (forwardingRule) => forwardingRule.name === rule.name
    );
    if (ruleIndex === -1) {
        return update(rules, { $push: [rule] });
    }
    return update(rules, {
        $splice: [[ruleIndex, 1, { ...rule }]],
    });
}

function deletePortForwardingRule(rules, rule) {
    const ruleIndex = rules.findIndex(
        (forwardingRule) => forwardingRule.name === rule.name
    );
    return update(rules, { $splice: [[ruleIndex, 1]] });
}

export default function useRulesForm(
    rule,
    saveRuleCallback,
    setRuleModalShown
) {
    const [formState, setFormValue, initForm] = useForm(validator);
    const [postNewRuleState, postNewRule] = useAPIPost(API_URLs.portForwarding);
    const [postOldRuleState, postOldRule] = useAPIPost(API_URLs.portForwarding);

    const [setAlert, dismissAlert] = useAlert();

    useEffect(() => {
        if (postNewRuleState.state === API_STATE.SUCCESS) {
            saveRuleCallback();
            initForm(EMPTY_RULE);
            setAlert(_("Rule added successfully."), ALERT_TYPES.SUCCESS);
        } else if (postNewRuleState.state === API_STATE.ERROR) {
            setRuleModalShown(false);
            setAlert(postNewRuleState.data);
        }
    }, [
        setAlert,
        postNewRuleState,
        initForm,
        saveRuleCallback,
        setRuleModalShown,
    ]);

    useEffect(() => {
        if (postOldRuleState.state === API_STATE.SUCCESS) {
            saveRuleCallback();
            setAlert(_("Rule saved successfully."), ALERT_TYPES.SUCCESS);
        } else if (postOldRuleState.state === API_STATE.ERROR) {
            setRuleModalShown(false);
            setAlert(postOldRuleState.data);
        }
    }, [postOldRuleState, saveRuleCallback, setAlert, setRuleModalShown]);

    useEffect(() => {
        if (rule) {
            initForm(rule);
        } else {
            initForm(EMPTY_RULE);
        }
    }, [rule, initForm]);

    function saveForwardingRule() {
        const { data } = formState;
        dismissAlert();
        if (rule) {
            const changedRule = { ...data, old_name: rule.name };
            postOldRule({ data: changedRule });
        } else {
            postNewRule({ data });
        }
    }

    return [
        formState,
        setFormValue,
        postNewRuleState,
        postOldRuleState,
        saveForwardingRule,
    ];
}

function validator(formData) {
    const errors = {
        name: validateName(formData.name),
        src_dport: validatePortField(formData.src_dport, "External port"),
        dest_ip: validateIPv4AddressField(formData.dest_ip),
        dest_port: validatePortField(formData.dest_port, "Internal port"),
    };

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}

function validateName(name) {
    return name.length < 1
        ? _("Name should have at least one symbol.")
        : undefined;
}

function validatePortField(port, fieldName) {
    const portPattern = /^(?:(\d{1,5})-)?(\d{1,5})$/;
    if (typeof port !== "string") {
        port = port.toString();
    }
    if (port.length < 1) {
        return _(
            `${fieldName} should be a positive number or range of numbers.`
        );
    }
    const match = port.match(portPattern);
    if (!match) {
        return _(`${fieldName} should be a valid port number or range.`);
    }
    const [, startPort, endPort] = match;
    if (
        (startPort && !isValidPortNumber(startPort)) ||
        !isValidPortNumber(endPort)
    ) {
        return _(`${fieldName} should be a valid port number or range.`);
    }
    return undefined;
}

function validateIPv4AddressField(ip) {
    return ip.length < 1
        ? _("IPv4 address cannot be empty.")
        : validateIPv4Address(ip);
}

function isValidPortNumber(port) {
    const portNumber = parseInt(port, 10);
    return (
        Number.isInteger(portNumber) && portNumber >= 0 && portNumber <= 65535
    );
}
