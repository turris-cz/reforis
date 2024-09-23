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

import { API_MODULE_URLs } from "common/API";
import Card from "overview/Cards/Card";

export default function DataCollection() {
    const [getSentinelResponse, getSentinel] = useAPIGet(
        API_MODULE_URLs.sentinel
    );
    useEffect(() => {
        getSentinel();
    }, [getSentinel]);

    return (
        <ThreatDetectionCardWithErrorAndSpinner
            apiState={getSentinelResponse.state}
            details={getSentinelResponse.data || {}}
        />
    );
}

ThreatDetectionCard.propTypes = {
    details: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
};

function ThreatDetectionCard({ details: { eula } }) {
    const enabled = eula === 1;
    return (
        <Card
            firstRow
            title={_("Threat Detection")}
            enabled={enabled}
            linkTo={ForisURLs.sentinelLicenseAgreement}
            linkTitle={_("Go to Sentinel license agreement")}
        />
    );
}

const ThreatDetectionCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(ThreatDetectionCard)
);
