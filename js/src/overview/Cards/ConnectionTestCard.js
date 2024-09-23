/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import ConnectionTest from "connectionTest/ConnectionTest";
import Card from "overview/Cards/Card";

ConnectionTestCard.propTypes = {
    ws: PropTypes.object.isRequired,
};

function ConnectionTestCard({ ws }) {
    return (
        <Card title={_("Connection Test")}>
            <ConnectionTest ws={ws} type="overview" />
        </Card>
    );
}

export default ConnectionTestCard;
