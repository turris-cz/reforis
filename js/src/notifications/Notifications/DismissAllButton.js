/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "foris";
import PropTypes from "prop-types";

DismissAllButton.propTypes = {
    dismissAll: PropTypes.func.isRequired,
};

export default function DismissAllButton({ dismissAll }) {
    return (
        <Button
            id="btn-dismiss-all"
            className="btn-sm btn-outline-danger"
            onClick={dismissAll}
        >
            <FontAwesomeIcon icon="fa-solid fa-trash" className="me-1" />
            {_("Dismiss all")}
        </Button>
    );
}
