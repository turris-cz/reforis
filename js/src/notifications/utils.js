/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import PropTypes from "prop-types";

const SEVERITIES = ["news", "restart", "error", "update", "test"];
const NOTIFICATION_PROP_TYPES = PropTypes.shape({
    msg: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    displayed: PropTypes.bool.isRequired,
    severity: PropTypes.oneOf(SEVERITIES).isRequired,
}).isRequired;
export default NOTIFICATION_PROP_TYPES;
