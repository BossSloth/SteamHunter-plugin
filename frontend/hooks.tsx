import React from 'react';
import { findClass, IconsModule } from '@steambrew/client';
import { AchievementPage } from './components/AchievementPage';
import { ComponentZoo } from './components/ComponentZoo';

declare const SteamUIStore: any;

export let mainDocument: () => Document = () => SteamUIStore?.WindowStore?.SteamUIWindows?.[0]?.m_BrowserWindow?.document;

export function InitHooks() {
    const originalCreateElement = React.createElement
    // @ts-ignore
    React.createElement = function (type: any, props: any, ...children: any[]) {
        if (
            props?.tabs
            && props?.onShowTab
            && props?.autoFocusContents !== undefined
            && props.tabs.filter((t: any) => t.id === 'achievement-groups').length == 0
        ) {
            console.log(type, props, children)

            props.tabs = props.tabs.concat([
                {content: <AchievementPageWrapper />, id: 'achievement-groups', title: 'Achievement Groups'}
            ]);
        }

        // Inject into settings page list
        if (props?.title && props?.pages && props?.fnSetNavigateToPage && props?.className) {
            console.log(type, props, children)

            props.pages = props.pages.concat([
                {visible: true, title: 'All components', icon: <IconsModule.Settings />, route: '/settings/components', content: <ComponentZoo />}
            ]);
        }
        return originalCreateElement(type, props, ...children);
    }
}

const AchievementPageWrapper: React.FC = () => {
    const appIdClass = `.${findClass('AchievementsPageContainer')} img`;
    const appIdImage = mainDocument().querySelector(appIdClass) as HTMLImageElement|null;
    if (!appIdImage) {
        const errorMessage = `Could not find element with class ${appIdClass} to get app ID`;
        console.error(errorMessage);
        return <span className='achievement-page-error'>{errorMessage}</span>
    };

    const appId = appIdImage.src.match(/\/assets\/(\d+)\//)[1];

    return <AchievementPage appId={appId} />;
}