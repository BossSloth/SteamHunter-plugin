import { beforePatch, findModuleByExport, Patch } from '@steambrew/client';
import React, { ReactElement } from 'react';
import { AchievementPage } from './components/AchievementPage';

interface Tab {
  content: ReactElement<{ appid: number; }>;
  id: string;
  title: string;
}

interface Props {
  onShowTab(tabId: string): void;
  activeTab: string;
  autoFocusContents: boolean;
  firstOpen?: boolean;
  tabs: Tab[];
}

type JsxArgs = [type: unknown, props: Record<string, unknown> | null, key?: unknown];

type PatchHandler = (context: {
  readonly type: JsxArgs[0];
  readonly props: JsxArgs[1];
  readonly children: unknown;
}) => void;

interface JsxRuntimeModule {
  jsx(...args: JsxArgs): unknown;
  jsxs(...args: JsxArgs): unknown;
  Fragment: unknown;
}

/**
 * Patches the `react/jsx-runtime` module (webpack module 3326, re-exported by
 * 62540) which is what modern Steam UI uses to create React elements instead
 * of `React.createElement`. Both `jsx` and `jsxs` on that module are plain
 * writable data properties (not webpack getters), so `beforePatch` works on
 * them directly.
 */
export function patchCreateElement(options: {
  readonly name: string;
  readonly onBeforeCreate: PatchHandler;
}): void {
  const { name, onBeforeCreate } = options;

  const found = findModuleByExport((e, key) =>
    (key === 'jsx' || key === 'jsxs') && typeof e === 'function') as JsxRuntimeModule | undefined;

  if (!found || typeof found.jsx !== 'function' || typeof found.jsxs !== 'function') {
    console.error(`[${name}] Could not find react/jsx-runtime module`);

    return;
  }
  const runtime: JsxRuntimeModule = found;

  const versions = ['jsx', 'jsxs'] as const;

  type versionsType = typeof versions[number];

  const patches = new Map<versionsType, { patch: Patch | undefined; last: unknown; }>();

  function applyPatch(prop: versionsType): void {
    try {
      const entry = patches.get(prop) ?? { patch: undefined, last: undefined };
      entry.last = runtime[prop];
      entry.patch = beforePatch(runtime, prop, (args: JsxArgs) => {
        const [type, props] = args;
        try {
          onBeforeCreate({ type, props, children: props?.children });
        } catch (err) {
          // Never let handler exceptions break React rendering
          console.error(`[${name}] onBeforeCreate error`, err);
        }
      });
      patches.set(prop, entry);
      console.debug(`[${name}] Patched react/jsx-runtime.${prop}`);
    } catch (err) {
      console.error(`[${name}] Failed to patch ${prop}`, err);
    }
  }

  applyPatch('jsx');
  applyPatch('jsxs');

  setInterval(() => {
    // If a property reference changed or the patch disappeared, re-apply.
    // observed to happen occasionally on first game launch of a session.
    for (const prop of versions) {
      const entry = patches.get(prop);
      if (entry?.patch === undefined || runtime[prop] === entry.last) {
        console.debug(`[${name}] Detected unpatch/swap on ${prop}, re-patching`);
        applyPatch(prop);
      }
    }
  }, 1000);
}

// Set of appids that have opened the achievement groups tab
const hasOpened = new Set<string>();

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

    tabs.push({
      content: <AchievementPage key={`achievement-groups-${appid}`} appId={appid} />,
      id: 'achievement-groups',
      title: 'Achievement Groups',
    });

    props.tabs = tabs;
    if (!hasOpened.has(appid)) {
      props.onShowTab('achievement-groups');
      hasOpened.add(appid);
    }
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
