/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback } from "react";

import {
    API_STATE,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
} from "foris";
import PropTypes from "prop-types";

import { useStaticLeaseModalForm } from "common/network/DHCPClients/hooks";
import StaticLeasesModalForm from "common/network/DHCPClients/StaticLeases/StaticLeasesModalForm";

StaticLeaseModal.propTypes = {
    shown: PropTypes.bool,
    setShown: PropTypes.func,
    title: PropTypes.string,
    lease: PropTypes.object,
    leases: PropTypes.array,
    getLeases: PropTypes.func,
};

export default function StaticLeaseModal({
    shown,
    setShown,
    title,
    lease,
    leases,
    getLeases,
}) {
    const closeLeaseModalCallback = useCallback(() => {
        getLeases();
        setShown(false);
    }, [setShown, getLeases]);

    const [formState, setFormValue, postState, putState, saveLease] =
        useStaticLeaseModalForm(lease, closeLeaseModalCallback, setShown);

    const isLoading =
        postState.state === API_STATE.SENDING ||
        putState.state === API_STATE.SENDING;

    const isSaveButtonDisabled =
        postState.state === API_STATE.SENDING ||
        putState.state === API_STATE.SENDING ||
        !!formState.errors;

    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <StaticLeasesModalForm
                    lease={lease}
                    leases={leases}
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
                <Button
                    onClick={saveLease}
                    loading={isLoading}
                    disabled={isSaveButtonDisabled}
                >
                    {_("Save")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
