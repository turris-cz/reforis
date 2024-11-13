/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "foris";
import PropTypes from "prop-types";

import RulesForm from "portForwarding/PortForwardingRulesForm";

RulesModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    rule: PropTypes.object,
    staticLeases: PropTypes.array,
    formState: PropTypes.object,
    setFormValue: PropTypes.func,
    saveForwardingRule: PropTypes.func,
    postNewRuleState: PropTypes.object,
    postOldRuleState: PropTypes.object,
};

export default function RulesModal({
    shown,
    setShown,
    title,
    rule,
    staticLeases,
    formState,
    setFormValue,
    saveForwardingRule,
    postNewRuleState,
    postOldRuleState,
}) {
    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <RulesForm
                    rule={rule}
                    staticLeases={staticLeases}
                    formState={formState}
                    setFormValue={setFormValue}
                    postNewRuleState={postNewRuleState}
                    postOldRuleState={postOldRuleState}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-secondary"
                    onClick={() => setShown(false)}
                >
                    {_("Close")}
                </Button>
                <Button
                    onClick={saveForwardingRule}
                    disabled={!!formState.errors}
                >
                    {_("Save")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
