/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => ({
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "[name].min.js",
        path: path.join(__dirname, "../reforis_static/reforis/js"),
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "./src"),
            path.resolve(__dirname, "./node_modules"),
        ],
        fallback: {
            buffer: require.resolve("buffer/"),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // Since "foris" is not transpiled we shouldn't ignore it.
                exclude: /node_modules\/(?!foris)/,
                loader: "babel-loader",
            },
            {
                test: require.resolve("prop-types"),
                loader: "expose-loader",
                options: {
                    exposes: "PropTypes",
                },
            },
            {
                test: require.resolve("react"),
                loader: "expose-loader",
                options: {
                    exposes: "React",
                },
            },
            {
                test: require.resolve("react-dom"),
                loader: "expose-loader",
                options: {
                    exposes: "ReactDOM",
                },
            },
            {
                // Using different instances of library in reForis and foris JS (and plugins) cause
                // a bug about "using react-router components outside <Router/>". So we expose it to
                // use same instance of ReactRouterDOM everywhere.
                test: require.resolve("react-router-dom"),
                loader: "expose-loader",
                options: {
                    exposes: "ReactRouterDOM",
                },
            },
            {
                test: require.resolve("pdfmake/build/pdfmake"),
                loader: "expose-loader",
                options: {
                    exposes: "pdfMake",
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "string-replace-loader",
                        options: {
                            // Remove usage external resources to sure we are not using any of them.
                            search: '@import url\\("https?://(.*)\\);',
                            replace: "",
                            flags: "i",
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                sideEffects: true,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        pure_funcs: [
                            "console.log",
                            "console.info",
                            "console.debug",
                        ],
                    },
                    mangle: false,
                },
            }),
            new CssMinimizerPlugin(),
        ],
        // Workaround to get ReactRouterDOM to be exposed. Otherwise, it's excluded as unused
        // imports as it's flagged as a module without side effects.
        sideEffects: false,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
        new webpack.DefinePlugin({
            "process.env.LIGHTTPD": JSON.stringify(env.lighttpd),
            // Sets path to websocket in lighttpd mode
            "process.env.WSPATH": JSON.stringify(process.env.WSPATH || ""),
        }),
        new MiniCssExtractPlugin({
            filename: "../css/[name].css",
        }),
    ],
});
