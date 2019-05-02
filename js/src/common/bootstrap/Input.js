/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {useUID} from 'react-uid/dist/es5/index';

import {LABEL_SIZE, FIELD_SIZE} from './constants';


export default function Input({type, label, helpText, error, children, ...props}) {
    const uid = useUID();
    return <div className='form-group row'>
        <label className={'form-control-label col-sm-' + LABEL_SIZE} htmlFor={uid}>{label}</label>
        <div className={'col-sm-' + FIELD_SIZE}>
            <div className='input-group'>
                <input
                    type={type}
                    id={uid}

                    {...props}
                    className={'form-control ' + (error ? 'is-invalid' : '')}
                />
                {children}
            </div>
            <div className='invalid-feedback'>{error}</div>
            <small className="form-text text-muted">{helpText}</small>
        </div>
    </div>;
};