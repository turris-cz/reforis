/*
 * Copyright (C) 2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useCallback,
    useMemo,
} from "react";

import { ForisURLs } from "foris";
import PropTypes from "prop-types";

const ThemeContext = createContext({
    theme: "auto",
    setTheme: () => {},
});

export const ThemeProvider = ThemeContext.Provider;

ThemeContextProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export function ThemeContextProvider({ children }) {
    const [theme, setTheme] = useState("auto");

    // Function to apply the theme to the document
    const applyTheme = useCallback((selectedTheme) => {
        document.documentElement.setAttribute("data-bs-theme", selectedTheme);
    }, []);

    // Function to handle favicon change based on the theme
    const handleFaviconChange = useCallback((currentTheme) => {
        const favicon = document.getElementById("favicon");
        if (favicon) {
            favicon.setAttribute(
                "href",
                `${ForisURLs.static}/imgs/favicon-${currentTheme === "dark" ? "white" : "black"}.png`
            );
        }
    }, []);

    // Initialize theme based on localStorage and media query
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const initializeTheme = () => {
            const savedTheme = localStorage.getItem("theme") || "auto";
            setTheme(savedTheme);
            applyTheme(savedTheme);
            handleFaviconChange(mediaQuery.matches ? "dark" : "light");
        };

        initializeTheme();

        const handleMediaChange = (event) => {
            if (theme === "auto") {
                const newTheme = event.matches ? "dark" : "light";
                handleFaviconChange(newTheme);
                applyTheme(newTheme);
            }
        };

        const handleStorageChange = () => {
            const savedTheme = localStorage.getItem("theme") || "auto";
            setTheme(savedTheme);
            applyTheme(savedTheme);
        };

        mediaQuery.addEventListener("change", handleMediaChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [applyTheme, handleFaviconChange, theme]);

    // Apply the selected theme on change
    useEffect(() => {
        if (theme === "auto") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            applyTheme(prefersDark ? "dark" : "light");
        } else {
            applyTheme(theme);
        }
    }, [theme, applyTheme]);

    // Handle theme change and save it to localStorage
    const handleThemeChange = useCallback(
        (newTheme) => {
            setTheme(newTheme);
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        },
        [applyTheme]
    );

    const contextValue = useMemo(
        () => ({
            theme,
            setTheme: handleThemeChange,
        }),
        [theme, handleThemeChange]
    );

    return <ThemeProvider value={contextValue}>{children}</ThemeProvider>;
}

export function useThemeContext() {
    return useContext(ThemeContext);
}
