/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect } from "react";

import { withSpinnerOnSending, withErrorMessage } from "foris";
import PropTypes from "prop-types";

import useDHCPLeases, {
    useAddStaticLease,
} from "common/network/DHCPClients/hooks";
import StaticLeasesAddButton from "common/network/DHCPClients/StaticLeases/StaticLeasesAddButton";
import StaticLeasesModal from "common/network/DHCPClients/StaticLeases/StaticLeasesModal";
import StaticLeasesTable from "common/network/DHCPClients/StaticLeases/StaticLeasesTable";

export default function DHCPClientsWithStaticLeases() {
    const { leases, getLeases, getLeasesResponseState } = useDHCPLeases();

    return (
        <StaticLeaseHandlerWithErrorAndSpinner
            leases={leases}
            getLeases={getLeases}
            apiState={getLeasesResponseState}
        />
    );
}

StaticLeaseHandler.propTypes = {
    leases: PropTypes.array,
    getLeases: PropTypes.func,
};

function StaticLeaseHandler({ leases, getLeases }) {
    const [leaseToEdit, setLeaseToEdit] = useState(null);
    const [leaseModalShown, setLeaseModalShown] = useState(false);
    const [leaseToBeDeleted, setLeaseToBeDeleted] = useState(null);
    const [loading, setLoading] = useState(false);

    const deleteStaticLease = useAddStaticLease(leaseToBeDeleted, getLeases);

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
            setLoading(true);
            deleteStaticLease();
        }
    }, [leaseToBeDeleted, deleteStaticLease]);

    let modalTitle = _("Add static lease");
    if (leaseToEdit?.static) {
        modalTitle = _("Edit static lease");
    } else if (leaseToEdit && !leaseToEdit?.static) {
        modalTitle = _("Set static lease");
    } else {
        modalTitle = _("Add static lease");
    }

    return (
        <>
            <StaticLeasesTable
                leases={leases}
                onEditLease={handleEditStaticLease}
                onDeleteLease={handleDeleteStaticLease}
                leaseToBeDeleted={leaseToBeDeleted}
                disabled={loading}
                loading={loading}
            />
            <StaticLeasesAddButton addStaticLease={handleAddStaticLease} />
            <StaticLeasesModal
                shown={leaseModalShown}
                setShown={setLeaseModalShown}
                title={modalTitle}
                lease={leaseToEdit}
                leases={leases}
                getLeases={getLeases}
            />
        </>
    );
}

const StaticLeaseHandlerWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(StaticLeaseHandler)
);
