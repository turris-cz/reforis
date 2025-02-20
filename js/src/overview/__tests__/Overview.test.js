/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";

import Overview from "../Overview";
import displayCard from "../utils";
import {
    packageListsFixture,
    threatDetectionCardFixture,
    automaticUpdatesCardFixture,
    librespeedCardFixture,
    openVPNClientsCardFixture,
} from "./__fixtures__/overview";
import { notificationsFixture } from "../../notifications/__tests__/__fixtures__/notifications";
import { render, wait, getByText } from "foris/testUtils/customTestRender";

describe("Overview", () => {
    beforeEach(() => {
        global.ForisPlugins = [
            {
                name: "LibreSpeed",
                weight: 65,
                path: "/librespeed",
                icon: "librespeed",
            },
            {
                name: "OpenVPN",
                weight: 70,
                path: "/openvpn",
                icon: "user-shield",
            },
        ];
    });
    let overviewContainer;

    it("Snapshot of the whole page", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<Overview ws={webSockets} />);

        mockAxios.mockResponse({ data: packageListsFixture });
        await wait(() => getByText(container, "Overview"));

        mockAxios.mockResponse({ data: automaticUpdatesCardFixture });
        await wait(() => getByText(container, "Automatic Updates"));

        mockAxios.mockResponse({ data: threatDetectionCardFixture });
        await wait(() => getByText(container, "Threat Detection"));

        mockAxios.mockResponse({ data: librespeedCardFixture });
        await wait(() => getByText(container, "LibreSpeed"));

        mockAxios.mockResponse({ data: openVPNClientsCardFixture });
        await wait(() => getByText(container, "OpenVPN Clients"));

        mockAxios.mockResponse({ data: notificationsFixture });
        await wait(() => getByText(container, "Dismiss all"));
        overviewContainer = container;
        expect(overviewContainer).toMatchSnapshot();
    });

    it("Should display given cards", () => {
        expect(displayCard(packageListsFixture, "sentinel")).toBe(true);
    });

    it("Should display given options", () => {
        expect(displayCard(packageListsFixture, "dynfw")).toBe(true);
    });
});
