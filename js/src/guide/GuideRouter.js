/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    AlertContextProvider,
    Portal,
    REFORIS_URL_PREFIX,
    withErrorMessage,
    withSpinnerOnSending,
} from "foris";
import PropTypes from "prop-types";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import { CustomizationProvider } from "context/customizationContext";

import { GUIDE_URL_PREFIX } from "./constants";
import GuideNavigation from "./GuideNavigation/GuideNavigation";
import GuidePage from "./GuidePage";

GuideRouter.propTypes = {
    ws: PropTypes.object.isRequired,
    guideData: PropTypes.object.isRequired,
    getGuideData: PropTypes.func.isRequired,
    deviceDetails: PropTypes.object.isRequired,
};

function GuideRouter({ ws, guideData, getGuideData, deviceDetails }) {
    const customization = !!(
        deviceDetails &&
        deviceDetails.customization !== undefined &&
        deviceDetails.customization === "shield"
    );
    const { workflow_steps, next_step } = guideData;

    return (
        <BrowserRouter basename={`${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}`}>
            <AlertContextProvider>
                <CustomizationProvider value={customization}>
                    <Portal containerId="guide-nav-container">
                        <GuideNavigation {...guideData} />
                    </Portal>
                    <Switch>
                        {workflow_steps.map((step) => (
                            <Route
                                exact
                                key={step}
                                path={`/${step}`}
                                render={() => (
                                    <GuidePage
                                        ws={ws}
                                        step={step}
                                        getGuideData={getGuideData}
                                        {...guideData}
                                    />
                                )}
                            />
                        ))}
                        <Redirect to={`/${next_step}`} />
                    </Switch>
                </CustomizationProvider>
            </AlertContextProvider>
        </BrowserRouter>
    );
}

const GuideRouterWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(GuideRouter)
);

export default GuideRouterWithErrorAndSpinner;
