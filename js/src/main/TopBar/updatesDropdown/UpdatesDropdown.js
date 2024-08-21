/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useCallback } from "react";

import {
    ForisURLs,
    useAPIGet,
    useAPIPost,
    SpinnerElement,
    Button,
    API_STATE,
    withEither,
    withSending,
} from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import API_URLs from "common/API";
import smallScreenWidth from "utils/constants";

UpdatesDropdown.propTypes = {
    newNotification: PropTypes.bool.isRequired,
};

export default function UpdatesDropdown({ newNotification }) {
    const [getApprovalsResponse, getApprovals] = useAPIGet(API_URLs.approvals);
    const update = getApprovalsResponse.data || {};
    useEffect(() => {
        getApprovals();
    }, [getApprovals]);

    const updateWithNotification = useCallback(() => {
        if (newNotification) {
            return getApprovals();
        }
    }, [newNotification, getApprovals]);

    useEffect(() => {
        updateWithNotification();
    }, [updateWithNotification]);

    if (update.approvable === false) {
        return null;
    }

    return (
        <DropdownContentWithSpinner
            apiState={getApprovalsResponse.state}
            update={update}
            onSuccess={getApprovals}
        />
    );
}

DropdownContent.propTypes = {
    update: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

function DropdownContent({ update, onSuccess }) {
    const [postApprovalResponse, postApproval] = useAPIPost(API_URLs.approvals);
    // Reload approvals when resolution is successful
    useEffect(() => {
        if (postApprovalResponse.state === API_STATE.SUCCESS) {
            onSuccess();
        }
    }, [onSuccess, postApprovalResponse]);

    const resolveUpdate = (solution) => {
        postApproval({ data: { hash: update.hash, solution } });
    };

    const updateFailed = postApprovalResponse.state === API_STATE.ERROR;
    return (
        <div className="dropdown" data-testid="updates-dropdown">
            <button
                type="button"
                className="nav-item btn btn-link text-body"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i
                    className={`fa fa-sync-alt fa-lg ${
                        updateFailed ? "text-danger" : ""
                    }`.trim()}
                />
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-${
                    window.outerWidth > smallScreenWidth ? "" : "end"
                } shadow-sm`.trim()}
            >
                <div className="dropdown-header">
                    <Link
                        className="text-decoration-none"
                        to={{
                            pathname: ForisURLs.approveUpdates,
                        }}
                    >
                        <h5 className="mb-0 text-body">
                            {_("Approve Update")}
                        </h5>
                    </Link>
                </div>
                <div className="dropdown-divider" />
                <ManageUpdateWithError
                    updateFailed={updateFailed}
                    resolveUpdate={resolveUpdate}
                />
            </ul>
        </div>
    );
}

const withSmallSpinner = withSending(() => (
    <button type="button" className="nav-item btn btn-link">
        <SpinnerElement small />
    </button>
));
const DropdownContentWithSpinner = withSmallSpinner(DropdownContent);

ManageUpdate.propTypes = {
    resolveUpdate: PropTypes.func.isRequired,
};

function ManageUpdate({ resolveUpdate }) {
    return (
        <div className="px-3">
            <p className="text-center text-nowrap mb-2">
                {_("See details in ")}
                <Link to={ForisURLs.approveUpdates}>{_("Updates")}</Link>
                {_(" page.")}
            </p>

            <Button
                className="btn-primary w-100"
                onClick={() => resolveUpdate("grant")}
            >
                {_("Install now")}
            </Button>
        </div>
    );
}

const withUpdateFailed = withEither(
    (props) => props.updateFailed,
    () => (
        <span className="dropdown-item text-danger">
            {_("Cannot install updates.")}
        </span>
    )
);
const ManageUpdateWithError = withUpdateFailed(ManageUpdate);
