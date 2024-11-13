/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect, useCallback } from "react";

import {
    Button,
    withErrorMessage,
    withSpinnerOnSending,
    formFieldsSize,
    ForisURLs,
} from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import useRulesForm, {
    usePortForwarding,
    usePortForwardingWS,
    usePortForwardingRuleDelete,
} from "portForwarding/hooks";
import RulesModal from "portForwarding/PortForwardingRulesModal";
import RulesTable from "portForwarding/PortForwardingRulesTable";

PortForwarding.propTypes = {
    ws: PropTypes.object,
};

export default function PortForwarding({ ws }) {
    const {
        lanDetails,
        portForwardingRules,
        lanState,
        portForwardingRulesState,
        getPortForwardingRules,
        setRules,
    } = usePortForwarding();

    const staticLeases =
        lanDetails.mode_managed?.dhcp?.clients?.filter(
            (client) => client.static
        ) || [];

    return (
        <>
            <h1>{_("Port Forwarding")}</h1>
            <p className="mb-0">
                {_(
                    "Port forwarding allows you to forward incoming traffic from the WAN interface to a specific device on your LAN."
                )}
            </p>
            <p>
                {_(
                    "For example, you can forward incoming traffic on port 80 to a web server on your LAN. This way, the web server will be accessible from the internet."
                )}
            </p>
            <p>
                {_(
                    'You can add a new port forwarding rule by clicking the "Add rule" button. But first, you need to configure a static DHCP lease for the device you want to forward traffic to. You can configure it on the '
                )}
                {_("")}
                <Link to={ForisURLs.lanSettings}>{_("LAN")}</Link>
                {_(" page.")}
            </p>
            <PortForwardingWithErrorAndSpinner
                apiState={[portForwardingRulesState.state, lanState.state]}
                rulesList={portForwardingRules}
                staticLeases={staticLeases}
                refetchPortForwardingRules={getPortForwardingRules}
                setRules={setRules}
                ws={ws}
            />
        </>
    );
}

PortForwardingConfigurator.propTypes = {
    rulesList: PropTypes.array,
    staticLeases: PropTypes.array,
    refetchPortForwardingRules: PropTypes.func,
    setRules: PropTypes.func,
    ws: PropTypes.object,
};

function PortForwardingConfigurator({
    rulesList,
    staticLeases,
    refetchPortForwardingRules,
    setRules,
    ws,
}) {
    const [ruleToEdit, setRuleToEdit] = useState(null);
    const [ruleModalShown, setRuleModalShown] = useState(false);
    const [ruleToBeDeleted, setRuleToBeDeleted] = useState(null);

    const { deleteRule } = usePortForwardingRuleDelete(
        ruleToBeDeleted,
        refetchPortForwardingRules
    );

    const postCallback = useCallback(() => {
        setRuleModalShown(false);
        refetchPortForwardingRules();
    }, [setRuleModalShown, refetchPortForwardingRules]);

    const [
        formState,
        setFormValue,
        postNewRuleState,
        postOldRuleState,
        saveForwardingRule,
    ] = useRulesForm(ruleToEdit, postCallback, setRuleModalShown);

    usePortForwardingWS(ws, setRules, postNewRuleState, postOldRuleState);

    const handleAddRule = () => {
        setRuleToEdit(null);
        setRuleModalShown(true);
    };

    const handleEditRule = (rule) => {
        setRuleToEdit(rule);
        setRuleModalShown(true);
    };

    const handleDeleteRule = (name) => {
        setRuleToBeDeleted(name);
    };

    useEffect(() => {
        if (ruleToBeDeleted) {
            deleteRule();
        }
    }, [ruleToBeDeleted, deleteRule]);

    const ruleModalTitle = ruleToEdit
        ? _("Edit port forwarding rule")
        : _("Add port forwarding rule");

    return (
        <div className={formFieldsSize}>
            <RulesTable
                rules={rulesList}
                onEditRule={handleEditRule}
                onDeleteRule={handleDeleteRule}
            />
            <AddRuleButton addRule={handleAddRule} />
            <RulesModal
                shown={ruleModalShown}
                setShown={setRuleModalShown}
                title={ruleModalTitle}
                rule={ruleToEdit}
                staticLeases={staticLeases}
                formState={formState}
                setFormValue={setFormValue}
                saveForwardingRule={saveForwardingRule}
                postOldRuleState={postOldRuleState}
                postNewRuleState={postNewRuleState}
            />
        </div>
    );
}

const PortForwardingWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(PortForwardingConfigurator)
);

AddRuleButton.propTypes = {
    addRule: PropTypes.func,
};

function AddRuleButton({ addRule }) {
    return (
        <div className="text-end">
            <Button
                forisFormSize
                className="btn-primary btn mb-3 mb-sm-2 mb-md-0"
                onClick={addRule}
            >
                {_("Add rule")}
            </Button>
        </div>
    );
}
