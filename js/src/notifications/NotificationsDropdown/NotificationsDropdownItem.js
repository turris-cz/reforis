/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {ForisURLs} from '../../common/constants';

import NotificationIcon from '../NotificationIcon';
import {NOTIFICATION_PROP_TYPES, toLocaleDateString} from '../utils';
import RebootButton from '../../common/RebootButton';


NotificationsDropdownItem.propTypes = {
    notification: NOTIFICATION_PROP_TYPES,
    divider: propTypes.bool.isRequired,
    dismiss: propTypes.func.isRequired,
};

export default function NotificationsDropdownItem({notification, divider, dismiss}) {
    const date = toLocaleDateString(notification.created_at);

    return <>
        <div className='dropdown-item notification-item'>
            <NotificationIcon severity={notification.severity} className={'fa-2x'}/>
            <div className='notifications-info'>
                <a href={`${ForisURLs.notifications}?id=${notification.id}`} className='notification-message'>
                    <small className='text-muted'>{date}</small>
                    <p>{cutMessage(notification.msg)}</p>
                </a>
            </div>
            <button className='btn btn-link' onClick={dismiss}>
                <i className='fas fa-times'/>
            </button>
        </div>
        {divider ? <div className='dropdown-divider'/> : null}
    </>;
}

function cutMessage(message) {
    const maxLength = 25;
    if (message.length > maxLength)
        return message.substring(0, maxLength) + '...';
    else
        return message;
}