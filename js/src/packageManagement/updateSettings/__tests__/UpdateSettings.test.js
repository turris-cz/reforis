/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    fireEvent,
    render,
    waitForElement,
    wait,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";

import mockAxios from "jest-mock-axios";
import diffSnapshot from "snapshot-diff";
import { updatesFixture } from "./__fixtures__/updates";
import UpdateSettings from "../UpdateSettings";

const ENABLE_CHECKBOX_LABEL = /Enable automatic updates/i;

describe("<UpdateSettings/>", () => {
    let firstRender;
    let getByLabelText;
    let getByText;
    let asFragment;

    beforeEach(async () => {
        const renderRes = render(<UpdateSettings />);
        mockAxios.mockResponse({ data: updatesFixture() });
        asFragment = renderRes.asFragment;
        getByLabelText = renderRes.getByLabelText;
        getByText = renderRes.getByText;

        await waitForElement(() =>
            renderRes.getByLabelText(ENABLE_CHECKBOX_LABEL)
        );
        firstRender = renderRes.asFragment();
    });

    it("should handle error", async () => {
        const { getByText } = render(<UpdateSettings />);
        mockJSONError();
        await wait(() => {
            expect(
                getByText("An error occurred while fetching data.")
            ).toBeTruthy();
        });
    });

    it("Test with snapshot disabled.", () => {
        expect(firstRender).toMatchSnapshot();
    });

    it("Test with snapshot enabled.", () => {
        fireEvent.click(getByLabelText(ENABLE_CHECKBOX_LABEL));
        expect(diffSnapshot(firstRender, asFragment())).toMatchSnapshot();
    });

    it("Test with snapshot enabled, delayed.", () => {
        fireEvent.click(getByLabelText(ENABLE_CHECKBOX_LABEL));
        const enabledRender = asFragment();
        fireEvent.click(getByLabelText(/Delayed updates/i));
        expect(diffSnapshot(enabledRender, asFragment())).toMatchSnapshot();
    });

    it("Post: enabled, delayed", () => {
        fireEvent.click(getByLabelText(ENABLE_CHECKBOX_LABEL));
        fireEvent.click(getByLabelText(/Delayed updates/i));
        fireEvent.click(getByText("Save"));

        expect(mockAxios.post).toBeCalled();
        const data = {
            approval_settings: {
                delay: 1,
                status: "delayed",
            },
            enabled: true,
            reboots: {
                delay: 4,
                time: "04:30",
            },
        };
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/updates",
            data,
            expect.anything()
        );
    });
});
