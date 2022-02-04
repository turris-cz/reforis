/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "foris";

import StaticLeasesModalForm from "./StaticLeasesModalForm";
import useStaticLeaseModalForm from "./hooks";

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

    const [
        formState,
        setFormValue,
        postState,
        saveLease,
    ] = useStaticLeaseModalForm(lease, postCallback);

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
                <Button onClick={saveLease} disabled={!!formState.errors}>
                    {_("Save")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
