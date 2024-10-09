/*
 * Copyright (C) 2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";

import axios from "axios";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ForisURLs,
} from "foris";
import PropTypes from "prop-types";

function useSessionTimeout() {
    const warningTimerRef = useRef(null);
    const logoutTimerRef = useRef(null);
    const [showWarning, setShowWarning] = useState(false);

    const logout = useCallback(() => {
        setShowWarning(false);
        clearTimeout(warningTimerRef.current);
        clearTimeout(logoutTimerRef.current);
        window.location.replace(ForisURLs.logout);
    }, []);

    const startTimers = useCallback(() => {
        const warningTime = 9 * 60 * 1000; // 9 minutes, 1 minute before logout
        const logoutTime = 10 * 60 * 1000; // 10 minutes

        warningTimerRef.current = setTimeout(() => {
            setShowWarning(true);
        }, warningTime);

        logoutTimerRef.current = setTimeout(() => {
            logout();
        }, logoutTime);
    }, [logout]);

    const extendSession = () => {
        axios
            .post(ForisURLs.extendSession)
            .then(() => {
                setShowWarning(false);
                clearTimeout(warningTimerRef.current);
                clearTimeout(logoutTimerRef.current);
                startTimers();
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error("Error extending session:", error);
            });
    };

    useEffect(() => {
        startTimers();

        return () => {
            clearTimeout(warningTimerRef.current);
            clearTimeout(logoutTimerRef.current);
        };
    }, [startTimers]);

    return { showWarning, setShowWarning, logout, extendSession };
}

SessionTimeoutModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    extendSession: PropTypes.func.isRequired,
};

function SessionTimeoutModal({ shown, setShown, logout, extendSession }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title="Session Timeout" />
            <ModalBody>
                <p>
                    Your session is about to expire. Do you want to continue
                    working?
                </p>
                <p>
                    Please note that if you do not respond, you will be logged
                    out automatically.
                </p>
            </ModalBody>
            <ModalFooter>
                <Button className="btn-secondary" onClick={logout}>
                    Logout
                </Button>
                <Button onClick={extendSession}>Continue</Button>
            </ModalFooter>
        </Modal>
    );
}

export default useSessionTimeout;
export { SessionTimeoutModal };
