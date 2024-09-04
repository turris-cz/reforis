/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAPIGet } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import GuideRouterWithErrorAndSpinner from "./GuideRouter";

import "./Guide.css";

Guide.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Guide({ ws }) {
    const [guideData, getGuideData] = useAPIGet(API_URLs.guide);
    const [getCustomizationResponse, getCustomization] = useAPIGet(
        API_URLs.about
    );
    useEffect(() => {
        getGuideData();
        getCustomization();
    }, [getCustomization, getGuideData]);

    return (
        <GuideRouterWithErrorAndSpinner
            ws={ws}
            apiState={getCustomizationResponse.state}
            guideData={
                guideData.data || {
                    available_workflow: ["unset"],
                    current_workflow: "unset",
                    enabled: true,
                    next_step: "password",
                    passed: [],
                    recommended_workflow: "router",
                    workflow: "unset",
                    workflow_steps: ["password", "profile"],
                }
            }
            getGuideData={getGuideData}
            deviceDetails={getCustomizationResponse.data || {}}
        />
    );
}
