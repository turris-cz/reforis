/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import {
    Button,
    WebSockets,
    withSpinnerOnSending,
    withErrorMessage,
} from "foris";
import PropTypes from "prop-types";

import ForwarderModal from "./Forwarder/ForwarderModal";
import ForwardersTable from "./ForwardersTable";
import useForwardersList from "./hooks";

Forwarders.propTypes = {
    value: PropTypes.string,
    setFormValue: PropTypes.func,
    ws: PropTypes.instanceOf(WebSockets),
    disabled: PropTypes.bool,
};

export default function Forwarders({ value, setFormValue, ws, disabled }) {
    const [forwarderList, forwarderListState] = useForwardersList(ws);
    return (
        <ForwardersFormWithErrorAndSpinner
            apiState={forwarderListState}
            forwarderList={forwarderList}
            value={value}
            setFormValue={setFormValue}
            disabled={disabled}
        />
    );
}

ForwardersForm.propTypes = {
    forwarderList: PropTypes.array,
    value: PropTypes.string,
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

function ForwardersForm({ forwarderList, value, setFormValue, disabled }) {
    const [forwarderToEdit, setForwarderToEdit] = useState(null);
    const [forwarderModalShown, setForwarderModalShown] = useState(false);

    const editForwarder = (forwarder) => {
        setForwarderToEdit(forwarder);
        setForwarderModalShown(true);
    };

    const addForwarder = () => {
        setForwarderToEdit(null);
        setForwarderModalShown(true);
    };

    return (
        <>
            <ForwardersTable
                forwarders={forwarderList}
                selectedForwarder={value}
                setFormValue={setFormValue}
                editForwarder={editForwarder}
                disabled={disabled}
            />
            <div className="text-end">
                <AddForwarderButton onClick={() => addForwarder()} />
            </div>
            <ForwarderModal
                shown={forwarderModalShown}
                setShown={setForwarderModalShown}
                forwarder={forwarderToEdit}
                title={
                    forwarderToEdit
                        ? _("Edit forwarder")
                        : _("Add custom forwarder")
                }
            />
        </>
    );
}

const ForwardersFormWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(ForwardersForm)
);

AddForwarderButton.propTypes = {
    onClick: PropTypes.func,
};

function AddForwarderButton({ onClick }) {
    return (
        <Button
            forisFormSize
            className="btn-outline-success btn mb-3 mb-sm-2 mb-md-0"
            onClick={onClick}
        >
            {_("Add custom forwarder")}
        </Button>
    );
}
