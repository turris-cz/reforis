/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    REFORIS_URL_PREFIX,
    Portal,
    AlertContextProvider,
    useCustomizationContext,
} from "foris";
import PropTypes from "prop-types";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";

import ScrollToTopArrow from "common/ScrollToTopArrow";
import Navigation from "navigation/Navigation";
import ErrorBoundary from "utils/ErrorBoundary";
import SkipLink from "utils/SkipLink";
import useSessionTimeout, {
    SessionTimeoutModal,
} from "utils/useSessionTimeout";

import { REDIRECT_404_PAGE } from "./constants";
import getPages from "./pages";
import RouteWithSubRoutes from "./routing";
import TopBar from "./TopBar/TopBar";

Main.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Main({ ws }) {
    const { isCustomized } = useCustomizationContext();
    const pages = getPages(isCustomized);

    const { showWarning, setShowWarning, logout, extendSession } =
        useSessionTimeout();

    return (
        <ErrorBoundary>
            <AlertContextProvider>
                <BrowserRouter basename={REFORIS_URL_PREFIX}>
                    <SessionTimeoutModal
                        shown={showWarning}
                        setShown={setShowWarning}
                        logout={logout}
                        extendSession={extendSession}
                    />
                    <Portal containerId="app-container">
                        <SkipLink mode="main" />
                    </Portal>
                    <Portal containerId="navigation-container">
                        <Navigation pages={pages} />
                    </Portal>
                    <Portal containerId="top-bar-container">
                        <TopBar ws={ws} />
                    </Portal>
                    <Portal containerId="scroll-to-top">
                        <ScrollToTopArrow />
                    </Portal>
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
                </BrowserRouter>
            </AlertContextProvider>
        </ErrorBoundary>
    );
}
