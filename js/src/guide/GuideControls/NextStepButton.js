/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

NextStepButton.propTypes = {
    next_step: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};

export function NextStepButton({ next_step, location }) {
    const disabled = location.pathname === `/${next_step}`;
    return (
        <Link
            className={`btn btn-success d-flex justify-content-center align-items-center align-self-stretch align-self-sm-center ${disabled ? "disabled" : "blinking"}`}
            to={`/${next_step}`}
            disabled={disabled}
        >
            <span className="d-none d-sm-inline-block text-nowrap me-1">
                {_("Next step")}
            </span>
            <FontAwesomeIcon icon="fa-solid fa-step-forward" />
        </Link>
    );
}

const NextStepButtonWithRouter = withRouter(NextStepButton);

export default NextStepButtonWithRouter;
