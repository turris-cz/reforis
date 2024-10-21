/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisURLs } from "foris";
import PropTypes from "prop-types";

import Card from "overview/Cards/Card";

DynamicFirewallCard.propTypes = {
    enabled: PropTypes.bool.isRequired,
};

export default function DynamicFirewallCard({ enabled }) {
    return (
        <Card
            firstRow
            title={_("Dynamic Firewall")}
            enabled={enabled}
            linkTo={ForisURLs.packageManagementPackages}
            linkTitle={_("Go to Dynamic Firewall package installation")}
        />
    );
}
