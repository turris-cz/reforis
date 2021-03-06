/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    REFORIS_URL_PREFIX,
    Portal,
    AlertContextProvider,
    useAPIGet,
    withSending,
} from "foris";
import PropTypes from "prop-types";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";

import API_URLs from "common/API";
import ScrollToTopArrow from "common/ScrollToTopArrow";
import Navigation from "navigation/Navigation";
import ErrorBoundary from "utils/ErrorBoundary";

import { REDIRECT_404_PAGE } from "./constants";
import { CustomizationProvider } from "./customizationContext";
import getPages from "./pages";
import RouteWithSubRoutes from "./routing";
import TopBar from "./TopBar/TopBar";

Main.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Main({ ws }) {
    const [getCustomizationResponse, getCustomization] = useAPIGet(
        API_URLs.about
    );

    useEffect(() => {
        getCustomization();
    }, [getCustomization]);

    return (
        <CustomizationWithError
            apiState={getCustomizationResponse.state}
            deviceDetails={getCustomizationResponse.data || {}}
            ws={ws}
        />
    );
}

MainWrapper.propTypes = {
    ws: PropTypes.object.isRequired,
    deviceDetails: PropTypes.object.isRequired,
};

function MainWrapper({ deviceDetails, ws }) {
    const customization = !!(
        deviceDetails &&
        deviceDetails.customization !== undefined &&
        deviceDetails.customization === "shield"
    );
    const pages = getPages(customization);
    // Outer ErrorBoundary catches errors outside content container
    return (
        <ErrorBoundary>
            <BrowserRouter basename={REFORIS_URL_PREFIX}>
                <AlertContextProvider>
                    <CustomizationProvider value={customization}>
                        <Portal containerId="navigation-container">
                            <Navigation pages={pages} />
                        </Portal>
                        <Portal containerId="top-bar-container">
                            <TopBar ws={ws} />
                        </Portal>
                        <Portal containerId="scroll-to-top">
                            <ScrollToTopArrow />
                        </Portal>
                        {/* Handle errors and display Navigation and TopBar. */}
                        <ErrorBoundary>
                            <Switch>
                                {pages.map((route) => (
                                    <RouteWithSubRoutes
                                        key={route.path}
                                        ws={ws}
                                        {...route}
                                    />
                                ))}
                                <Redirect to={REDIRECT_404_PAGE} />
                            </Switch>
                        </ErrorBoundary>
                    </CustomizationProvider>
                </AlertContextProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

const withoutSpinner = withSending(() => null);

const CustomizationWithError = withoutSpinner(MainWrapper);
