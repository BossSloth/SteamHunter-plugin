import React, { ReactElement } from 'react';
import { AchievementPage } from './components/AchievementPage';

interface Tab {
  content: ReactElement;
  id: string;
  title: string;
}

export function CreateElementOverride() {
  const originalCreateElement = React.createElement;

  // @ts-ignore
  React.createElement = function (type: any, props: any, ...children: any[]) {
    let tabs = props?.tabs as Tab[];
    if (
      tabs &&
      props?.onShowTab &&
      props?.autoFocusContents !== undefined &&
      tabs.filter((t) => t.id === 'achievements').length > 0 &&
      tabs.filter((t) => t.id === 'achievement-groups').length == 0
    ) {
      const appid = tabs[0].content.props.appid.toString();

      tabs = tabs.concat([
        { content: <AchievementPage appId={appid} />, id: 'achievement-groups', title: 'Achievement Groups' },
      ]);

      props.tabs = tabs;
    }

    return originalCreateElement(type, props, ...children);
  };
}
