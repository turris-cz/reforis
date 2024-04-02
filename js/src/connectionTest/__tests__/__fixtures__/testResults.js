/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const RESULTS = {
    ok: "OK",
    failed: "FAILED",
    unknown: "UNKNOWN",
};

export default function wsTestResultMessage(testId, type, result) {
    console.log(result);
    return {
        module: "wan",
        action: "connection_test_finished",
        data: {
            passed: true,
            test_id: testId,
            data: testResults(type, result),
        },
    };
}

function testResults(type, result) {
    return {
        ipv4: RESULTS[result],
        ipv4_gateway: RESULTS[result],
        ipv6: RESULTS[result],
        ipv6_gateway: RESULTS[result],
        dns: RESULTS.unknown,
        dnssec: RESULTS.unknown,
    };
}
