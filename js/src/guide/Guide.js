/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import PropTypes from "prop-types";

import {
    Portal, REFORIS_URL_PREFIX, useAPIGet, Spinner, API_STATE,
} from "foris";

import API_URLs from "common/API";

import { GUIDE_URL_PREFIX } from "./constants";
import GuideNavigation from "./GuideNavigation";
import GuideHelp from "./GuideHelp";
import STEPS from "./steps";

Guide.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Guide({ ws }) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);
    useEffect(() => {
        getGuideData();
    }, [getGuideData]);

    if ([API_STATE.INIT, API_STATE.SENDING].includes(guideData.state)) {
        return <Spinner className="row justify-content-center" />;
    }

    const {
        available_workflows, workflow_steps, next_step, passed, current_workflow,
    } = guideData.data;

    return (
        <BrowserRouter basename={`${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}`}>
            <Portal containerId="guide-nav-container">
                <GuideNavigation
                    workflow_steps={workflow_steps}
                    passed={passed}
                    next_step={next_step}
                />
            </Portal>
            <Switch>
                {workflow_steps.map((step) => {
                    const Component = STEPS[step].component;
                    return (
                        <Route
                            exact
                            key={step}
                            path={`/${step}`}
                            render={() => (
                                <>
                                    <GuideHelp
                                        step={step}
                                        workflow={current_workflow}
                                        completed={passed.includes(step)}
                                    />
                                    <Component
                                        ws={ws}
                                        next_step={next_step}
                                        postCallback={getGuideData}
                                        workflows={available_workflows}
                                    />
                                </>
                            )}
                        />
                    );
                })}
                <Redirect to={`/${next_step}`} />
            </Switch>
        </BrowserRouter>
    );
}
