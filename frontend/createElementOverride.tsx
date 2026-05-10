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

type JsxArgs = [type: unknown, props: Partial<Props> | null, key?: unknown];

type PatchHandler = (args: JsxArgs) => void;

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
      entry.patch = beforePatch(runtime, prop, (args) => {
        try {
          onBeforeCreate(args as JsxArgs);
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

function isAchievementsTabContainer(props: Partial<Props> | null): props is Props {
  if (!props) return false;

  return Array.isArray(props.tabs)
    && typeof props.onShowTab === 'function'
    && props.autoFocusContents !== undefined
    && props.tabs.some(t => t.id === 'achievements');
}

function ensureGroupsTab(tabs: Tab[]): void {
  if (tabs.some(t => t.id === 'achievement-groups')) return;
  if (!tabs[0]) throw new Error('Missing tabs?');

  const appid = String(tabs[0].content.props.appid);

  tabs.push({
    content: <AchievementPage key={`achievement-groups-${appid}`} appId={appid} />,
    id: 'achievement-groups',
    title: 'Achievement Groups',
  });
}

/**
 * Stable wrapper component cache, keyed by the original tab container type.
 * Wrapping the type lets React track mount/unmount: `useEffect` with empty
 * deps fires exactly once when the achievements view opens, and never on
 * re-renders (e.g. scrolling). Closing and reopening creates a fresh mount,
 * so it focuses again. The user can still freely switch tabs after the
 * initial focus. The ref ensures we only sync once per mount.
 */
const wrapperCache = new WeakMap<object, React.ComponentType<Props>>();

function getTabContainerWrapper(OriginalType: object): React.ComponentType<Props> {
  let wrapped = wrapperCache.get(OriginalType);
  if (wrapped) return wrapped;

  const Original = OriginalType as React.ComponentType<Props>;
  wrapped = (props: Props): ReactElement => {
    // Steam's parent component owns `activeTab` via useState (default
    // 'achievements'). To avoid a 1-frame flash of the wrong tab, override
    // `activeTab` on the very first render and sync the parent's state in
    // a layout effect. Subsequent renders pass through unchanged so the
    // user can freely switch tabs.
    const syncedRef = React.useRef(false);
    const onShowTabRef = React.useRef(props.onShowTab);
    onShowTabRef.current = props.onShowTab;

    React.useLayoutEffect(() => {
      onShowTabRef.current('achievement-groups');
      syncedRef.current = true;
    }, []);

    const finalProps = syncedRef.current
      ? props
      : ({ ...props, activeTab: 'achievement-groups' });

    return React.createElement(Original, finalProps);
  };
  wrapperCache.set(OriginalType, wrapped);

  return wrapped;
}

function handleAchievementsTabs(args: JsxArgs): void {
  const props = args[1];
  if (!isAchievementsTabContainer(props)) return;

  ensureGroupsTab(props.tabs);

  const type = args[0];
  if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
    args[0] = getTabContainerWrapper(type);
  }
}

export function installCreateElementPatches(): void {
  patchCreateElement({
    name: 'SteamHunter/AchievementGroupsTab',
    onBeforeCreate: handleAchievementsTabs,
  });
}
