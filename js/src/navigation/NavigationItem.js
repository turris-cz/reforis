/*
 * Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { NavLink, useHistory } from "react-router-dom";

import smallScreenWidth from "../utils/constants";

NavigationItem.propTypes = {
    path: PropTypes.string.isRequired,
    isLinkOutside: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function NavigationItem({ path, children, isLinkOutside }) {
    const history = useHistory();
    const [isMobileScreen, setIsMobileScreen] = useState(
        window.innerWidth <= smallScreenWidth
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobileScreen(window.innerWidth <= smallScreenWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleClick = (e) => {
        if (isMobileScreen) {
            e.preventDefault();
            history.push(path);
        }
    };

    const mobileNavigationCollapse = {};
    if (isMobileScreen) {
        mobileNavigationCollapse["data-bs-toggle"] = "collapse";
        mobileNavigationCollapse["data-bs-target"] =
            "#navigation-container-collapse";
    }

    if (isLinkOutside) {
        return (
            <li>
                <a
                    href={path}
                    className="text-truncate text-decoration-none"
                    title={children[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                    <sup>
                        <FontAwesomeIcon
                            icon="fa-solid fa-external-link-alt"
                            size="xs"
                            className="ms-1"
                        />
                    </sup>
                </a>
            </li>
        );
    }

    return (
        <li>
            <NavLink
                className="text-decoration-none"
                to={path}
                onClick={handleClick}
                {...mobileNavigationCollapse}
            >
                {children}
            </NavLink>
        </li>
    );
}
