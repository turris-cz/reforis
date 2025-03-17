/*
 * Copyright (C) 2020-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    fireEvent,
    getByLabelText,
    getByText,
    render,
    wait,
    waitForElement,
} from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";
import notificationsSettings, {
    testNotificationSeverityFixture2,
    testNotificationSeverityFixture3,
} from "./__fixtures__/notificationsSettings";

import NotificationsSettings from "../NotificationsSettings";
import {
    UNSAVED_CHANGES_MODAL_MESSAGE,
    SEVERITY_ALERT_MESSAGE,
} from "../TestNotification";

const ENABLE_CHECKBOX_LABEL = "Enable email notifications";

describe("<NotificationsSettings/>", () => {
    let NotificationsSettingsContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const { container } = render(
            <>
                <NotificationsSettings ws={webSockets} />
                <div id="modal-container" />
            </>
        );
        mockAxios.mockResponse({ data: notificationsSettings() });
        NotificationsSettingsContainer = container;
        await wait(() => {
            expect(
                getByLabelText(container, ENABLE_CHECKBOX_LABEL)
            ).toBeTruthy();
        });
    });

    it("should handle error", async () => {
        const webSockets = new WebSockets();
        const { container } = render(<NotificationsSettings ws={webSockets} />);
        mockJSONError();
        await wait(() =>
            getByText(container, "An error occurred while fetching data.")
        );
    });

    describe("Email notifications", () => {
        it("Enabled, smtp_type:custom", () => {
            expect(NotificationsSettingsContainer).toMatchSnapshot();
        });

        it("Disabled", () => {
            fireEvent.click(
                getByLabelText(
                    NotificationsSettingsContainer,
                    ENABLE_CHECKBOX_LABEL
                )
            );
            expect(NotificationsSettingsContainer).toMatchSnapshot();
        });

        it("Enabled,smtp_type:turris", () => {
            fireEvent.click(
                getByLabelText(NotificationsSettingsContainer, "Turris")
            );
            expect(NotificationsSettingsContainer).toMatchSnapshot();
        });

        it("Post.", () => {
            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            expect(mockAxios.post).toBeCalled();
            const data = {
                emails: {
                    common: {
                        send_news: true,
                        severity_filter: 1,
                        to: ["some@example.com"],
                    },
                    enabled: true,
                    smtp_custom: {
                        from: "router@example.com",
                        host: "example.com",
                        password: "test_password",
                        port: 465,
                        security: "ssl",
                        username: "root",
                    },
                    smtp_type: "custom",
                },
                ntfy: {
                    enabled: false,
                },
            };
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                data,
                expect.anything()
            );
        });

        it("Post smtp_type:turris.", () => {
            fireEvent.click(
                getByLabelText(NotificationsSettingsContainer, "Turris")
            );
            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            expect(mockAxios.post).toBeCalled();
            const data = {
                emails: {
                    common: {
                        send_news: true,
                        severity_filter: 1,
                        to: ["some@example.com"],
                    },
                    enabled: true,
                    smtp_type: "turris",
                    smtp_turris: { sender_name: "turris" },
                },
                ntfy: {
                    enabled: false,
                },
            };
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                data,
                expect.anything()
            );
        });

        it("Post disabled.", () => {
            fireEvent.click(
                getByLabelText(
                    NotificationsSettingsContainer,
                    ENABLE_CHECKBOX_LABEL
                )
            );
            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            expect(mockAxios.post).toBeCalled();
            const data = {
                emails: { enabled: false },
                ntfy: {
                    enabled: false,
                },
            };
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                data,
                expect.anything()
            );
        });
    });

    describe("ntfy", () => {
        it("Disabled", () => {
            expect(NotificationsSettingsContainer).toMatchSnapshot();
        });

        it("Enabled", () => {
            fireEvent.click(
                getByLabelText(
                    NotificationsSettingsContainer,
                    "Enable ntfy notifications"
                )
            );
            expect(NotificationsSettingsContainer).toMatchSnapshot();
        });

        it("Post.", () => {
            fireEvent.click(
                getByLabelText(
                    NotificationsSettingsContainer,
                    "Enable ntfy notifications"
                )
            );

            fireEvent.input(
                getByLabelText(NotificationsSettingsContainer, "URL"),
                { target: { value: "https://example.com" } }
            );

            fireEvent.change(
                getByLabelText(NotificationsSettingsContainer, "Priority"),
                { target: { value: "max" } }
            );

            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            const data = {
                emails: {
                    common: {
                        send_news: true,
                        severity_filter: 1,
                        to: ["some@example.com"],
                    },
                    enabled: true,
                    smtp_custom: {
                        from: "router@example.com",
                        host: "example.com",
                        password: "test_password",
                        port: 465,
                        security: "ssl",
                        username: "root",
                    },
                    smtp_type: "custom",
                },
                ntfy: {
                    enabled: true,
                    url: "https://example.com",
                    priority: "max",
                },
            };
            expect(mockAxios.post).toBeCalled();
            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                data,
                expect.anything()
            );
        });
    });

    describe("<TestNotification/>", () => {
        let option;

        beforeEach(() => {
            option = getByLabelText(
                NotificationsSettingsContainer,
                /Importance/
            );
        });

        it("Displaying test notification importance warning (severity: 1)", () => {
            expect(
                NotificationsSettingsContainer.childNodes[3].childNodes[0]
                    .innerHTML
            ).toEqual(SEVERITY_ALERT_MESSAGE);
            expect(
                NotificationsSettingsContainer.childNodes[3]
            ).toMatchSnapshot();
        });

        it("No test notification importance warning (severity: 2)", () => {
            fireEvent.change(option, {
                target: {
                    value: "2",
                },
            });
            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                testNotificationSeverityFixture2(),
                expect.anything()
            );
            expect(
                NotificationsSettingsContainer.childNodes[3]
            ).toMatchSnapshot();
        });

        it("No test notification importance warning (severity: 3)", () => {
            fireEvent.change(option, {
                target: {
                    value: "3",
                },
            });
            fireEvent.click(getByText(NotificationsSettingsContainer, "Save"));

            expect(mockAxios.post).toHaveBeenCalledWith(
                "/reforis/api/notifications-settings",
                testNotificationSeverityFixture3(),
                expect.anything()
            );
            expect(
                NotificationsSettingsContainer.childNodes[3]
            ).toMatchSnapshot();
        });

        it("Should toggle unsaved changes warning modal", async () => {
            fireEvent.change(option, {
                target: {
                    value: "2",
                },
            });
            fireEvent.click(
                getByText(
                    NotificationsSettingsContainer,
                    "Send test notification"
                )
            );
            await waitForElement(() =>
                getByText(
                    NotificationsSettingsContainer,
                    UNSAVED_CHANGES_MODAL_MESSAGE
                )
            );
            expect(
                NotificationsSettingsContainer.childNodes[3]
            ).toMatchSnapshot();
        });
    });
});
