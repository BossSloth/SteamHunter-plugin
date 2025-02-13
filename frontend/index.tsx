import { findClass, sleep } from '@steambrew/client';
import { getCdn, initCdn } from './cdn';
import { InitHooks } from './hooks';

declare const SteamUIStore: any;

export let mainDocument: Document = null;

InitHooks();

async function CreateCssElement() {
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

// Entry point on the front end of your plugin
export default async function PluginMain() {
    await initCdn();
    
    while (!mainDocument) {
        mainDocument = SteamUIStore?.WindowStore?.SteamUIWindows?.[0]?.m_BrowserWindow?.document;
        await sleep(500);
    }

    await CreateCssElement();
}
