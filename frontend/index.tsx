import { definePlugin, IconsModule } from '@steambrew/client';
import React from 'react';
import { SettingsContent } from 'SettingsContent';
import { installCreateElementPatches } from './createElementOverride';
import { initHltbInjection } from './hltb/HltbInjection';

export default definePlugin(async () => {
  await App.WaitForServicesInitialized();

  installCreateElementPatches();

  initHltbInjection();

  return {
    title: 'Achievement Groups',
    icon: <IconsModule.Settings />,
    content: <SettingsContent />,
  };
});
