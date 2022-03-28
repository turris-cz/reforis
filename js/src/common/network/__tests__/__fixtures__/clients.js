/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const clients = [
    {
        ip: "192.168.1.1",
        mac: "11:22:33:44:55:66",
        expires: 1539350186,
        active: true,
        hostname: "first",
    },
    {
        ip: "192.168.2.1",
        mac: "99:88:77:66:55:44",
        expires: 1539350188,
        active: false,
        hostname: "*",
    },
];

export const ipv6clients = [
    {
        hostname: "first",
        ipv6: "2002:1487:fede:6110",
        expires: 1539350188,
        duid: "00049367d8183c4e45a4b834f5a92f95d3b9",
    },
    {
        hostname: "second",
        ipv6: "2002:1487:fefd:6130",
        expires: 1539550188,
        duid: "00049367d8183c4c43a4b834f5a92f95d3b9",
    },
];
