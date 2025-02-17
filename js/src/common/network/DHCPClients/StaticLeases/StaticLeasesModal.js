/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    API_STATE,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
} from "foris";
import PropTypes from "prop-types";

import StaticLeasesModalForm from "./StaticLeasesModalForm";

StaticLeaseModal.propTypes = {
    shown: PropTypes.bool,
    setShown: PropTypes.func,
    title: PropTypes.string,
    lease: PropTypes.object,
    staticLeases: PropTypes.array,
    formState: PropTypes.object,
    setFormValue: PropTypes.func,
    postState: PropTypes.object,
    putState: PropTypes.object,
    saveLease: PropTypes.func,
};

export default function StaticLeaseModal({
    shown,
    setShown,
    title,
    lease,
    staticLeases,
    formState,
    setFormValue,
    postState,
    putState,
    saveLease,
}) {
    const saveBtnDisabled =
        postState.state === API_STATE.SENDING ||
        putState.state === API_STATE.SENDING ||
        !!formState.errors;
    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <StaticLeasesModalForm
                    lease={lease}
                    staticLeases={staticLeases}
                    formState={formState}
                    setFormValue={setFormValue}
                    postState={postState}
                    putState={putState}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-secondary"
                    onClick={() => setShown(false)}
                >
                    {_("Cancel")}
                </Button>
                <Button onClick={saveLease} disabled={saveBtnDisabled}>
                    {_("Save")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
