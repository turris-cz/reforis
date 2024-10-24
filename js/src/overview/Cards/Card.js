/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import CardHeaderLink from "overview/Cards/CardHeaderLink";
import useTooltip from "utils/useTooltip";

Card.propTypes = {
    firstRow: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
    linkTo: PropTypes.string,
    linkTitle: PropTypes.string,
    enabled: PropTypes.bool,
    onRefresh: PropTypes.func,
};

function Card({
    firstRow,
    children,
    title,
    linkTo,
    linkTitle,
    enabled,
    onRefresh,
}) {
    const tooltip = useTooltip(_("Refresh"), "top", "hover");
    return (
        <div className="col mb-4">
            <div className="card h-100">
                <div
                    className={`card-body d-flex ${firstRow ? "justify-content-between align-items-center" : "flex-column"}`}
                >
                    <div
                        className={`d-flex ${firstRow ? "flex-column" : "flex-row justify-content-between align-items-center mb-2 "}`}
                    >
                        {linkTo ? (
                            <CardHeaderLink
                                linkTo={linkTo}
                                linkTitle={linkTitle}
                                title={title}
                            />
                        ) : (
                            <h6 className="text-uppercase text-muted mb-0 lh-base">
                                {title}
                            </h6>
                        )}
                        {firstRow && (
                            <span className="h3 status mb-0 mt-2">
                                {enabled ? _("Activated") : _("Disabled")}
                            </span>
                        )}
                        {onRefresh && (
                            <button
                                type="button"
                                ref={tooltip}
                                className="btn btn-link p-0 text-secondary"
                                onClick={onRefresh}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-sync" />
                            </button>
                        )}
                    </div>
                    {firstRow ? (
                        <FontAwesomeIcon
                            icon={`fa-solid fa-${enabled ? "check" : "times"}`}
                            className={`h2 mb-0 text-${enabled ? "success" : "danger"}`}
                        />
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;
