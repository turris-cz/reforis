/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { formFieldsSize, Button, ActionButtonWithModal } from "foris";

import { API_MODULE_URLs } from "common/API";

export default function FactoryReset() {
    return (
        <div className={formFieldsSize}>
            <h2>{_("Factory Reset")}</h2>
            <p>
                {_(
                    "Doing a factory reset on the Turris device will remove all the packages installed on the device along with the data associated with them. This brings back all the default settings of the device as it was when the router was new, giving you a clean slate to start all over again."
                )}
            </p>
            <div className="text-end">
                <ActionButtonWithModal
                    actionTrigger={TriggerButton}
                    actionMethod="PUT"
                    actionUrl={API_MODULE_URLs.schnapps}
                    modalTitle={_("Warning!")}
                    modalMessage={_(
                        "Are you sure you want to reset the router?"
                    )}
                    modalActionText={_("Reset")}
                    modalActionProps={{ className: "btn-danger" }}
                    successMessage={_(
                        "The router has been reset successfully."
                    )}
                    errorMessage={_(
                        "An error occurred while resetting the router."
                    )}
                />
            </div>
        </div>
    );
}

function TriggerButton(props) {
    return (
        <Button forisFormSize className="btn-danger" {...props}>
            {_("Factory Reset")}
        </Button>
    );
}
