/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

FaIcon.propTypes = {
    name: PropTypes.string.isRequired,
};

export default function FaIcon({ name }) {
    return <FontAwesomeIcon icon={`fa-solid fa-${name}`} className="fa-fw" />;
}
