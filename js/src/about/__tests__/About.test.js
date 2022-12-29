/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { render } from "foris/testUtils/customTestRender";

import About from "../About";

describe("About", () => {
    it("should render About page", async () => {
        const { getByText } = render(<About />);
        expect(getByText("About")).toBeDefined();
    });
});
