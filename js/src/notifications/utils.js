/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import propTypes from 'prop-types';

const SEVERITIES = ['news', 'restart', 'error', 'update'];
export const NOTIFICATION_PROP_TYPES =
    propTypes.shape({
        msg: propTypes.string.isRequired,
        id: propTypes.string.isRequired,
        created_at: propTypes.string.isRequired,
        displayed: propTypes.bool.isRequired,
        severity: propTypes.oneOf(SEVERITIES).isRequired
    }).isRequired;


const DATE_STRING_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

export function toLocaleDateString(date) {
    return new Date(date).toLocaleDateString(ForisTranslations.locale, DATE_STRING_OPTIONS);
}

