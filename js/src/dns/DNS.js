/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { validateHostname, ForisForm, formFieldsSize } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import ConnectionTest from "connectionTest/ConnectionTest";

import PROVIDER_FORWARDER from "./constants";
import DNSForm from "./DNSForm";

DNS.propTypes = {
    ws: PropTypes.object.isRequired,
    postCallback: PropTypes.func,
};

DNS.defaultProps = {
    postCallback: () => undefined,
};

export default function DNS({ ws, postCallback }) {
    return (
        <>
            <h1>DNS</h1>
            <p>
                {_(
                    "Router Turris uses its own DNS resolver with DNSSEC support. It is capable of working independently or it can forward your DNS queries your internet service provider's DNS resolver."
                )}
            </p>
            <p>
                {_(
                    "The following setting determines the behavior of the DNS resolver. Usually, it is better to use the ISP's resolver in networks where it works properly. If it does not work for some reason, it is necessary to use direct resolving without forwarding."
                )}
            </p>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        "In rare cases, ISP's have an improperly configured network, which interferes with DNSSEC validation. If you experience problems with DNS, you can <b>temporarily</b> disable DNSSEC validation to determine the source of the problem. However, keep in mind that without DNSSEC validation, you are vulnerable to DNS spoofing attacks! Therefore we <b>recommend keeping DNSSEC turned on</b> and resolving the situation with your ISP as this is a serious flaw on their side."
                    ),
                }}
            />
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.dns,
                    wsModule: "dns",
                }}
                postCallback={postCallback}
                validator={validator}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
            >
                <DNSForm ws={ws} />
            </ForisForm>
            <div className={`${formFieldsSize}`}>
                <h2>{_("Connection Test")}</h2>
                <p
                    dangerouslySetInnerHTML={{
                        __html: _(
                            "Here you can test your internet connection. This test is also useful when you need to check that your DNS resolving works as expected. Remember to click on the <b>Save button</b> if you changed your forwarder setting."
                        ),
                    }}
                />
                <ConnectionTest ws={ws} type="dns" />
            </div>
        </>
    );
}

function validator(formData) {
    const error = {};
    if (formData.dns_from_dhcp_enabled) {
        error.dns_from_dhcp_domain = validateHostname(
            formData.dns_from_dhcp_domain
        );
    }
    return error.dns_from_dhcp_domain ? error : undefined;
}

function prepData(formData) {
    if (formData.forwarder === "") formData.forwarder = PROVIDER_FORWARDER;
    return formData;
}

function prepDataToSubmit(formData) {
    delete formData.available_forwarders;
    if (!formData.forwarding_enabled) delete formData.forwarder;
    else if (formData.forwarder === PROVIDER_FORWARDER) formData.forwarder = "";
    return formData;
}
