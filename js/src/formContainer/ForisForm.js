/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState, useEffect} from 'react';
import propTypes from 'prop-types';

import {useForisForm} from './hooks';
import SubmitButton from './SubmitButton';

ForisForm.propTypes = {
    ws: propTypes.object,
    forisConfig: propTypes.shape({
        endpoint: propTypes.shape({name: propTypes.string.isRequired}).isRequired,
        wsModule: propTypes.string,
        wsAction: propTypes.string,
    }).isRequired,
    prepData: propTypes.func.isRequired,
    prepDataToSubmit: propTypes.func.isRequired,
    validator: propTypes.func.isRequired,
    children: propTypes.node.isRequired,
};

ForisForm.defaultProps = {
    prepData: data => data,
    prepDataToSubmit: data => data,
    validator: () => undefined,
    disableIf: () => false,
};

export default function ForisForm({ws, forisConfig, prepData, prepDataToSubmit, validator, disableIf, children}) {
    const [
        formData,
        formErrors,
        formState,
        formIsDisabled,

        setFormValue,
        onSubmit,
    ] = useForisForm(ws, forisConfig, prepData, prepDataToSubmit, validator);

    const [disabled, setDisabled] = useState(false);
    useEffect(() => setDisabled(disableIf(formData)), [formData]);

    const childrenWithFormProps = JSON.stringify(formData) !== '{}' ? React.Children.map(
        children, child =>
            React.cloneElement(child, {
                formData: formData,
                formErrors: formErrors,
                disabled: formIsDisabled || disabled,

                setFormValue: setFormValue,
            })
    ) : null;

    return <form
        onSubmit={onSubmit}
        className={disabled ? 'text-muted' : null}
    >
        {childrenWithFormProps}
        <SubmitButton
            state={formState}
            disabled={!!formErrors || disabled}
        />
    </form>
}