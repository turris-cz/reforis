/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useState } from "react";

import {
    API_STATE,
    useAPIGet,
    useWSForisModule,
    ALERT_TYPES,
    useAlert,
    useAPIPost,
    useAPIPut,
    useAPIDelete,
    useForm,
    undefinedIfEmpty,
    validateIPv4Address,
    validateMAC,
    withoutUndefinedKeys,
    validateHostname,
} from "foris";
import update from "immutability-helper";

import API_URLs from "common/API";

function sortLeasesByStaticPriority(leases) {
    return leases.sort((a, b) => {
        if (a.static === b.static) {
            return a.hostname.localeCompare(b.hostname);
        }
        return a.static ? 1 : -1;
    });
}

export default function useStaticLeases() {
    const [staticLeases, setStaticLeases] = useState([]);

    const [staticLeasesState, getStaticLeases] = useAPIGet(API_URLs.lanClients);

    useEffect(() => {
        getStaticLeases();
    }, [getStaticLeases]);

    useEffect(() => {
        if (staticLeasesState.state === API_STATE.SUCCESS) {
            setStaticLeases(
                staticLeasesState.data.mode_managed.dhcp.clients || []
            );
        }
    }, [staticLeasesState]);

    return {
        staticLeases: sortLeasesByStaticPriority(staticLeases),
        staticLeasesState,
        getStaticLeases,
        setStaticLeases,
    };
}

export function useStaticLeaseDelete(leaseToBeDeleted) {
    const [setAlert] = useAlert();
    const [deleteStaticLeaseResponse, deleteStaticLease] = useAPIDelete(
        leaseToBeDeleted
            ? `${API_URLs.lanClients}/${leaseToBeDeleted.mac}`
            : null
    );

    useEffect(() => {
        if (deleteStaticLeaseResponse.state === API_STATE.SUCCESS) {
            setAlert(
                _("Static lease deleted successfully."),
                ALERT_TYPES.SUCCESS
            );
        } else if (deleteStaticLeaseResponse.state === API_STATE.ERROR) {
            setAlert(_("Can't delete static lease."), ALERT_TYPES.ERROR);
        }
    }, [deleteStaticLeaseResponse, setAlert]);

    return { deleteStaticLease };
}

export function useStaticLeaseWS(ws, setStaticLeases) {
    function useStaticLeaseWSAction(action, func) {
        const [wsLeaseData] = useWSForisModule(ws, "lan", action);
        useEffect(() => {
            if (wsLeaseData) {
                setStaticLeases((leases) => func(leases, wsLeaseData));
            }
        }, [func, wsLeaseData]);
    }

    useStaticLeaseWSAction("set_dhcp_client", addStaticLease);
    useStaticLeaseWSAction("update_dhcp_client", setStaticLease);
    useStaticLeaseWSAction("delete_dhcp_client", removeStaticLease);
}

function addStaticLease(leases, lease) {
    const leaseIndex = leases.findIndex(
        (staticLease) => staticLease.mac === lease.mac
    );
    // If the lease is already in the list, update it
    if (leaseIndex !== -1) {
        return update(leases, {
            [leaseIndex]: { $merge: { static: true } },
        });
    }

    return update(leases, { $push: [{ static: true, ...lease }] });
}

function setStaticLease(leases, lease) {
    if (!leases || leases.length === 0) {
        return [];
    }
    const leaseIndex = leases.findIndex(
        (staticLease) => staticLease.mac === lease.mac
    );
    if (leaseIndex === -1) {
        return leases;
    }
    return update(leases, {
        [leaseIndex]: { $merge: { static: true, ...lease } },
    });
}

function removeStaticLease(leases, lease) {
    if (!leases || leases.length === 0) {
        return [];
    }
    const leaseIndex = leases.findIndex(
        (staticLease) => staticLease.mac === lease.mac
    );
    if (leaseIndex === -1) {
        return leases;
    }
    const leaseToDelete = leases[leaseIndex];
    if (!leaseToDelete.expires) {
        // Remove the lease if it doesn't have an expiration date
        return update(leases, { $splice: [[leaseIndex, 1]] });
    }
    // Mark the lease as non-static if it has an expiration date
    return update(leases, {
        [leaseIndex]: { $merge: { static: false } },
    });
}

const EMPTY_LEASE = {
    hostname: "",
    ip: "",
    mac: "",
};

export function useStaticLeaseModalForm(
    lease,
    saveStaticLeaseCallback,
    setLeaseModalShown
) {
    const [formState, setFormValue, initForm] = useForm(validator);
    const [postState, post] = useAPIPost(API_URLs.lanClients);
    const [putState, put] = useAPIPut(
        `${API_URLs.lanClients}/${(lease || {}).hostname}`
    );

    const [setAlert, dismissAlert] = useAlert();

    useEffect(() => {
        if (postState.state === API_STATE.SUCCESS) {
            saveStaticLeaseCallback();
            initForm(EMPTY_LEASE);
            setAlert(
                _("Static lease added successfully."),
                ALERT_TYPES.SUCCESS
            );
        } else if (postState.state === API_STATE.ERROR) {
            setLeaseModalShown(false);
            setAlert(postState.data);
        }
    }, [
        setAlert,
        postState,
        initForm,
        saveStaticLeaseCallback,
        setLeaseModalShown,
    ]);

    useEffect(() => {
        if (putState.state === API_STATE.SUCCESS) {
            saveStaticLeaseCallback();
            setAlert(_("Static saved successfully."), ALERT_TYPES.SUCCESS);
        } else if (putState.state === API_STATE.ERROR) {
            setLeaseModalShown(false);
            setAlert(putState.data);
        }
    }, [putState, saveStaticLeaseCallback, setAlert, setLeaseModalShown]);

    useEffect(() => {
        if (lease) {
            initForm(lease);
        } else {
            initForm(EMPTY_LEASE);
        }
    }, [lease, initForm]);

    function saveLease() {
        const data = prepDataToSubmit(formState.data);
        dismissAlert();
        if (lease && lease.static) {
            const dataWithOldMac = { ...data, old_mac: lease.mac };
            put({ data: dataWithOldMac });
        } else if (lease && !lease.static) {
            post({ data });
        } else {
            post({ data });
        }
    }

    return [formState, setFormValue, postState, putState, saveLease];
}

function prepDataToSubmit(lease) {
    return update(lease, {
        $unset: ["active", "expires", "static"],
    });
}

export function validator(formState) {
    const errors = {
        hostname:
            formState.hostname.length < 1
                ? _("Hostname cannot be empty.")
                : validateHostname(formState.hostname),
        ip:
            formState.ip.length < 1
                ? _("IPv4 address cannot be empty.")
                : validateIPv4Address(formState.ip),
        mac:
            formState.mac.length < 1
                ? _("MAC address cannot be empty.")
                : validateMAC(formState.mac),
    };

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
