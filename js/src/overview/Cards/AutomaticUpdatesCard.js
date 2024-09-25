/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    useAPIGet,
    withSpinnerOnSending,
    withErrorMessage,
    ForisURLs,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import Card from "overview/Cards/Card";

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
        <Card
            firstRow
            title={_("Automatic Updates")}
            enabled={enabled}
            linkTo={ForisURLs.packageManagementUpdateSettings}
            linkTitle={_("Go to update settings")}
        />
    );
}

const AutomaticUpdatesCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(AutomaticUpdatesCard)
);
