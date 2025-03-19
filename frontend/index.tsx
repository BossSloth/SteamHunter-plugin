import { Millennium } from '@steambrew/client';
import { initCdn } from './cdn';
import { CreateElementOverride } from './createElementOverride';
import { WindowHook } from './WindowHook';

CreateElementOverride();

// Entry point on the front end of your plugin
export default async function PluginMain(): Promise<void> {
  await initCdn();

  if (Millennium.AddWindowCreateHook) {
    Millennium.AddWindowCreateHook(WindowHook);
  }
}
