/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAlert } from "foris";
import PropTypes from "prop-types";

import GuideHelper from "./GuideHelper";
import STEPS from "./steps";

GuidePage.propTypes = {
    ws: PropTypes.object.isRequired,
    step: PropTypes.string.isRequired,
    next_step: PropTypes.string.isRequired,
    passed: PropTypes.arrayOf(PropTypes.string).isRequired,
    current_workflow: PropTypes.string.isRequired,
    available_workflows: PropTypes.arrayOf(PropTypes.string).isRequired,
    getGuideData: PropTypes.func.isRequired,
};

export default function GuidePage({
    ws,
    step,
    next_step,
    current_workflow,
    available_workflows,
    passed,
    getGuideData,
}) {
    const Component = STEPS[step].component;
    const [, dismissAlert] = useAlert();
    useEffect(() => {
        dismissAlert();
    }, [dismissAlert]);
    return (
        <>
            <GuideHelper
                ws={ws}
                step={step}
                workflow={current_workflow}
                completed={passed.includes(step)}
                next_step={next_step}
            />
            <Component
                ws={ws}
                next_step={next_step}
                postCallback={getGuideData}
                workflows={available_workflows}
            />
        </>
    );
}
