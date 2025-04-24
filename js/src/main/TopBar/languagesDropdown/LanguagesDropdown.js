/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpinnerElement, useAPIPost, ForisURLs } from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import API_URLs from "common/API";
import smallScreenWidth from "utils/constants";

import { useLanguages, useWSSetLanguageRefresh } from "./hooks";

LanguagesDropdown.propTypes = {
    ws: PropTypes.object.isRequired,
    className: PropTypes.string,
};

LanguagesDropdown.defaultProps = {
    className: "",
};

export default function LanguagesDropdown({ ws, className }) {
    const [currentLang, langsList] = useLanguages();
    const [, post] = useAPIPost(API_URLs.language);

    useWSSetLanguageRefresh(ws);

    const sortedLangsList = langsList ? langsList.sort() : [];
    return (
        <div className="dropdown">
            <button
                className={`nav-item btn ${className || "btn-link text-body"} fw-bold text-decoration-none`.trim()}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {currentLang ? (
                    currentLang.toUpperCase()
                ) : (
                    <SpinnerElement className="text-primary" small />
                )}
            </button>

            <ul
                className={`dropdown-menu dropdown-menu-${
                    window.outerWidth > smallScreenWidth ? "end" : "start"
                } shadow-sm`.trim()}
                id="languages-dropdown-menu"
            >
                <div className="dropdown-header">
                    <Link
                        className="text-decoration-none"
                        to={{
                            pathname: ForisURLs.languages,
                        }}
                    >
                        <h5 className="mb-0 text-body">{_("Languages")}</h5>
                    </Link>
                </div>
                <div className="dropdown-divider" />
                {langsList ? (
                    <>
                        {sortedLangsList.map((lang) => (
                            <li key={lang}>
                                <button
                                    key={lang}
                                    type="button"
                                    className={`dropdown-item d-flex align-items-center ${lang === currentLang ? "active fw-bold" : ""}`.trim()}
                                    onClick={() =>
                                        post({ data: { language: lang } })
                                    }
                                >
                                    <span className="me-2">
                                        {mapLangCodeToName()[lang]}
                                    </span>
                                    {lang === currentLang && (
                                        <FontAwesomeIcon
                                            icon="fa-solid fa-check"
                                            className="ms-auto"
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <a
                                className="dropdown-item d-flex align-items-center"
                                href="https://docs.turris.cz/geek/contributing/translation/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {_("Participate in translation")}
                                <sup>
                                    <FontAwesomeIcon
                                        icon="fa-solid fa-external-link-alt"
                                        className="fa-sm ms-1"
                                    />
                                </sup>
                            </a>
                        </li>
                    </>
                ) : (
                    <SpinnerElement small />
                )}
            </ul>
        </div>
    );
}

function mapLangCodeToName() {
    return {
        cs: "Čeština",
        da: "Dansk",
        de: "Deutsch",
        el: "Ελληνικά",
        en: "English",
        es: "Español",
        fi: "Suomi",
        fo: "Føroyskt",
        fr: "Français",
        hr: "Hrvatski",
        hu: "Magyar",
        it: "Italiano",
        ja: "日本語",
        ko: "한국어",
        la: "Latina",
        lt: "Lietuvių",
        nb_NO: "Norsk Bokmål",
        nl: "Nederlands",
        pl: "Polski",
        pt_BR: "Português Brasileiro",
        ro: "Română",
        ru: "Русский",
        sk: "Slovenčina",
        sv: "Svenska",
        ta: "தமிழ்",
        zh_Hant: "繁體中文",
    };
}
