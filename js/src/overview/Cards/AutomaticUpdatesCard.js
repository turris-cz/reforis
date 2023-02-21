/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

export default function AutomaticUpdates() {
    const [getAutomaticUpdatesResponse, getAutomaticUpdates] = useAPIGet(
        API_URLs.updatesEnabled
    );
    useEffect(() => {
        getAutomaticUpdates();
    }, [getAutomaticUpdates]);

    return (
        <AutomaticUpdatesCardWithErrorAndSpinner
            apiState={getAutomaticUpdatesResponse.state}
            details={getAutomaticUpdatesResponse.data || {}}
        />
    );
}

AutomaticUpdatesCard.propTypes = {
    details: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
};

function AutomaticUpdatesCard({ details: { enabled } }) {
    return (
        <div className="col mb-4">
            <div className="card user-select-none">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2 ">
                                {_("Automatic Updates")}
                            </h6>
                            <span className="status">
                                {enabled ? _("Activated") : _("Disabled")}
                            </span>
                        </div>
                        <div className="col-auto">
                            <span
                                className={`h2 text-${
                                    enabled ? "success" : "danger"
                                }`}
                            >
                                <i
                                    className={`fas fa-${
                                        enabled ? "check" : "times"
                                    }`}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AutomaticUpdatesCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(AutomaticUpdatesCard)
);
