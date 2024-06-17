/*
 * Copyright (C) 2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import smallScreenWidth from "utils/constants";
import DarkModeDropdownButton from "./DarkModeDropdownButton";
import { useThemeContext } from "main/themeContext";

const darkModeOptions = [
    {
        label: _("Light"),
        icon: "fa-sun",
        theme: "light",
    },
    {
        label: _("Dark"),
        icon: "fa-moon",
        theme: "dark",
    },
    {
        label: _("Auto"),
        icon: "fa-circle-half-stroke",
        theme: "auto",
    },
];

function DarkModeToggle({ className }) {
    const { theme, setTheme } = useThemeContext();

    return (
        <div className="dropdown">
            <button
                className={`nav-item btn ${className || "btn-link"} fw-bold text-body text-decoration-none`.trim()}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="fa-solid fa-circle-half-stroke fa-lg" />
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-${
                    window.outerWidth > smallScreenWidth ? "end" : "start"
                } shadow-sm`.trim()}
                id="darkmode-dropdown-menu"
            >
                <div className="dropdown-header">
                    <h5 className="mb-0 text-body">{_("Dark Mode")}</h5>
                </div>
                <div className="dropdown-divider" />
                {darkModeOptions.map((option) => (
                    <DarkModeDropdownButton
                        key={option.label}
                        label={option.label}
                        icon={option.icon}
                        active={theme === option.theme}
                        onClick={() => setTheme(option.theme)}
                    />
                ))}
            </ul>
        </div>
    );
}

export default DarkModeToggle;
