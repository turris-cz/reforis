/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Portal } from "foris";
import PropTypes from "prop-types";
import { matchPath, withRouter } from "react-router-dom";
import SimpleBar from "simplebar-react";

import NavigationMainItem from "./NavigationMainItem";
import { NavigationToggle, NavigationToggleItem } from "./NavigationToggle";

import "simplebar-react/dist/simplebar.min.css";

Navigation.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
};

function Navigation({ pages, location }) {
    const navigationContent = pages.map((page) => {
        if (page.isHidden) return null;

        if (page.pages) {
            const active = matchPath(location.pathname, {
                path: page.path,
                strict: true,
            });
            return (
                <NavigationToggle key={page.name} active={!!active} {...page}>
                    {page.pages.map((subPage) => (
                        <NavigationToggleItem
                            key={subPage.name}
                            {...subPage}
                            path={`${page.path}${subPage.path}`}
                        />
                    ))}
                </NavigationToggle>
            );
        }

        return <NavigationMainItem key={page.name} {...page} />;
    });

    return (
        <SimpleBar className="mh-100">
            <Portal containerId="navigation-collapse-toggle">
                <button
                    type="button"
                    className="btn btn-lg btn-primary"
                    data-bs-toggle="collapse"
                    data-bs-target="#navigation-container-collapse"
                    aria-expanded="false"
                    aria-controls="navigation-container-collapse"
                >
                    <FontAwesomeIcon icon="fa-solid fa-bars" />
                </button>
            </Portal>
            <div id="navigation-container-collapse" className="collapse">
                <ul className="list-unstyled">{navigationContent}</ul>
            </div>
        </SimpleBar>
    );
}

const NavigationWithRouter = withRouter(Navigation);
export default NavigationWithRouter;
