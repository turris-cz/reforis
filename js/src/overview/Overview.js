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
    isPluginInstalled,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import Notifications from "notifications/Notifications/Notifications";

import AutomaticUpdatesCard from "./Cards/AutomaticUpdatesCard";
import ConnectionTestCard from "./Cards/ConnectionTestCard";
import DynamicFirewallCard from "./Cards/DynamicFirewallCard";
import LibrespeedCard from "./Cards/LibrespeedCard";
import OpenVPNClientsCard from "./Cards/OpenVPNClientsCard";
import ThreatDetectionCard from "./Cards/ThreatDetectionCard";
import displayCard from "./utils";

import "./Overview.css";

Overview.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Overview({ ws }) {
    const [packageList, getPackageList] = useAPIGet(API_URLs.packages);
    useEffect(() => {
        getPackageList();
    }, [getPackageList]);

    return (
        <>
            <h1>{_("Overview")}</h1>
            <OverviewWithErrorAndSpinner
                apiState={packageList.state}
                packages={packageList.data || {}}
                ws={ws}
            />
        </>
    );
}

OverviewCards.propTypes = {
    packages: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired,
};

function OverviewCards({ packages, ws }) {
    return (
        <>
            <div className="row row-cols-1 row-cols-lg-3">
                <AutomaticUpdatesCard />
                <ThreatDetectionCard
                    isInstalled={
                        displayCard(packages, "datacollect") &&
                        isPluginInstalled("Sentinel")
                    }
                />
                <DynamicFirewallCard enabled={displayCard(packages, "dynfw")} />
            </div>
            <div className="row row-cols-1 row-cols-lg-3">
                {displayCard(packages, "librespeed") &&
                    isPluginInstalled("LibreSpeed") && <LibrespeedCard />}
                <ConnectionTestCard ws={ws} />
                {displayCard(packages, "openvpn") &&
                    isPluginInstalled("OpenVPN") && <OpenVPNClientsCard />}
            </div>
            <Notifications ws={ws} />
        </>
    );
}

const OverviewWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OverviewCards)
);
