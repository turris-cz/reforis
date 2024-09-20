/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "foris";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import useGuideFinish from "../hooks";

SkipGuideButton.propTypes = {
    next_step: PropTypes.string.isRequired,
};

export function SkipGuideButton({ next_step }) {
    const [clicked, setClicked] = useState(false);
    const [modalShown, setModalShown] = useState(false);

    const onGuideFinishHandler = useGuideFinish();
    const disabled = next_step === "password";

    const handleSkipGuide = (e) => {
        setClicked(true);
        onGuideFinishHandler(e);
        setModalShown(false);
    };

    return (
        <>
            <SkipGuideModal
                shown={modalShown}
                setShown={setModalShown}
                callback={handleSkipGuide}
            />
            <Button
                className={`btn-secondary me-2 align-self-stretch align-self-sm-center ${disabled ? "disabled" : ""}`.trim()}
                style={{ pointerEvents: "not-allowed" }}
                onClick={() => setModalShown(true)}
                disabled={disabled || clicked}
                loading={clicked}
            >
                <span className="d-flex flex-nowrap justify-content-center align-items-center align-self-stretch align-self-sm-center">
                    <span className="d-none d-sm-inline-block text-nowrap me-1">
                        {_("Skip")}
                    </span>
                    <FontAwesomeIcon icon="fa-solid fa-forward" />
                </span>
            </Button>
        </>
    );
}

SkipGuideModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

function SkipGuideModal({ shown, setShown, callback }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p>{_("Are you sure you want to skip the whole guide?")}</p>
                <p>
                    {_(
                        "This will skip the guide and you will be redirected to the overview page."
                    )}
                </p>
                <p>
                    {_(
                        "Settings that are not set up during the guide will be set to default values. And you will have to set them up manually."
                    )}
                </p>
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-secondary"
                    onClick={() => setShown(false)}
                >
                    {_("Cancel")}
                </Button>
                <Button className="btn-primary" onClick={callback}>
                    {_("Confirm")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}

const SkipGuideButtonWithRouter = withRouter(SkipGuideButton);

export default SkipGuideButtonWithRouter;
