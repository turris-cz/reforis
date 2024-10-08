/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    useAPIPost,
    ForisURLs,
    REFORIS_URL_PREFIX,
    API_STATE,
    useAlert,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import { GUIDE_URL_PREFIX } from "../constants";

const IMG_STATIC_URL = `${ForisURLs.static}/imgs`;

const WORKFLOW_DESCRIPTIONS = {
    bridge: _(
        "This workflow will help you to setup your device to act as a local server. It means that the device will provide some kind of service to other devices within your local network (e.g. act as a network-attached storage)."
    ),
    router: _(
        "After you finish this workflow your device will be able to act as a fully functional router. It assumes that you want to have more or less standard network setup."
    ),
    min: _(
        "Just set your password and you are ready to go. This workflow is aimed to more advanced users who intend to set everything manually."
    ),
};

const WORKFLOW_NAMES = {
    bridge: _("Local Server"),
    router: _("Router"),
    min: _("Minimal"),
};

WorkflowSelect.propTypes = {
    workflows: PropTypes.arrayOf(PropTypes.string).isRequired,
    next_step: PropTypes.string.isRequired,
};

export default function WorkflowSelect({ workflows, next_step }) {
    const [postWorkflowData, postWorkflow] = useAPIPost(API_URLs.guideWorkflow);
    const [setAlert] = useAlert();

    useEffect(() => {
        if (postWorkflowData.state === API_STATE.SUCCESS) {
            window.location.assign(
                `${REFORIS_URL_PREFIX}${GUIDE_URL_PREFIX}/${next_step}`
            );
        } else if (postWorkflowData.state === API_STATE.ERROR) {
            setAlert(_("Cannot set workflow."));
        }
    }, [next_step, postWorkflowData, setAlert]);

    function onWorkflowChangeHandler(workflow) {
        postWorkflow({ data: { workflow } });
    }

    return (
        <>
            <h1>{_("Guide Workflow")}</h1>
            <p>
                {_(
                    "Here you can set the guide walkthrough which will guide you through the basic configuration of your device."
                )}
            </p>
            <div id="workflow-selector" className="card p-4 text-center">
                <div className="row row-cols-3">
                    {workflows.map((workflow) => (
                        <div className="col-12 col-lg-4" key={workflow}>
                            <div className="workflow">
                                <div>
                                    <span className="h3 align-middle">
                                        {WORKFLOW_NAMES[workflow]}
                                    </span>
                                    {workflow === "router" && (
                                        <span className="badge text-bg-success align-middle">
                                            {_("Recommended").toLowerCase()}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        () => onWorkflowChangeHandler(workflow)
                                        /* eslint-disable react/jsx-curly-newline */
                                    }
                                >
                                    <img
                                        className="img-fluid img-logo-black"
                                        src={`${IMG_STATIC_URL}/workflow-${workflow}.svg`}
                                        alt={workflow}
                                    />
                                </button>
                                <p>{WORKFLOW_DESCRIPTIONS[workflow]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
