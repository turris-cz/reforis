module.exports = {
    extends: ["eslint-config-reforis", "prettier", "plugin:import/recommended"],
    plugins: ["prettier", "import"],
    rules: {
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    ["parent", "sibling"],
                ],
                pathGroups: [
                    {
                        pattern: "react",
                        group: "external",
                        position: "before",
                    },
                ],
                pathGroupsExcludedImportTypes: ["react"],
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            },
        ],
        "prettier/prettier": ["error"],
    },
};
