/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "foris";

const DNSSEC_DISABLE_INTRO = _(
    "DNSSEC is a security technology that protects DNS communication against attacks on the DNS infrastructure."
);

const DNSSEC_DISABLE_REQ = _(
    "We strongly recommend keeping DNSSEC validation enabled unless you know that you will be connecting your device to the network where DNSSEC is broken."
);

const DNSSEC_DISABLE_Q = _(
    "Do you still want to continue and stay unprotected?"
);

DNSSECDisableModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

export default function DNSSECDisableModal({ shown, setShown, callback }) {
    return (
        <Modal setShown={setShown} shown={shown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p>{DNSSEC_DISABLE_INTRO}</p>
                <p>{DNSSEC_DISABLE_REQ}</p>
                <p>{DNSSEC_DISABLE_Q}</p>
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        setShown(false);
                    }}
                >
                    {_("Cancel")}
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        callback();
                    }}
                >
                    {_("Disable DNSSEC")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
