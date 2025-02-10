/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { WebSockets } from "foris";
import { fireEvent, render, wait } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";

import diffSnapshot from "snapshot-diff";
import mockAxios from "jest-mock-axios";

import PortForwarding from "portForwarding/PortForwarding";
import lanSettingsFixture from "portForwarding/__fixtures__/lanSettings";
import portForwardingFixture from "portForwarding/__fixtures__/portForwarding";

describe("<PortForwarding/>", () => {
    let firstRender;
    let asFragment;
    let getByText;
    let getByLabelText;
    let getByTestId;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const renderRes = render(
            <>
                <PortForwarding ws={webSockets} />
                <div id="modal-container" />
            </>
        );
        getByText = renderRes.getByText;
        getByLabelText = renderRes.getByLabelText;
        getByTestId = renderRes.getByTestId;
        asFragment = renderRes.asFragment;

        mockAxios.mockResponse({ data: portForwardingFixture });
        mockAxios.mockResponse({ data: lanSettingsFixture });

        await wait(() => renderRes.getByText("Add rule"));
        firstRender = renderRes.asFragment();
    });

    it("should handle error when fetching data fails", async () => {
        const webSockets = new WebSockets();
        const { getByText } = render(<PortForwarding ws={webSockets} />);

        mockJSONError();
        mockJSONError();

        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("should render page with one rule defined", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("should open modal when adding rule", () => {
        const addRuleButton = getByText("Add rule");
        addRuleButton.parentElement.click();
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("should add port forwarding rule", () => {
        const addRuleButton = getByText("Add rule");
        addRuleButton.parentElement.click();

        fireEvent.change(getByLabelText("Name"), {
            target: { value: "Test" },
        });
        fireEvent.change(getByLabelText("Internal IPv4 address"), {
            target: { value: "192.168.2.102" },
        });
        fireEvent.change(getByLabelText("External port"), {
            target: { value: "8090" },
        });
        fireEvent.change(getByLabelText("Internal port"), {
            target: { value: "8090" },
        });
        fireEvent.click(getByLabelText("Enabled"));

        const saveButton = getByText("Save");
        saveButton.parentElement.click();

        expect(mockAxios.post).toBeCalled();

        const data = {
            name: "Test",
            dest_ip: "192.168.2.102",
            dest_port: "8090",
            src_dport: "8090",
            enabled: true,
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan/port-forwarding",
            data,
            expect.anything()
        );
    });

    it("should delete rule", async () => {
        expect(getByText("Service")).toBeTruthy();
        const threeDotsDelBtn = getByTestId("three-dots-menu-delete");

        fireEvent.click(threeDotsDelBtn);

        expect(mockAxios.delete).toBeCalled();
        expect(mockAxios.delete).toHaveBeenCalledWith(
            "/reforis/api/lan/port-forwarding/Service",
            expect.anything()
        );
    });

    it("should edit rule", async () => {
        const threeDotsEditBtn = getByTestId("three-dots-menu-edit");
        fireEvent.click(threeDotsEditBtn);

        fireEvent.change(getByLabelText("Name"), {
            target: { value: "Test" },
        });

        const saveButton = getByText("Save");
        saveButton.parentElement.click();

        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/lan/port-forwarding",
            {
                old_name: "Service",
                name: "Test",
                dest_ip: "192.168.2.101",
                dest_port: 8090,
                src_dport: 8090,
                enabled: true,
            },
            expect.anything()
        );
    });

    it("should handle error when adding rule fails: port is already in use", async () => {
        expect(getByText("Service")).toBeTruthy();

        const addRuleButton = getByText("Add rule");
        addRuleButton.parentElement.click();

        fireEvent.change(getByLabelText("Name"), {
            target: { value: "Test" },
        });
        fireEvent.change(getByLabelText("Internal IPv4 address"), {
            target: { value: "192.168.2.102" },
        });
        fireEvent.change(getByLabelText("External port"), {
            target: { value: "8090" },
        });
        fireEvent.change(getByLabelText("Internal port"), {
            target: { value: "8090" },
        });
        fireEvent.click(getByLabelText("Enabled"));

        const saveButton = getByText("Save");
        saveButton.parentElement.click();

        mockJSONError("Port is already in use.");

        await wait(() => {
            expect(mockSetAlert).toBeCalledWith("Port is already in use.");
        });
    });
});
