/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useUID } from "react-uid";

import Labels from "./Labels/Labels";

PackageCheckBox.propTypes = {
    name: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,
    url: PropTypes.string,
    helpText: PropTypes.string,
    disabled: PropTypes.bool,
};

PackageCheckBox.defaultProps = {
    disabled: false,
};

export default function PackageCheckBox({
    name,
    labels,
    url,
    helpText,
    disabled,
    ...props
}) {
    const uid = useUID();
    return (
        <div className="mb-3">
            <input
                className="form-check-input me-2"
                type="checkbox"
                id={uid}
                disabled={disabled}
                {...props}
            />
            <label className="form-check-label" htmlFor={uid}>
                {name}
                {url && (
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={url}
                        className={`ms-1 ${disabled ? "text-muted" : ""}`.trim()}
                        title={_("More details")}
                    >
                        <sup>
                            <FontAwesomeIcon
                                icon="fa-solid fa-external-link-alt"
                                className="fa-xs"
                            />
                        </sup>
                    </a>
                )}
                <Labels labels={labels} disabled={disabled} />
                {helpText && (
                    <div className="form-text">
                        <small>{helpText}</small>
                    </div>
                )}
            </label>
        </div>
    );
}
