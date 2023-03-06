/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import {
    Button,
    WebSockets,
    withSpinnerOnSending,
    withErrorMessage,
} from "foris";
import PropTypes from "prop-types";

import useStaticLeasesList from "./hooks";
import StaticLeasesModal from "./StaticLeases/StaticLeasesModal";
import StaticLeasesTable from "./StaticLeases/StaticLeasesTable";

DHCPClientsWithStaticLeases.propTypes = {
    ws: PropTypes.instanceOf(WebSockets),
};

export default function DHCPClientsWithStaticLeases({ ws }) {
    const [staticLeasesList, staticLeasesListState] = useStaticLeasesList(ws);

    return (
        <StaticLeasesFormWithErrorAndSpinner
            apiState={staticLeasesListState}
            leaseList={staticLeasesList}
        />
    );
}

StaticLeasesForm.propTypes = {
    leaseList: PropTypes.array,
};

function StaticLeasesForm({ leaseList }) {
    const [leaseToEdit, setLeaseToEdit] = useState(null);
    const [leaseModalShown, setLeaseModalShown] = useState(false);

    const handleEditStaticLease = (lease) => {
        setLeaseToEdit(lease);
        setLeaseModalShown(true);
    };

    const handleAddStaticLease = () => {
        setLeaseToEdit(null);
        setLeaseModalShown(true);
    };

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
                clients={leaseList}
                editStaticLease={handleEditStaticLease}
            />
            <AddStaticLeaseButton addStaticLease={handleAddStaticLease} />
            <StaticLeasesModal
                shown={leaseModalShown}
                setShown={setLeaseModalShown}
                lease={leaseToEdit}
                clients={leaseList}
                title={modalTitle}
            />
        </>
    );
}

const StaticLeasesFormWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(StaticLeasesForm)
);

AddStaticLeaseButton.propTypes = {
    addStaticLease: PropTypes.func,
};

function AddStaticLeaseButton({ addStaticLease }) {
    return (
        <div className="text-right">
            <Button
                className="btn-outline-primary"
                forisFormSize
                onClick={addStaticLease}
            >
                {_("Add static lease")}
            </Button>
        </div>
    );
}
