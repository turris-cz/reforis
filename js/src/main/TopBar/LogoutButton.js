/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForisURLs } from "foris";

import useTooltip from "utils/useTooltip";

export default function LogoutButton() {
    const tooltip = useTooltip(_("Logout"), "bottom");

    const logout = () => {
        window.location.replace(ForisURLs.logout);
    };

    return (
        <div>
            <button
                className="nav-item btn btn-link text-body"
                type="button"
                onClick={logout}
                ref={tooltip}
            >
                <FontAwesomeIcon
                    icon="fa-solid fa-right-from-bracket"
                    className="fa-lg"
                />
            </button>
        </div>
    );
}
