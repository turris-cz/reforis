/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

GuideNavigationItem.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    passed: PropTypes.bool.isRequired,
    next: PropTypes.bool.isRequired,
};

export default function GuideNavigationItem({ name, url, next, passed }) {
    const passedClassName = passed ? "passed" : "";
    const nextClassName = next ? "next" : "";

    const content = (
        <>
            <FontAwesomeIcon icon="fa-solid fa-angle-right" className="me-2" />
            {name}
        </>
    );

    return (
        <li>
            {passed || next ? (
                <NavLink
                    className={`${passedClassName} ${nextClassName}`}
                    to={url}
                >
                    {content}
                </NavLink>
            ) : (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a className="disabled">{content}</a>
            )}
        </li>
    );
}
