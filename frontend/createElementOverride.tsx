import React, { ReactElement } from 'react';
import { AchievementPage } from './components/AchievementPage';

interface Tab {
  content: ReactElement<{ appid: number; }>;
  id: string;
  title: string;
}

interface Props {
  onShowTab(tabId: string): void;
  tabs: Tab[];
  autoFocusContents: boolean;
}

export function CreateElementOverride(): void {
  const originalCreateElement = React.createElement;

  // @ts-expect-error type mismatch on function?
  React.createElement = (type: string, props: Partial<Props> | null, ...children: unknown[]): ReactElement => {
    if (!props) return originalCreateElement(type, props, ...children);

    const tabs = props.tabs;
    if (
      tabs
      && props.onShowTab
      && props.autoFocusContents !== undefined
      && tabs.filter(t => t.id === 'achievements').length > 0
      && tabs.filter(t => t.id === 'achievement-groups').length === 0
    ) {
      if (!tabs[0]) throw new Error('Missing tabs?');

      const appid = tabs[0].content.props.appid.toString();

      tabs.push({ content: <AchievementPage appId={appid} />, id: 'achievement-groups', title: 'Achievement Groups' });

      props.tabs = tabs;
    }

    return originalCreateElement(type, props, ...children);
  };
}
