/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
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

import useStaticLeaseModalForm from "./hooks";
import StaticLeasesModalForm from "./StaticLeasesModalForm";

StaticLeaseModal.propTypes = {
    lease: PropTypes.object,
    shown: PropTypes.bool,
    setShown: PropTypes.func,
    title: PropTypes.string,
    clients: PropTypes.array,
};

export default function StaticLeaseModal({
    shown,
    setShown,
    title,
    lease,
    clients,
}) {
    const postCallback = useCallback(() => {
        setShown(false);
    }, [setShown]);

    const [formState, setFormValue, postState, putState, saveLease] =
        useStaticLeaseModalForm(lease, postCallback);

    const saveBtnDisabled =
        postState.state === API_STATE.SENDING ||
        putState.state === API_STATE.SENDING ||
        !!formState.errors;
    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <StaticLeasesModalForm
                    clients={clients}
                    formState={formState}
                    setFormValue={setFormValue}
                    postState={postState}
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
