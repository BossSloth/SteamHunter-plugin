import { SteamClient } from "@steambrew/client";
import { CreateCssElement } from "./hooks";

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

export function WindowHook() {
    g_PopupManager?.m_mapPopups?.data_?.forEach(async (popup) => {
        if (popup.value_.m_strName.includes('Achievements_')) {
            const popupWindow = popup.value_.m_popup;
            const document = popupWindow.document;
            CreateCssElement(document);
        }
    });
}