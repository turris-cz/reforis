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
            handleRefresh={getDataRequest}
        />
    );
}

LibrespeedCard.propTypes = {
    tests: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    handleRefresh: PropTypes.func.isRequired,
};

function LibrespeedCard({ tests: { performed_tests: tests }, handleRefresh }) {
    // Determine the number of tests conducted
    const numberOfTestsConducted =
        typeof tests !== "undefined" ? tests.length : null;

    // Get the last test conducted
    const lastTestConducted =
        numberOfTestsConducted > 0 ? tests[tests.length - 1] : null;

    // Calculate the time elapsed since the last test
    const timeElapsedSinceLastTest = () => {
        if (numberOfTestsConducted > 0) {
            const lastTestTime = moment(lastTestConducted.time).locale(
                ForisTranslations.locale
            );
            return moment(lastTestTime).fromNow();
        }
        return null;
    };
    const timeElapsed = timeElapsedSinceLastTest();

    return (
        <Card
            title={_("LibreSpeed")}
            linkTo={ForisURLs.librespeedSpeedTest}
            linkTitle={_("Go to LibreSpeed")}
            onRefresh={handleRefresh}
        >
            {lastTestConducted ? (
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
                                        {lastTestConducted.speed_download}
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
                                        {lastTestConducted.speed_upload}
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
                                        {lastTestConducted.ping >= 0
                                            ? lastTestConducted.ping
                                            : _("N/A")}
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
                                        {lastTestConducted.jitter >= 0
                                            ? lastTestConducted.jitter
                                            : _("N/A")}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">{_("Server")}</th>
                                    <td
                                        className="text-end text-truncate"
                                        style={{ maxWidth: "5.8rem" }}
                                        title={lastTestConducted.server}
                                    >
                                        {lastTestConducted.server}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="d-flex card-text flex-grow-1">
                        <small className="text-muted mt-auto">
                            {_("Performed")} {timeElapsed}
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
