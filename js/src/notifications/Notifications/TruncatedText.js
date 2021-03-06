/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import PropTypes from "prop-types";

import "./TruncatedText.css";

TruncatedText.propTypes = {
    text: PropTypes.string.isRequired,
    charLimit: PropTypes.number.isRequired,
    threshold: PropTypes.number.isRequired,
};

TruncatedText.defaultProps = {
    threshold: 16,
};

export default function TruncatedText({ text, charLimit, threshold }) {
    const [collapsed, setCollapsed] = useState(true);
    let cardText = text;
    let toggleCollapse = null;

    if (text.length > charLimit + threshold) {
        if (collapsed) {
            cardText = text.substring(0, charLimit).replace(/(\s|\W)$/, "");
            cardText = `${cardText}...`;
        }
        toggleCollapse = (
            <ToggleCollapse
                collapseFn={setCollapsed}
                shouldCollapse={!collapsed}
            />
        );
    }

    return (
        <>
            <p className="card-text">{cardText}</p>
            {toggleCollapse}
        </>
    );
}

ToggleCollapse.propTypes = {
    collapseFn: PropTypes.func.isRequired,
    shouldCollapse: PropTypes.bool.isRequired,
};

function ToggleCollapse({ collapseFn, shouldCollapse }) {
    return (
        <button
            type="button"
            className="btn btn-link toggle-collapse"
            onClick={() => collapseFn(shouldCollapse)}
        >
            {shouldCollapse ? "Show less" : "Show more"}
        </button>
    );
}
