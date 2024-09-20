/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import moment from "moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { API_MODULE_URLs } from "common/API";

import "./NetmetrCard.css";

export default function Netmetr() {
    const [getDataState, getDataRequest] = useAPIGet(API_MODULE_URLs.netmetr);
    useEffect(() => {
        getDataRequest();
    }, [getDataRequest]);

    return (
        <NetmetrCardWithErrorAndSpinner
            apiState={getDataState.state}
            tests={getDataState.data || {}}
        />
    );
}

NetmetrCard.propTypes = {
    tests: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

function NetmetrCard({ tests: { performed_tests: tests } }) {
    const testsCount = typeof tests !== "undefined" ? tests.length : null;
    const lastTest = testsCount > 0 ? tests[0] : null;
    const timeFromNow =
        testsCount > 0
            ? moment(
                  moment.unix(lastTest.time).locale(ForisTranslations.locale)
              ).fromNow()
            : null;
    return (
        <div className="col mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h6 className="text-uppercase text-muted mb-2">
                        {_("NetMetr")}
                        <Link
                            to={{
                                pathname: "/netmetr/speed-test",
                            }}
                            className="text-secondary"
                            title={_("Go to NetMetr")}
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-chevron-right"
                                className="float-end"
                            />
                        </Link>
                    </h6>
                    {lastTest != null ? (
                        <>
                            <form className="mb-4">
                                <div className="table-responsive">
                                    <table className="table table-borderless table-hover col-12">
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    {_("Download")}
                                                    <span
                                                        className="badge badge-secondary"
                                                        title={_(
                                                            "Megabit per second"
                                                        )}
                                                    >
                                                        Mb/s
                                                    </span>
                                                </th>
                                                <td className="text-end">
                                                    {lastTest.speed_download}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    {_("Upload")}
                                                    <span
                                                        className="badge badge-secondary"
                                                        title={_(
                                                            "Megabit per second"
                                                        )}
                                                    >
                                                        Mb/s
                                                    </span>
                                                </th>
                                                <td className="text-end">
                                                    <span>
                                                        {lastTest.speed_upload}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    {_("Ping")}
                                                    <span
                                                        className="badge badge-secondary"
                                                        title={_("Millisecond")}
                                                    >
                                                        ms
                                                    </span>
                                                </th>
                                                <td className="text-end">
                                                    <span>
                                                        {lastTest.ping &&
                                                        lastTest.ping >= 0
                                                            ? lastTest.ping
                                                            : _("N/A")}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">{_("Link")}</th>
                                                <td className="text-end">
                                                    <a
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={`https://www.netmetr.cz/en/detail.html?${lastTest.test_uuid}`}
                                                    >
                                                        {_("Details")}
                                                        <sup>
                                                            <FontAwesomeIcon
                                                                icon="fa-solid fa-external-link-alt"
                                                                className="fa-sm ms-1"
                                                            />
                                                        </sup>
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                            <p className="card-text text-to-bottom">
                                <small className="text-muted">
                                    {_("Performed")}
                                    &nbsp;
                                    {timeFromNow}
                                </small>
                            </p>
                        </>
                    ) : (
                        <p className="text-muted">
                            {_("No tests have been performed lately.")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const NetmetrCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(NetmetrCard)
);
