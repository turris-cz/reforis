/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {useUID} from 'react-uid/dist/es5/index';
import {formFieldsSize} from './constants';

/** Base bootstrap input component. */
export default function Input({type, label, helpText, error, children, ...props}) {
    const uid = useUID();
    return <div className={formFieldsSize}>
        <div className='form-group'>
            <label htmlFor={uid}>{label}</label>
            <div className='input-group'>
                <input
                    className={'form-control ' + (error ? 'is-invalid' : '')}
                    type={type}
                    id={uid}

                    {...props}
                />
                {children}
            </div>
            {error ? <div className='invalid-feedback'>{error}</div> : null}
            {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
        </div>
    </div>;
}
