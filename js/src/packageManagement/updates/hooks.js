/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useCallback, useEffect, useState } from "react";

import {
    API_STATE,
    useAlert,
    useAPIGet,
    useAPIPolling,
    useAPIPost,
} from "foris";

import API_URLs from "common/API";

const REFRESH_INTERVAL = 500; // milliseconds

/*
 * usePending is used to check/set if updater is running. It gets initial pending status from API.
 */
export function usePending() {
    const [pending, setPending] = useState(false);
    const [getUpdatesStatusResponse, getUpdatesStatus] = useAPIGet(
        API_URLs.updatesRunning
    );
    useEffect(() => {
        getUpdatesStatus();
    }, [getUpdatesStatus]);
    useEffect(() => {
        if (getUpdatesStatusResponse.state === API_STATE.SUCCESS) {
            setPending(getUpdatesStatusResponse.data.running);
        }
    }, [getUpdatesStatusResponse]);
    return [pending, setPending];
}

/*
 * useUpdateToApprove similar to useAPIGet(API_URLs.approvals). The getUpdateToApprove function
 * makes request only if displayApproval param is true. It makes initial request as well.
 */
export function useApprovals(displayApproval) {
    const [getApprovalsResponse, getApprovals] = useAPIGet(API_URLs.approvals);
    const updateToApprove = getApprovalsResponse.data;
    const getUpdateToApprove = useCallback(() => {
        // Request can be ignored if approval is hidden.
        if (displayApproval) {
            return getApprovals();
        }
    }, [displayApproval, getApprovals]);
    useEffect(() => {
        getUpdateToApprove();
    }, [getUpdateToApprove]);

    return [
        getApprovalsResponse,
        getApprovals,
        updateToApprove,
        getUpdateToApprove,
    ];
}

/*
 * usePendingPolling makes API polling until pending is false. It calls setPending to set result of
 * the polling.
 */
export function usePendingPolling(onSuccess, pending, setPending) {
    const [setAlert, dismissAlert] = useAlert();

    const [checkStatusPollingResponse] = useAPIPolling(
        API_URLs.updatesRunning,
        REFRESH_INTERVAL,
        pending
    );

    useEffect(() => {
        if (checkStatusPollingResponse.state === API_STATE.SUCCESS) {
            const isRunning = checkStatusPollingResponse.data.running;
            setPending(isRunning);
            dismissAlert();
            if (!isRunning) {
                onSuccess();
            }
        } else if (checkStatusPollingResponse.state === API_STATE.ERROR) {
            setPending(false);
            setAlert(_("Cannot fetch updater status."));
        }
    }, [
        checkStatusPollingResponse,
        onSuccess,
        setPending,
        setAlert,
        dismissAlert,
    ]);
}

/*
 * useCheckUpdates is used to check for new updates. Sets pending as true when started.
 */
export function useCheckUpdates(setPending) {
    const [setAlert, dismissAlert] = useAlert();

    const [runUpdatesResponse, runUpdates] = useAPIPost(API_URLs.runUpdates);
    // Trigger updater status checker after updater is enabled
    useEffect(() => {
        if (runUpdatesResponse.state === API_STATE.SUCCESS) {
            setPending(true);
            dismissAlert();
        } else if (runUpdatesResponse.state === API_STATE.ERROR) {
            setPending(false);
            setAlert(runUpdatesResponse.data);
        }
    }, [runUpdatesResponse, setPending, setAlert, dismissAlert]);

    return () => {
        setPending(true);
        runUpdates();
    };
}
