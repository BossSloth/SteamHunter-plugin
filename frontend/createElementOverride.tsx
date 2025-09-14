import { beforePatch, Patch } from '@steambrew/client';
import React, { ReactElement } from 'react';
import { AchievementPage } from './components/AchievementPage';

interface Tab {
  content: ReactElement<{ appid: number; }>;
  id: string;
  title: string;
}

interface Props {
  onShowTab(tabId: string): void;
  autoFocusContents: boolean;
  tabs: Tab[];
}

type CreateElementArgs = Parameters<typeof React.createElement>;

type PatchHandler = (context: {
  readonly type: CreateElementArgs[0];
  readonly props: CreateElementArgs[1];
  readonly children: CreateElementArgs[2];
}) => void;

export function patchCreateElement(options: {
  readonly name: string;
  readonly onBeforeCreate: PatchHandler;
}): void {
  const { name, onBeforeCreate } = options;

  let currentPatch: Patch | undefined;
  let lastPatchedCreateElement: typeof React.createElement | undefined;

  function applyPatch(): void {
    try {
      lastPatchedCreateElement = React.createElement;
      currentPatch = beforePatch(React, 'createElement', (args: CreateElementArgs) => {
        const [type, props, ...children] = args;
        try {
          onBeforeCreate({ type, props, children });
        } catch (err) {
          // Never let handler exceptions break React rendering
          console.error(`[${name}] onBeforeCreate error`, err);
        }
      });
      console.debug(`[${name}] Patched React.createElement`);
    } catch (err) {
      console.error(`[${name}] Failed to patch React.createElement`, err);
    }
  }

  applyPatch();

  setInterval(() => {
    // If React.createElement reference changed or patch disappeared, re-apply.
    // This seems to happen when launching game for the first time since launch.
    if (!currentPatch || React.createElement === lastPatchedCreateElement) {
      console.debug(`[${name}] Detected unpatch/swap, re-patching`);
      applyPatch();
    }
  }, 1000);
}

function addAchievementGroupsTab(props: Partial<Props> | null): void {
  if (!props) return;

  const tabs = props.tabs;
  if (
    tabs
    && props.onShowTab
    && props.autoFocusContents !== undefined
    && tabs.some(t => t.id === 'achievements')
    && !tabs.some(t => t.id === 'achievement-groups')
  ) {
    if (!tabs[0]) throw new Error('Missing tabs?');

    const appid = String(tabs[0].content.props.appid);

    tabs.push({ content: <AchievementPage appId={appid} />, id: 'achievement-groups', title: 'Achievement Groups' });

    props.tabs = tabs;
  }
}

export function installCreateElementPatches(): void {
  patchCreateElement({
    name: 'SteamHunter/AchievementGroupsTab',
    onBeforeCreate: ({ props }) => {
      addAchievementGroupsTab(props as Partial<Props> | null);
    },
  });
}
