/*
 * Copyright (C) 2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    API_STATE,
    ErrorMessage,
    Modal,
    ModalBody,
    ModalHeader,
    Spinner,
    useAPIGet,
} from "foris";
import PropTypes from "prop-types";

import { API_MODULE_URLs } from "common/API";

SentinelEULAModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        eula: PropTypes.number.isRequired,
        token: PropTypes.string,
    }),
};

export default function SentinelEULAModal({ shown, setShown, formData }) {
    const { eula } = formData;
    const [getEulaState, getEula] = useAPIGet(API_MODULE_URLs.sentinelEula);

    useEffect(() => {
        getEula({ data: { eula } });
    }, [eula, getEula]);

    let content;
    if (
        getEulaState.state === API_STATE.INIT ||
        getEulaState.state === API_STATE.SENDING
    ) {
        content = <Spinner />;
    } else if (getEulaState.state === API_STATE.ERROR) {
        content = <ErrorMessage />;
    } else {
        content = (
            <div className="display-linebreak text-monospace">
                {getEulaState.data.text}
            </div>
        );
    }

    return (
        <Modal scrollable setShown={setShown} shown={shown} size="lg">
            <ModalHeader
                title={_(
                    "Terms of Participation in Turris Project (Data Collection)"
                )}
                setShown={setShown}
            />
            <ModalBody>{content}</ModalBody>
        </Modal>
    );
}
