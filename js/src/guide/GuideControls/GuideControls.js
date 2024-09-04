/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import DarkModeDropdown from "main/TopBar/darkModeDropdown/DarkModeDropdown";
import LanguagesDropdown from "main/TopBar/languagesDropdown/LanguagesDropdown";

import NextStepButtonWithRouter from "./NextStepButton";
import SkipGuideButtonWithRouter from "./SkipGuideButton";

GuideControls.propTypes = {
    ws: PropTypes.object.isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideControls({ ws, next_step }) {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <LanguagesDropdown ws={ws} className="btn-secondary me-2" />
            <DarkModeDropdown className="btn-secondary me-2" />
            <SkipGuideButtonWithRouter next_step={next_step} />
            <NextStepButtonWithRouter next_step={next_step} />
        </div>
    );
}
