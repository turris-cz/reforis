/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Button } from "foris";

import useGuideFinish from "../hooks";

export default function GuideFinished() {
    const onGuideFinishHandler = useGuideFinish();

    return (
        <>
            <h1>{_("Guide Finished")}</h1>
            <p>
                {_(
                    "Once you leave this guide you'll be granted access to the full configuration interface of this device."
                )}
            </p>
            <p>
                {_(
                    "To further improve your security consider installing data collection plugin (via Package Management). This will allow you to be part of our security research to discover new attackers and give you access to dynamic firewall updates blocking known attackers."
                )}
            </p>
            <div className="text-right">
                <Button forisFormSize onClick={onGuideFinishHandler}>
                    {_("Continue")}
                </Button>
            </div>
        </>
    );
}
