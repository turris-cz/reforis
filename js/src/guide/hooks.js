/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";

import { useAPIPost, REFORIS_URL_PREFIX, API_STATE } from "foris";
import API_URLs from "common/API";

export default function useGuideFinish() {
    const [finishGuidePostData, finishGuidePost] = useAPIPost(API_URLs.finishGuide);

    useEffect(() => {
        if (finishGuidePostData.state === API_STATE.SUCCESS) window.location.assign(`${REFORIS_URL_PREFIX}/`);
    }, [finishGuidePostData]);

    function onGuideFinishHandler(e) {
        e.persist();
        finishGuidePost();
    }

    return onGuideFinishHandler;
}
