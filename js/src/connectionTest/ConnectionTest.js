/*
 * Copyright (C) 2020-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import ConnectionTestButton from "./ConnectionTestButton";
import ConnectionTestResults from "./ConnectionTestResult";
import useConnectionTest from "./hooks";

ConnectionTest.propTypes = {
    ws: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["wan", "dns", "overview"]).isRequired,
};

export default function ConnectionTest({ ws, type }) {
    const [state, testResults, triggerTest] = useConnectionTest(ws, type);

    const onSubmit = (event) => {
        event.preventDefault();
        triggerTest();
    };

    return (
        <form>
            <ConnectionTestResults state={state} {...testResults} />
            <ConnectionTestButton
                state={state}
                onClick={onSubmit}
                type={type}
            />
        </form>
    );
}
