/*
 * Copyright (C) 2020-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import POINTS from "./points";

export default function LicenceModal() {
    return (
        // There is a plain HTML modal compoment (not a react Modal component from Foris JS library),
        // because we won't create a workaround in order to show/hide it onclick from UpdateSettings.js link.
        // Might be improved in the future.
        <div
            className="modal fade"
            id="licenceModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
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
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ul>
                            {POINTS.map((point) => (
                                <li key={point.id}>{point.text}</li>
                            ))}
                        </ul>
                        <p
                            className="font-weight-bold"
                            dangerouslySetInnerHTML={{
                                __html: _(
                                    'By enabling the automatic updates, you confirm that you are the owner of this Turris router, and you agree with the full text of the <a href="https://www.turris.cz/omnia-updater-eula" target="_blank" rel="noopener noreferrer">license agreement <sup><i class="fas fa-external-link-alt fa-sm"></i></sup></a>.'
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
