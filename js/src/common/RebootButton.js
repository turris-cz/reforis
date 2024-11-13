/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button, ActionButtonWithModal } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

TriggerButton.propTypes = {
    forisFormSize: PropTypes.bool,
};

function TriggerButton({ forisFormSize, ...props }) {
    return (
        <Button className="btn-danger" {...props} forisFormSize={forisFormSize}>
            {_("Reboot")}
        </Button>
    );
}

RebootButton.propTypes = {
    forisFormSize: PropTypes.bool,
};

function RebootButton({ forisFormSize }) {
    const actionTriggerBtn = (props) => (
        <TriggerButton {...props} forisFormSize={forisFormSize} />
    );

    return (
        <ActionButtonWithModal
            actionTrigger={actionTriggerBtn}
            actionUrl={API_URLs.reboot}
            modalTitle={_("Warning!")}
            modalMessage={_("Are you sure you want to reboot the router?")}
            modalActionText={_("Reboot")}
            modalActionProps={{ className: "btn-danger" }}
            successMessage={_("The router has been rebooted successfully.")}
            errorMessage={_("An error occurred while rebooting the router.")}
        />
    );
}

export default RebootButton;
