/*
 * Copyright (C) 2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import { RadioSet } from "foris";
import PropTypes from "prop-types";

import SentinelEULAModal from "./SentinelEULAModal";

SentinelEULA.propTypes = {
    formData: PropTypes.shape({
        eula: PropTypes.number,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

function SentinelEULA({ formData, setFormValue, disabled }) {
    const [shown, setShown] = useState(false);
    const onModalToggle = () => {
        setShown((prev) => !prev);
    };

    return (
        <>
            <h2>{_("Licence Agreement")}</h2>
            <RadioSet
                choices={getEULAChoices(onModalToggle)}
                name={_("Agreement")}
                value={formData.eula.toString()}
                onChange={setFormValue((value) => ({
                    eula: { $set: parseInt(value) },
                }))}
                disabled={disabled}
            />
            <SentinelEULAModal
                formData={formData}
                shown={shown}
                setShown={setShown}
            />
        </>
    );
}

export default SentinelEULA;

// Hack to make link with translations clickable in order to toggle modal.
function getEULAChoices(onModalToggle) {
    function onClickHandler(e) {
        const el = e.target.closest("a");
        if (el && e.currentTarget.contains(el)) {
            e.preventDefault();
            onModalToggle();
        }
    }

    return [
        {
            value: "1",
            label: (
                // eslint-disable-next-line max-len
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    onClick={onClickHandler}
                    dangerouslySetInnerHTML={{
                        __html: _(
                            "I accept the <a href='#'>Terms of Participation in Turris Project (Data Collection)</a>."
                        ),
                    }}
                />
            ),
        },
        {
            value: "0",
            label: (
                // eslint-disable-next-line max-len
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    onClick={onClickHandler}
                    dangerouslySetInnerHTML={{
                        __html: _(
                            "I do not accept the <a href='#'>Terms of Participation in Turris Project (Data Collection)</a>."
                        ),
                    }}
                />
            ),
        },
    ];
}
