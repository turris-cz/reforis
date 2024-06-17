/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import "./DarkModeDropdownButton.css";

function DarkModeDropdownButton({ label, icon, onClick, active }) {
    return (
        <li>
            <button
                type="button"
                className={`dropdown-item d-flex align-items-center ${active ? "active fw-bold" : ""}`.trim()}
                onClick={onClick}
            >
                <i className={`fa-solid ${icon} me-1 text-body`} />
                {label}
                {active && <i className="fa-solid fa-check ms-auto" />}
            </button>
        </li>
    );
}

export default DarkModeDropdownButton;
