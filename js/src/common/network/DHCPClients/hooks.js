/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import { API_STATE, useAPIGet, useWSForisModule } from "foris";
import update from "immutability-helper";

import API_URLs from "common/API";

const MODULE = "lan";

export default function useStaticLeasesList(ws) {
    const [staticLeases, setStaticLeases] = useState([]);

    const [staticLeasesListState, getStaticLeasesList] = useAPIGet(
        API_URLs.lanClients
    );

    useEffect(() => {
        getStaticLeasesList();
    }, [getStaticLeasesList]);

    useEffect(() => {
        if (staticLeasesListState.state === API_STATE.SUCCESS) {
            setStaticLeases(
                staticLeasesListState.data.mode_managed.dhcp.clients || []
            );
        }
    }, [staticLeasesListState]);

    useStaticLeaseWS(ws, setStaticLeases, getStaticLeasesList);

    return [sortStaticLeases(staticLeases), staticLeasesListState.state];
}

function sortStaticLeases(leases) {
    return leases.sort((a, b) => {
        if (a.static === b.static) {
            return a.hostname.localeCompare(b.hostname);
        }
        return a.static ? 1 : -1;
    });
}

function useStaticLeaseWS(ws, setStaticLeases, getStaticLeasesList) {
    function useStaticLeaseWSAction(action, func) {
        const [wsLeaseData] = useWSForisModule(ws, MODULE, action);
        useEffect(() => {
            if (wsLeaseData) {
                setStaticLeases((leases) => func(leases, wsLeaseData));
                getStaticLeasesList();
            }
        }, [func, wsLeaseData]);
    }

    useStaticLeaseWSAction("set_dhcp_client", addStaticLease);
    useStaticLeaseWSAction("update_dhcp_client", setStaticLease);
    useStaticLeaseWSAction("delete_dhcp_client", deleteStaticLease);
}

function addStaticLease(leases, lease) {
    return update(leases, { $push: [{ static: true, ...lease }] });
}

function setStaticLease(leases, lease) {
    const leaseIndex = leases.findIndex(
        (staticLease) => staticLease.hostname === lease.hostname
    );
    return update(leases, {
        $splice: [[leaseIndex, 1, { static: true, ...lease }]],
    });
}

function deleteStaticLease(leases, lease) {
    const leaseIndex = leases.findIndex(
        (staticLease) => staticLease.mac === lease.mac
    );
    return update(leases, { $splice: [[leaseIndex, 1]] });
}
