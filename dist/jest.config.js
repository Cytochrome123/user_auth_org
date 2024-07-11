"use strict";
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    "testTimeout": 10000 // Timeout in milliseconds (10 seconds)
};
