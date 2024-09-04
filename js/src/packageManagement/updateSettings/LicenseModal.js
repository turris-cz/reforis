/*
 * Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import POINTS from "./points";

export default function LicenseModal() {
    return (
        // There is a plain HTML modal component (not a react Modal component from Foris JS library),
        // because we won't create a workaround in order to show/hide it onclick from UpdateSettings.js link.
        // Might be improved in the future.
        <div
            className="modal fade"
            id="licenseModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="licenseModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {_("Most Important License Agreement Points")}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label={_("Close")}
                        />
                    </div>
                    <div className="modal-body">
                        <ul>
                            {POINTS.map((point) => (
                                <li key={point.id}>{point.text}</li>
                            ))}
                        </ul>
                        <p className="fw-bold">
                            {_(
                                "By enabling the automatic updates, you confirm that you are the owner of this Turris router, and you agree with the full text of the "
                            )}
                            <a
                                href="https://www.turris.cz/omnia-updater-eula"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {_("license agreement")}
                                <sup>
                                    <FontAwesomeIcon
                                        icon={["fas", "external-link-alt"]}
                                        className="fa-sm ms-1"
                                    />
                                </sup>
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
