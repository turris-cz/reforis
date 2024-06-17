/*
 * Copyright (C) 2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext({
    theme: "auto",
    setTheme: () => {},
});

export const ThemeProvider = ThemeContext.Provider;

ThemeProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

function ThemeContextProvider({ children }) {
    const [theme, setTheme] = useState("auto");

    // Initialize theme based on localStorage and media query
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "auto";
        setTheme(savedTheme);
        applyTheme(savedTheme);

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleMediaChange = (e) => {
            if (theme === "auto") {
                applyTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleMediaChange);
        return () =>
            mediaQuery.removeEventListener("change", handleMediaChange);
    }, [theme]);

    // Apply the selected theme
    useEffect(() => {
        if (theme === "auto") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            applyTheme(prefersDark ? "dark" : "light");
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    // Apply theme to the document
    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-bs-theme", theme);
    };

    // Handle theme change and save to localStorage
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const contextValue = {
        theme,
        setTheme: handleThemeChange,
    };

    return <ThemeProvider value={contextValue}>{children}</ThemeProvider>;
}

function useThemeContext() {
    return useContext(ThemeContext);
}

export { ThemeContextProvider, useThemeContext };
