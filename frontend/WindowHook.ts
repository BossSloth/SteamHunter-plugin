/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { CreateCssElement } from './cdn';

declare const g_PopupManager: {
  m_mapPopups: {
    data_: Popup[];
  };
};

interface Popup {
  value_: {
    m_strName: string;
    m_popup: Window;
  };
}

declare global {
  interface Window {
    steamHuntersAppId?: string;
  }
}

// prettier-ignore
const hookedWindows = [
  'Achievements_',
  'BPM_',
  'Desktop_uid',
];

export function WindowHook(): void {
  g_PopupManager.m_mapPopups.data_.forEach((popup) => {
    const popupName = popup.value_.m_strName;
    if (hookedWindows.some(windowName => popupName.includes(windowName))) {
      const popupWindow = popup.value_.m_popup;
      const document = popupWindow.document;
      CreateCssElement(document);
    }
  });
}
