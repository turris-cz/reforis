/*
 * Copyright (C) 2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import "./SkipLink.css";
import PropTypes from "prop-types";

SkipLink.propTypes = {
    mode: PropTypes.oneOf(["guide", "main"]).isRequired,
};

function SkipLink({ mode }) {
    return (
        <a
            href={mode === "guide" ? "#guide-container" : "#content-container"}
            className="skip-link"
        >
            {_("Skip to main content")}
        </a>
    );
}

export default SkipLink;
