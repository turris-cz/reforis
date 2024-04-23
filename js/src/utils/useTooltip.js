/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useRef } from "react";

import { Tooltip } from "bootstrap";

function useTooltip(description, placement = "top", trigger = "hover") {
    const tooltipRef = useRef();

    useEffect(() => {
        const tooltip = new Tooltip(tooltipRef.current, {
            title: description,
            placement,
            trigger,
        });

        return () => {
            tooltip.dispose();
        };
    });

    return tooltipRef;
}

export default useTooltip;
