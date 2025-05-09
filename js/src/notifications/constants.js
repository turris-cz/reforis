/*
 * Copyright (C) 2020-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const SEVERITIES = {
    NEWS: "news",
    RESTART: "restart",
    ERROR: "error",
    UPDATE: "update",
    TEST: "test",
};

export const NOT_DISMISSIBLE = [SEVERITIES.RESTART];
