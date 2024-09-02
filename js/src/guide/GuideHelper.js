/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import { HELP_CONTENT } from "./constants";
import GuideControls from "./GuideControls/GuideControls";

GuideHelper.propTypes = {
    ws: PropTypes.object.isRequired,
    workflow: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    next_step: PropTypes.string.isRequired,
    completed: PropTypes.bool,
};

GuideHelper.defaultProps = {
    completed: false,
};

export default function GuideHelper({
    ws,
    workflow,
    step,
    next_step,
    completed,
}) {
    const stepContent = HELP_CONTENT[workflow][step];
    if (!stepContent) {
        return null;
    }

    const isCompletedVisible =
        stepContent && completed && stepContent.completed;
    if (!(stepContent.initial || isCompletedVisible)) {
        return null;
    }

    return (
        <div className="d-flex flex-column flex-sm-row justify-content-center p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 mb-4">
            <div className="flex-fill d-flex flex-column justify-content-center align-items-sm-center text-center mb-2 mb-sm-0 me-0 me-sm-3">
                {stepContent.initial && (
                    <ParagraphsArray content={stepContent.initial} />
                )}
                {isCompletedVisible && (
                    <p
                        className={`fw-bold mb-sm-3 mb-md-0 ${stepContent.initial ? "mt-2" : ""}`.trim()}
                    >
                        {stepContent.completed}
                    </p>
                )}
            </div>
            <GuideControls ws={ws} next_step={next_step} />
        </div>
    );
}

ParagraphsArray.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
};

function ParagraphsArray({ content }) {
    return Array.isArray(content) ? (
        // eslint-disable-next-line react/no-array-index-key
        content.map((line, index) => (
            <p
                className={`mb-${index === content.length - 1 ? 2 : 0}`}
                key={line.length}
                dangerouslySetInnerHTML={{ __html: line }}
            />
        ))
    ) : (
        <p className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />
    );
}
