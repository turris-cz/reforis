/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import Package from "./Package";

import "./PackagesForm.css";

PackagesForm.propTypes = {
    formData: PropTypes.shape({
        package_lists: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
            })
        ),
    }),
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function PackagesForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h2>{_("Package Lists")}</h2>
            <div className="container-fluid">
                <div className="packages-list">
                    {formData.package_lists.map((_package, index) => (
                        <Package
                            {..._package}
                            index={index}
                            setFormValue={setFormValue}
                            disabled={disabled}
                            key={_package.title}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
