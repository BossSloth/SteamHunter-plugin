import { Millennium } from '@steambrew/client';
import { initCdn } from './cdn';
import { installCreateElementPatches } from './createElementOverride';
import { WindowHook } from './WindowHook';

// Entry point on the front end of your plugin
export default async function PluginMain(): Promise<void> {
  await initCdn();
  await App.WaitForServicesInitialized();

  installCreateElementPatches();

  if (Millennium.AddWindowCreateHook) {
    Millennium.AddWindowCreateHook(WindowHook);
  }
}
