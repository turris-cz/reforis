/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button } from "foris";
import PropTypes from "prop-types";

StaticLeasesAddButton.propTypes = {
    addStaticLease: PropTypes.func,
};

export default function StaticLeasesAddButton({ addStaticLease }) {
    return (
        <div className="text-end">
            <Button
                forisFormSize
                className="btn-outline-primary"
                onClick={addStaticLease}
            >
                {_("Add static lease")}
            </Button>
        </div>
    );
}
