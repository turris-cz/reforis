/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    useAPIGet,
    withSpinnerOnSending,
    withErrorMessage,
    ForisURLs,
} from "foris";
import moment from "moment";
import PropTypes from "prop-types";

import { API_MODULE_URLs } from "common/API";
import Card from "overview/Cards/Card";

export default function Librespeed() {
    const [getDataState, getDataRequest] = useAPIGet(
        API_MODULE_URLs.librespeed
    );
    useEffect(() => {
        getDataRequest();
    }, [getDataRequest]);

    return (
        <LibrespeedCardWithErrorAndSpinner
            apiState={getDataState.state}
            tests={getDataState.data || {}}
        />
    );
}

LibrespeedCard.propTypes = {
    tests: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

function LibrespeedCard({ tests: { performed_tests: tests } }) {
    const testsCount = typeof tests !== "undefined" ? tests.length : null;
    const lastTest = testsCount > 0 ? tests[tests.length - 1] : null;
    const timeFromNow =
        testsCount > 0
            ? moment(
                  moment(lastTest.time).locale(ForisTranslations.locale)
              ).fromNow()
            : null;
    return (
        <Card
            title={_("LibreSpeed")}
            linkTo={ForisURLs.librespeedSpeedTest}
            linkTitle={_("Go to LibreSpeed")}
        >
            {lastTest ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-borderless table-hover col-12">
                            <tbody>
                                <tr>
                                    <th scope="row" className="text-nowrap">
                                        {_("Download")}
                                        <span
                                            className="badge text-bg-secondary"
                                            title={_("Megabit per second")}
                                        >
                                            Mb/s
                                        </span>
                                    </th>
                                    <td className="text-end">
                                        {lastTest.speed_download}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="text-nowrap">
                                        {_("Upload")}
                                        <span
                                            className="badge text-bg-secondary"
                                            title={_("Megabit per second")}
                                        >
                                            Mb/s
                                        </span>
                                    </th>
                                    <td className="text-end">
                                        <span>{lastTest.speed_upload}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="text-nowrap">
                                        {_("Ping")}
                                        <span
                                            className="badge text-bg-secondary"
                                            title={_("Millisecond")}
                                        >
                                            ms
                                        </span>
                                    </th>
                                    <td className="text-end">
                                        <span>
                                            {lastTest.ping >= 0
                                                ? lastTest.ping
                                                : _("N/A")}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="text-nowrap">
                                        {_("Jitter")}
                                        <span
                                            className="badge text-bg-secondary"
                                            title={_("Millisecond")}
                                        >
                                            ms
                                        </span>
                                    </th>
                                    <td className="text-end">
                                        <span>
                                            {lastTest.jitter >= 0
                                                ? lastTest.jitter
                                                : _("N/A")}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="text-nowrap">
                                    <th scope="row">{_("Server")}</th>
                                    <td className="text-end">
                                        <span>
                                            {lastTest.server &&
                                            lastTest.server.length > 0
                                                ? lastTest.server
                                                : _("N/A")}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="d-flex card-text flex-grow-1">
                        <small className="text-muted mt-auto">
                            {_("Performed")} {timeFromNow}
                        </small>
                    </p>
                </>
            ) : (
                <p className="text-muted">
                    {_("No tests have been performed lately.")}
                </p>
            )}
        </Card>
    );
}

const LibrespeedCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(LibrespeedCard)
);
