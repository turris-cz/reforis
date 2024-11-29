/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

DarkModeDropdownButton.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
};

function DarkModeDropdownButton({ label, icon, onClick, active }) {
    return (
        <li>
            <button
                type="button"
                className={`dropdown-item d-flex align-items-center ${active ? "active fw-bold" : ""}`.trim()}
                onClick={onClick}
            >
                <FontAwesomeIcon
                    icon={`fa-solid ${icon}`}
                    className="me-1 opacity-50"
                    width="1rem"
                />
                <span className="me-2">{label}</span>
                {active && (
                    <FontAwesomeIcon
                        icon="fa-solid fa-check"
                        className="ms-auto"
                        width="1rem"
                    />
                )}
            </button>
        </li>
    );
}

export default DarkModeDropdownButton;
