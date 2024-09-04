/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "foris";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import useGuideFinish from "../hooks";

SkipGuideButton.propTypes = {
    next_step: PropTypes.string.isRequired,
};

export function SkipGuideButton({ next_step }) {
    const onGuideFinishHandler = useGuideFinish();
    const disabled = next_step === "password";
    return (
        <Button
            className={`btn-warning me-2 align-self-stretch align-self-sm-center ${disabled ? "disabled" : ""}`.trim()}
            style={{ pointerEvents: "not-allowed" }}
            onClick={onGuideFinishHandler}
            disabled={disabled}
        >
            <span className="d-flex flex-nowrap justify-content-center align-items-center align-self-stretch align-self-sm-center">
                <span className="d-none d-sm-inline-block text-nowrap me-1">
                    {_("Skip guide")}
                </span>
                <FontAwesomeIcon icon="fa-solid fa-forward" />
            </span>
        </Button>
    );
}

const SkipGuideButtonWithRouter = withRouter(SkipGuideButton);

export default SkipGuideButtonWithRouter;
