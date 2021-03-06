/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import PackageCheckBox from "../PackageCheckBox";

UserOption.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,
    url: PropTypes.string,
    index: PropTypes.number.isRequired,
    packageIndex: PropTypes.number.isRequired,
    setFormValue: PropTypes.func,
};

export default function UserOption({
    name,
    title,
    description,
    enabled,
    disabled,
    labels,
    url,
    index,
    packageIndex,
    setFormValue,
}) {
    return (
        <PackageCheckBox
            name={title}
            labels={labels}
            url={url}
            helpText={description}
            checked={enabled}
            disabled={disabled}
            onChange={setFormValue((value) => ({
                package_lists: {
                    [packageIndex]: {
                        options: { [index]: { enabled: { $set: value } } },
                    },
                },
            }))}
            key={name}
        />
    );
}
