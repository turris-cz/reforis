/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Portal } from "foris";
import PropTypes from "prop-types";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.error(
            `An error ocurred in reForis: "${error}", see details below.`,
            errorInfo.componentStack
        );
    }

    render() {
        const { error } = this.state;
        if (error) {
            document.title = _("An Error Occurred - reForis | Turris");
            return (
                <Portal containerId="content-container">
                    <h1>{_("Oops! Something went wrong:")}</h1>
                    <p className="p-3 my-3 bg-secondary-subtle">
                        <code>{error.toString()}</code>
                    </p>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: _(
                                `More detailed information is available in the console of your web browser. On most browsers accessible after pressing <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd></kbd> or <kbd>F12</kbd>.`
                            ),
                        }}
                    />
                    <p
                        dangerouslySetInnerHTML={{
                            __html: _(
                                'Please report this error to our support team via e-mail: <a href="mailto:tech.support@turris.cz">tech.support@turris.cz</a>.'
                            ),
                        }}
                    />
                </Portal>
            );
        }

        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
