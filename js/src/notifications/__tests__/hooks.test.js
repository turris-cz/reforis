/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import React from "react";
import {
    fireEvent,
    getByText,
    queryByText,
    render,
    wait,
    act,
} from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";

import { notificationsFixture } from "./__fixtures__/notifications";
import Notifications from "../Notifications/Notifications";

describe("useNotifications hook.", () => {
    let webSockets;
    let notificationsContainer;

    beforeEach(async () => {
        webSockets = new WebSockets();
        const { container } = render(<Notifications ws={webSockets} />);
        mockAxios.mockResponse({ data: notificationsFixture });

        await wait(() => getByText(container, "Notification message."));
        notificationsContainer = container;
    });

    it("Fetch notifications.", () => {
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(
            "/reforis/api/notifications",
            expect.anything()
        );
    });

    it("Render notifications.", () => {
        const HTMLNotificationMessage = queryByText(
            notificationsContainer,
            "Notification message."
        );
        expect(HTMLNotificationMessage).not.toBeNull();
    });

    it("Don't show displayed notifications.", () => {
        const HTMLnotificationMessage = queryByText(
            notificationsContainer,
            "Displayed notification me..."
        );
        expect(HTMLnotificationMessage).toBeNull();
    });

    it("Dismiss notification.", () => {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        fireEvent.click(notificationsContainer.querySelector(".btn-close"));
        expect(mockAxios.post).toHaveBeenCalledTimes(1);

        const notificationToDismiss = notificationsFixture.notifications[0];
        const wsMessage = {
            module: "router_notifications",
            action: "mark_as_displayed",
            data: { ids: [notificationToDismiss.id], new_count: 2 },
        };
        // Simulate receiving message from WS server
        act(() => webSockets.dispatch(wsMessage));

        let HTMLnotificationMessage = queryByText(
            notificationsContainer,
            notificationToDismiss.msg
        );
        expect(HTMLnotificationMessage).toBeNull();
        HTMLnotificationMessage = queryByText(
            notificationsContainer,
            "Second notification message."
        );
        expect(HTMLnotificationMessage).not.toBeNull();
    });

    it("Dismiss all notification.", () => {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);

        fireEvent.click(getByText(notificationsContainer, "Dismiss all"));
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith(
            "/reforis/api/notifications",
            { ids: ["123-123", "123-124"] },
            expect.anything()
        );

        // Simulate receiving message from WS server
        act(() =>
            webSockets.dispatch({
                module: "router_notifications",
                action: "mark_as_displayed",
                data: { ids: ["123-123", "123-124", "808-909"], new_count: 0 },
            })
        );

        let HTMLnotificationMessage = queryByText(
            notificationsContainer,
            "Notification message."
        );
        expect(HTMLnotificationMessage).toBeNull();

        HTMLnotificationMessage = queryByText(
            notificationsContainer,
            "Second notification message."
        );
        expect(HTMLnotificationMessage).toBeNull();
    });
});
