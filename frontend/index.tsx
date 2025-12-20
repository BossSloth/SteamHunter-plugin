import { installCreateElementPatches } from './createElementOverride';
import { initHltbInjection } from './hltb/HltbInjection';

// Entry point on the front end of your plugin
export default async function PluginMain(): Promise<void> {
  await App.WaitForServicesInitialized();

  installCreateElementPatches();

  initHltbInjection();
}
