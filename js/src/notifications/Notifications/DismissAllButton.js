/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

DismissAllButton.propTypes = {
    dismissAll: PropTypes.func.isRequired,
};

export default function DismissAllButton({ dismissAll }) {
    return (
        <button
            type="button"
            id="btn-dismiss-all"
            className="btn btn-outline-danger float-right"
            onClick={dismissAll}
        >
            <i className="fas fa-trash mr-1" />
            {_("Dismiss all")}
        </button>
    );
}
