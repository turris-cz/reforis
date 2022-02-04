/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";
import update from "immutability-helper";
import {
    ALERT_TYPES,
    API_STATE,
    useAlert,
    useAPIPost,
    useAPIPut,
    useForm,
} from "foris";
import API_URLs from "common/API";
import validator from "./validator";

const EMPTY_LEASE = {
    hostname: "",
    ip: "",
    mac: "",
};

export default function useStaticLeaseModalForm(
    lease,
    saveStaticLeaseCallback
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
            setAlert(_("Can't add new static lease."));
        }
    }, [setAlert, postState, initForm, saveStaticLeaseCallback]);

    useEffect(() => {
        if (putState.state === API_STATE.SUCCESS) {
            saveStaticLeaseCallback();
            setAlert(_("Static saved successfully."), ALERT_TYPES.SUCCESS);
        } else if (putState.state === API_STATE.ERROR) {
            setAlert(_("Can't save static lease."));
        }
    }, [putState, saveStaticLeaseCallback, setAlert]);

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

    return [formState, setFormValue, postState, saveLease];
}

function prepDataToSubmit(lease) {
    return update(lease, {
        $unset: ["active", "expires", "static"],
    });
}
