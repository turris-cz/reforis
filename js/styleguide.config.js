/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require("path");

const webpack = require("webpack");

module.exports = {
    title: "reForis JS docs",
    sections: [
        {
            name: "Introduction",
            content: "docs/introduction.md",
        },
        {
            name: "reForis forms components",
            components: [
                "src/lan/LAN.js",
                "src/wan/WAN.js",
                "src/wifi/WiFi.js",
                "src/dns/DNS.js",
                "src/guestNetwork/GuestNetwork.js",
                "src/interfaces/Interfaces.js",
                "src/notificationSettings/NotificationSettings.js",
                "src/packageManagement/packages/Packages.js",
                "src/regionAndTime/RegionAndTime.js",
                "src/packageManagement/updateSettings/UpdateSettings.js",
                "src/packageManagement/updates/Updates.js",
                "src/password/Password.js",
            ],
            exampleMode: "expand",
            usageMode: "expand",
        },
        {
            name: "Top bar components",
            components: [
                "src/languagesDropdown/LanguagesDropdown.js",
                "src/notifications/NotificationsDropdown/NotificationsDropdown.js",
            ],
            exampleMode: "expand",
            usageMode: "expand",
        },
        {
            name: "Router state handlers",
            components: [
                "src/routerStateHandler/RouterStateHandler.js",
                "src/routerStateHandler/NetworkRestartHandler.js",
                "src/routerStateHandler/RebootHandler.js",
            ],
            exampleMode: "expand",
            usageMode: "expand",
        },
        {
            name: "Other reForis components",
            components: [
                "src/overview/Overview.js",
                "src/overview/UpdatesApprovals.js",
                "src/notifications/Notifications/Notifications.js",
                "src/connectionTest/ConnectionTest.js",
                "src/reboot/Reboot.js",
                "src/guide/Guide.js",
            ],
            exampleMode: "expand",
            usageMode: "expand",
        },
    ],
    require: ["./src/docsUtils/setup.js"],
    webpackConfig: {
        resolve: {
            modules: [
                path.resolve(__dirname, "./src"),
                path.resolve(__dirname, "./node_modules"),
            ],
            alias: {
                process: "process/browser",
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!foris)/,
                    loader: "babel-loader",
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    loader: "file-loader",
                },
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: "process/browser",
            }),
        ],
    },
    // Get rid of AssertionError, https://github.com/reactjs/react-docgen/issues/497
    resolver: require("react-docgen").resolver.findAllComponentDefinitions,
};
