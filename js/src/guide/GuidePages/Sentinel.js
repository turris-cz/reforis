/*
 * Copyright (C) 2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisForm } from "foris";
import PropTypes from "prop-types";

import { API_MODULE_URLs } from "common/API";
import SentinelDescription from "guide/GuidePages/SentinelDescription";
import SentinelEULA from "guide/GuidePages/SentinelEULA";

Sentinel.propTypes = {
    postCallback: PropTypes.func.isRequired,
};

Sentinel.defaultProps = {
    postCallback: () => undefined,
};

export default function Sentinel({ postCallback }) {
    return (
        <>
            <h1>{_("Sentinel")}</h1>
            <SentinelDescription />
            <ForisForm
                forisConfig={{
                    endpoint: API_MODULE_URLs.sentinel,
                }}
                postCallback={postCallback}
                prepDataToSubmit={prepDataToSubmit}
            >
                <SentinelEULA />
            </ForisForm>
        </>
    );
}

function prepDataToSubmit(formData) {
    delete formData.token;
    delete formData.modules;
    return formData;
}
