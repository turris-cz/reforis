import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SentinelDescription() {
    return (
        <>
            <p>
                {_(
                    "Turris Sentinel is an advanced security system designed to protect your router and network from cyber threats. It continuously monitors and analyzes reports from Turris devices worldwide to detect and block attackers in real time. Sentinel is made up of several key components, including "
                )}
                <a
                    href="https://docs.turris.cz/basics/sentinel/threat-detection/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {_("Threat Detection")}
                    <sup>
                        <FontAwesomeIcon
                            icon="fa-solid fa-external-link-alt"
                            className="fa-sm ms-1"
                        />
                    </sup>
                </a>
                {_(
                    ", which utilizes minimal honeypots and firewall logging, the "
                )}
                <a
                    href="https://docs.turris.cz/basics/sentinel/dynfw/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {_("Dynamic Firewall (DynFW)")}
                    <sup>
                        <FontAwesomeIcon
                            icon="fa-solid fa-external-link-alt"
                            className="fa-sm ms-1"
                        />
                    </sup>
                </a>
                {_(
                    "for real-time threat prevention, and a centralized database that tracks and identifies potential attackers."
                )}
            </p>
            <p>
                {_(
                    "By enabling Sentinel, you contribute to a global security network that helps protect not only your own device but also other users. You can explore real-time security insights and attack statistics on "
                )}
                <a
                    href="https://view.sentinel.turris.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {_("Sentinel View")}
                    <sup>
                        <FontAwesomeIcon
                            icon="fa-solid fa-external-link-alt"
                            className="fa-sm ms-1"
                        />
                    </sup>
                </a>
                .
                {_(
                    " For a detailed overview of how Sentinel works, visit the "
                )}
                <a
                    href="https://docs.turris.cz/basics/sentinel/intro/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {_("Sentinel documentation")}
                    <sup>
                        <FontAwesomeIcon
                            icon="fa-solid fa-external-link-alt"
                            className="fa-sm ms-1"
                        />
                    </sup>
                </a>
                .
            </p>
        </>
    );
}

export default SentinelDescription;
