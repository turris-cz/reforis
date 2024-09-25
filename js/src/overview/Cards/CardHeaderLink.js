/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

CardHeaderLink.propTypes = {
    title: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    linkTitle: PropTypes.string.isRequired,
};

function CardHeaderLink({ title, linkTo, linkTitle }) {
    return (
        <Link
            to={{
                pathname: linkTo,
            }}
            className="align-self-start text-secondary text-decoration-none mb-2"
            title={linkTitle}
        >
            <h6 className="text-uppercase text-muted mb-0">
                {title}
                <FontAwesomeIcon
                    style={{ fontSize: "0.9rem" }}
                    icon="fa-solid fa-chevron-right align-middle"
                    className="ms-1"
                />
            </h6>
        </Link>
    );
}

export default CardHeaderLink;
