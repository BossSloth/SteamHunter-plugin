import { definePlugin, IconsModule } from '@steambrew/client';
import React from 'react';
import { SettingsContent } from 'SettingsContent';
import { installCreateElementPatches } from './createElementOverride';
import { initHltbInjection } from './hltb/HltbInjection';

export default definePlugin(async () => {
  await App.WaitForServicesInitialized();

  installCreateElementPatches();

  initHltbInjection();

  const { Settings } = IconsModule as {
    readonly Settings: React.ComponentType;
  };

  return {
    title: 'Achievement Groups',
    icon: <Settings />,
    content: <SettingsContent />,
  };
});
