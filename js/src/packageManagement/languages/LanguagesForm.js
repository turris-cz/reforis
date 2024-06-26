/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { CheckBox } from "foris";
import PropTypes from "prop-types";

LanguagesForm.propTypes = {
    formData: PropTypes.shape({
        languages: PropTypes.arrayOf(
            PropTypes.shape({
                code: PropTypes.string.isRequired,
                enabled: PropTypes.bool.isRequired,
            })
        ).isRequired,
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function LanguagesForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h2>Languages List</h2>
            <div className="container-fluid mb-3">
                <div className="row justify-content-start">
                    {formData.languages.map((language, idx) => (
                        <div
                            className="col-2 col-lg-1 me-4"
                            key={language.code}
                        >
                            <CheckBox
                                label={language.code.toUpperCase()}
                                checked={language.enabled}
                                disabled={disabled}
                                onChange={setFormValue((value) => ({
                                    languages: {
                                        [idx]: { enabled: { $set: value } },
                                    },
                                }))}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
