/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useRef } from "react";

import { Popover } from "bootstrap";

function usePopover(title, content, placement = "top", trigger = "hover") {
    const popoverRef = useRef();

    useEffect(() => {
        const popover = new Popover(popoverRef.current, {
            title,
            content,
            placement,
            trigger,
            html: true,
        });

        return () => {
            popover.dispose();
        };
    });

    return popoverRef;
}

export default usePopover;
