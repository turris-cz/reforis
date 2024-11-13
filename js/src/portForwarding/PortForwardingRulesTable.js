/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreeDotsMenu } from "foris";
import PropTypes from "prop-types";

RulesTable.propTypes = {
    rules: PropTypes.array.isRequired,
    onEditRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired,
};

export default function RulesTable({ rules, onEditRule, onDeleteRule }) {
    return (
        <>
            <h2>{_("Port Forwarding Rules")}</h2>
            {rules.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover text-nowrap">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">{_("Name")}</th>
                                <th scope="col">{_("Internal IP address")}</th>
                                <th scope="col">{_("External port")}</th>
                                <th scope="col">{_("Internal port")}</th>
                                <th scope="col" className="text-center">
                                    {_("Enabled")}
                                </th>
                                <th scope="col" aria-label={_("Actions")} />
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((rule) => (
                                <RulesTableItem
                                    key={rule.name}
                                    rule={rule}
                                    onEditRule={onEditRule}
                                    onDeleteRule={onDeleteRule}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mb-1 text-muted text-center">
                    {_("No port forwarding rules defined.")}
                </p>
            )}
        </>
    );
}

RulesTableItem.propTypes = {
    rule: PropTypes.object.isRequired,
    onEditRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired,
};

function RulesTableItem({ rule, onEditRule, onDeleteRule }) {
    const { name, dest_ip, src_dport, dest_port, enabled } = rule;

    const handleEditRule = () => {
        onEditRule(rule);
    };

    const handleDeleteRule = () => {
        onDeleteRule(rule.name);
    };

    const threeDotsMenuItems = [
        {
            id: "edit",
            onClick: handleEditRule,
            icon: "fa-solid fa-edit",
            text: _("Edit"),
        },
        {
            id: "delete",
            onClick: handleDeleteRule,
            icon: "fa-solid fa-trash",
            text: _("Delete"),
        },
    ];

    const isRuleEnabled = enabled ? (
        <FontAwesomeIcon icon="fa-solid fa-check" className="text-success" />
    ) : (
        <FontAwesomeIcon icon="fa-solid fa-times" className="text-danger" />
    );

    return (
        <tr className="align-middle">
            <td>{name}</td>
            <td>{dest_ip}</td>
            <td>{src_dport}</td>
            <td>{dest_port}</td>
            <td className="text-center">{isRuleEnabled}</td>
            <td className="text-end">
                <ThreeDotsMenu data-testid="three-dots-menu">
                    {threeDotsMenuItems.map((item) => (
                        <button
                            type="button"
                            key={item.id}
                            onClick={item.onClick}
                            className="dropdown-item"
                            data-testid={`three-dots-menu-${item.id}`}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="me-1"
                                width="1rem"
                                size="sm"
                            />
                            {item.text}
                        </button>
                    ))}
                </ThreeDotsMenu>
            </td>
        </tr>
    );
}
