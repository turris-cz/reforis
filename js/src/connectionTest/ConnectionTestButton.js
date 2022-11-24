/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button } from "foris";
import PropTypes from "prop-types";

import { TEST_STATES } from "./hooks";

ConnectionTestButton.propTypes = {
    state: PropTypes.oneOf(
        Object.keys(TEST_STATES).map((key) => TEST_STATES[key])
    ).isRequired,
    type: PropTypes.oneOf(["wan", "dns", "overview"]).isRequired,
};

export default function ConnectionTestButton({ state, type, ...props }) {
    const isRunning = state === TEST_STATES.RUNNING;
    let labelSubmitButton;
    switch (state) {
        case TEST_STATES.RUNNING:
            labelSubmitButton = _("Test is running…");
            break;
        case TEST_STATES.FINISHED:
            labelSubmitButton = _("Test connection again");
            break;
        default:
            labelSubmitButton = _("Test connection");
    }

    return (
        <div className={type !== "overview" ? "text-right" : null}>
            <Button
                type="submit"
                className={
                    type === "overview"
                        ? "btn-outline-primary mw-100"
                        : "btn-primary"
                }
                loading={isRunning}
                disabled={isRunning}
                forisFormSize
                {...props}
            >
                {labelSubmitButton}
            </Button>
        </div>
    );
}
