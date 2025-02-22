import React from "react";
import { AchievementPageWrapper } from "./components/AchievementPageWrapper";

export function CreateElementOverride() {
    const originalCreateElement = React.createElement;

    // @ts-ignore
    React.createElement = function (type: any, props: any, ...children: any[]) {
        if (
            props?.tabs
            && props?.onShowTab
            && props?.autoFocusContents !== undefined
            && props.tabs.filter((t: any) => t.id === 'achievements').length > 0
            && props.tabs.filter((t: any) => t.id === 'achievement-groups').length == 0
        ) {
            const isOverlay = props.tabs.filter((t: any) => t.id === 'inprogress').length > 0;

            props.tabs = props.tabs.concat([
                {content: <AchievementPageWrapper isOverlay={isOverlay} />, id: 'achievement-groups', title: 'Achievement Groups'}
            ]);
        }

        return originalCreateElement(type, props, ...children);
    }
}