import React from 'react';
import { findClass, findModuleByExport, findModuleExport, IconsModule, sleep } from '@steambrew/client';
import { getCdn, initCdn } from './cdn';
import { AchievementPage } from './components/AchievementPage';
import { ComponentZoo } from './components/ComponentZoo';

declare const SteamUIStore: any;

let mainDocument: Document = null;

// @ts-ignore
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
            {content: <AchievementPage appId={'427410'} />, id: 'achievement-groups', title: 'Achievement Groups'}
        ]);
    }

    // Inject into settings page list
    if (props?.title && props?.pages && props?.fnSetNavigateToPage && props?.className) {
        console.log(type, props, children)

        // Add our own page
        props.pages = props.pages.concat([
            {visible: true, title: 'All components', icon: <IconsModule.Settings />, route: '/settings/components', content: <ComponentZoo />}
        ]);
    }
    return originalCreateElement(type, props, ...children);
}

// Entry point on the front end of your plugin
export default async function PluginMain() {
    await initCdn();
    
    while (!mainDocument) {
        mainDocument = SteamUIStore?.WindowStore?.SteamUIWindows?.[0]?.m_BrowserWindow?.document;
        await sleep(500);
    }

    let cssContent = await fetch(getCdn('/achievements.css')).then(r => r.text());
    
    let steamClassNames = [...cssContent.matchAll(/\.__(\w+)__/g)];
    steamClassNames.forEach(className => {
        const realClassName = findClass(className[1]) as string;
        cssContent = cssContent.replaceAll(className[0], `.${realClassName}`);
    });

    const cssElement = mainDocument.createElement('style');
    cssElement.innerHTML = cssContent;
    mainDocument.head.appendChild(cssElement);
}
