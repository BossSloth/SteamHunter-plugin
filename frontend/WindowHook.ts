import { SteamClient } from "@steambrew/client";
import { CreateCssElement } from "./cdn";

declare const g_PopupManager: {
    m_mapPopups: {
        data_: Popup[];
    }
};

interface Popup {
    value_: {
        m_strName: string,
        m_popup: Window,
    }
}

declare global {
    interface Window {
        SteamClient: SteamClient;
        steamHuntersAppId?: string;
    }
}

const hookedWindows = [
    'Achievements_',
    'BPM_',
    'Desktop_uid',
];

export function WindowHook() {
    g_PopupManager?.m_mapPopups?.data_?.forEach(async (popup) => {
        let popupName = popup.value_.m_strName;
        if (hookedWindows.some((windowName) => popupName.includes(windowName))) {
            const popupWindow = popup.value_.m_popup;
            const document = popupWindow.document;
            CreateCssElement(document);
        }
    });
}