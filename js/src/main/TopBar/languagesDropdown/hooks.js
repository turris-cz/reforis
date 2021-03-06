/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";

import { useAPIGet } from "foris";

import API_URLs from "common/API";

export function useLanguages() {
    const [languageState, getLanguage] = useAPIGet(API_URLs.language);
    const [languagesState, getLanguages] = useAPIGet(API_URLs.languages);

    useEffect(() => {
        getLanguage();
        getLanguages();
    }, [getLanguage, getLanguages]);

    return [languageState.data, languagesState.data];
}

export function useWSSetLanguageRefresh(ws) {
    useEffect(() => {
        const module = "web";
        ws.subscribe(module).bind(module, "set_language", () =>
            window.location.reload()
        );
    }, [ws]);
}
