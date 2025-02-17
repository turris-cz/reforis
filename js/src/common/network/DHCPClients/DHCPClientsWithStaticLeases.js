/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect, useCallback } from "react";

import {
    Button,
    WebSockets,
    withSpinnerOnSending,
    withErrorMessage,
} from "foris";
import PropTypes from "prop-types";

import useStaticLeases, {
    useStaticLeaseWS,
    useStaticLeaseDelete,
    useStaticLeaseModalForm,
} from "common/network/DHCPClients/hooks";
import StaticLeasesModal from "common/network/DHCPClients/StaticLeases/StaticLeasesModal";
import StaticLeasesTable from "common/network/DHCPClients/StaticLeases/StaticLeasesTable";

DHCPClientsWithStaticLeases.propTypes = {
    ws: PropTypes.instanceOf(WebSockets),
};

export default function DHCPClientsWithStaticLeases({ ws }) {
    const { staticLeases, staticLeasesState } = useStaticLeases();

    return (
        <StaticLeasesFormWithErrorAndSpinner
            ws={ws}
            apiState={staticLeasesState}
            staticLeases={staticLeases}
        />
    );
}

StaticLeasesConfigurator.propTypes = {
    ws: PropTypes.object,
    staticLeases: PropTypes.array,
};

function StaticLeasesConfigurator({ ws, staticLeases }) {
    const [leaseToEdit, setLeaseToEdit] = useState(null);
    const [leaseModalShown, setLeaseModalShown] = useState(false);
    const [leaseToBeDeleted, setLeaseToBeDeleted] = useState(null);

    const { deleteStaticLease } = useStaticLeaseDelete(leaseToBeDeleted);

    const postCallback = useCallback(() => {
        setLeaseModalShown(false);
    }, [setLeaseModalShown]);

    const [formState, setFormValue, postState, putState, saveLease] =
        useStaticLeaseModalForm(leaseToEdit, postCallback, setLeaseModalShown);

    useStaticLeaseWS(ws, () => {});

    const handleAddStaticLease = () => {
        setLeaseToEdit(null);
        setLeaseModalShown(true);
    };

    const handleEditStaticLease = (lease) => {
        setLeaseToEdit(lease);
        setLeaseModalShown(true);
    };

    const handleDeleteStaticLease = (lease) => {
        setLeaseToBeDeleted(lease);
    };

    useEffect(() => {
        if (leaseToBeDeleted) {
            deleteStaticLease();
        }
    }, [leaseToBeDeleted, deleteStaticLease]);

    let modalTitle;
    if (leaseToEdit && leaseToEdit.static) {
        modalTitle = _("Edit static lease");
    } else if (leaseToEdit && !leaseToEdit.static) {
        modalTitle = _("Set static lease");
    } else {
        modalTitle = _("Add static lease");
    }

    return (
        <>
            <StaticLeasesTable
                ws={ws}
                staticLeases={staticLeases}
                onEditLease={handleEditStaticLease}
                onDeleteLease={handleDeleteStaticLease}
            />
            <AddStaticLeaseButton addStaticLease={handleAddStaticLease} />
            <StaticLeasesModal
                shown={leaseModalShown}
                setShown={setLeaseModalShown}
                title={modalTitle}
                lease={leaseToEdit}
                staticLeases={staticLeases}
                formState={formState}
                setFormValue={setFormValue}
                postState={postState}
                putState={putState}
                saveLease={saveLease}
            />
        </>
    );
}

const StaticLeasesFormWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(StaticLeasesConfigurator)
);

AddStaticLeaseButton.propTypes = {
    addStaticLease: PropTypes.func,
};

function AddStaticLeaseButton({ addStaticLease }) {
    return (
        <div className="text-end">
            <Button
                forisFormSize
                className="btn-outline-primary"
                onClick={addStaticLease}
            >
                {_("Add static lease")}
            </Button>
        </div>
    );
}
