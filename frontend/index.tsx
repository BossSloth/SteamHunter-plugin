import { Millennium, sleep } from '@steambrew/client';
import { initCdn } from './cdn';
import { WindowHook } from './WindowHook';
import { CreateElementOverride } from './createElementOverride';

CreateElementOverride();

// Entry point on the front end of your plugin
export default async function PluginMain() {
    await initCdn();

    Millennium.AddWindowCreateHook(WindowHook)
}
