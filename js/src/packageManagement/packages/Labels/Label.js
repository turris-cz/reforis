/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import useTooltip from "utils/useTooltip";

import "./Label.css";

Label.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    severity: PropTypes.oneOf([
        "danger",
        "warning",
        "info",
        "success",
        "primary",
        "secondary",
        "light",
        "dark",
    ]).isRequired,
    disabled: PropTypes.bool,
};

export default function Label({ title, description, severity, disabled }) {
    const tooltipRef = useTooltip(description);

    return (
        <span
            ref={tooltipRef}
            className={`badge text-bg-${severity}${
                disabled ? " badge-disabled" : ""
            }`}
        >
            {title}
        </span>
    );
}
