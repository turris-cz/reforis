/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render } from "foris/testUtils/customTestRender";

import DHCP6Clients from "common/network/DHCP6Clients";
import { ipv6clients } from "./__fixtures__/clients";

describe("<DHCP6Clients/>", () => {
    it("Test with snapshot.", () => {
        const { container } = render(
            <DHCP6Clients ipv6clients={ipv6clients} />
        );
        expect(container).toMatchSnapshot();
    });
});
