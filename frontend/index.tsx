import { Millennium, sleep } from '@steambrew/client';
import { initCdn } from './cdn';
import { CreateCssElement, InitHooks, mainDocument } from './hooks';
import { WindowHook } from './WindowHook';

InitHooks();

// Entry point on the front end of your plugin
export default async function PluginMain() {
    await initCdn();
    
    while (!mainDocument()) {
        await sleep(500);
    }

    Millennium.AddWindowCreateHook(WindowHook)

    await CreateCssElement(mainDocument());
}
