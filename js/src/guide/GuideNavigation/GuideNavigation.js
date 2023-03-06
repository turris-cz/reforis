/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import GuideNavigationItem from "./GuideNavigationItem";
import STEPS from "../steps";

GuideNavigation.propTypes = {
    workflow_steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    passed: PropTypes.arrayOf(PropTypes.string).isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function GuideNavigation({ workflow_steps, passed, next_step }) {
    const navigationItems = workflow_steps.map((step) => (
        <GuideNavigationItem
            key={step}
            name={STEPS[step].name}
            passed={passed.includes(step)}
            url={`/${step}`}
            next={step === next_step}
        />
    ));

    return <ul className="list-unstyled">{navigationItems}</ul>;
}
