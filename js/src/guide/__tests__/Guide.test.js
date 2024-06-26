/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    wait,
    getByText,
    getAllByText,
} from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import { interfacesFixture } from "interfaces/__tests__/__fixtures__/interfaces";

import Guide from "../Guide";
import { guideFixtures } from "./__fixtures__/guide";

describe("<Guide/> ", () => {
    let guideContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Guide ws={webSockets} />);

        mockAxios.mockResponse({ data: guideFixtures });
        mockAxios.mockResponse({});
        await wait(() => getByText(container, "Network Interfaces"));

        mockAxios.mockResponse({ data: "en" });
        mockAxios.mockResponse({ data: ["en", "cs", "ru"] });
        await wait(() => getAllByText(container, "EN"));

        mockAxios.mockResponse({ data: interfacesFixture() });
        await wait(() => getByText(container, "LAN1"));
        guideContainer = container;
    });

    it("Snapshot. Just check if render correct page.", () => {
        expect(guideContainer).toMatchSnapshot();
    });

    it("Should handle error.", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Guide ws={webSockets} />);
        mockJSONError();
        mockJSONError();
        await wait(() =>
            getByText(container, "An error occurred while fetching data.")
        );
    });
});
