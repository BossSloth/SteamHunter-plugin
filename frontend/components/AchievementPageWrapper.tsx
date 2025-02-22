import { findClass, Spinner } from "@steambrew/client";
import React from "react";
import { AchievementPage } from "./AchievementPage";
import { ErrorDisplay } from "./ErrorDisplay";

declare const SteamUIStore: any;
let mainDocument: () => Document = () => SteamUIStore?.WindowStore?.SteamUIWindows?.find((window: any) => !window?.m_BrowserWindow?.SteamClient?.Overlay)?.m_BrowserWindow?.document;

export const AchievementPageWrapper: React.FC<{isOverlay: boolean}> = ({isOverlay}) => {
    const [appId, setAppId] = React.useState<string | null>(null);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        const fetchAppId = async () => {
            try {
                if (isOverlay) {
                    const overlayInfo = await SteamClient.Overlay.GetOverlayBrowserInfo() as OverlayBrowserInfo[];
                    if (overlayInfo.length > 1) {
                        throw new Error('Multiple steam overlays detected. Unable to determine the correct app ID.\n\nNote: This error occurs when more than one game is open simultaneously, which is not supported. If you only have one game open, please report this issue with details about your current setup.');
                    }
                    if (overlayInfo.length == 0) {
                        throw new Error('No steam overlay open? Unable to determine the correct app ID.');
                    }
                    setAppId(overlayInfo[0].appID.toString());
                } else {
                    // await CreateCssElement(mainDocument());
                    const achievementsPageContainer = mainDocument().querySelector(`.${findClass('AchievementsPageContainer')}`) as HTMLDivElement|null;
                    if (!achievementsPageContainer) {
                        throw new Error(`Could not find element with class ${findClass('AchievementsPageContainer')} to get app ID`);
                    }
                
                    const achievementFiberKey = Object.keys(achievementsPageContainer).find(key => key.startsWith('__reactProps$'));
                    if (!achievementFiberKey) {
                        throw new Error('Could not find React props on achievements container');
                    }
                    
                    //@ts-ignore
                    const appIdFromProps = achievementsPageContainer[achievementFiberKey].children[0].props.appid;
                    setAppId(appIdFromProps.toString());
                }
            } catch (err) {
                console.error('Error fetching app ID:', err);
                setError(err as Error);
            }
        };

        fetchAppId();
    }, [isOverlay]);

    if (error) {
        return <ErrorDisplay errors={[error]} />;
    }

    if (!appId) {
        return <div className="steam-hunters-achievements-page"><Spinner className='steam-hunters-spinner' /></div>
    }

    return <AchievementPage appId={appId} />;
}

interface OverlayBrowserInfo {
    /*
    {
        "unPID": 38760,
        "nBrowserID": 4128783,
        "nScreenWidth": 2048,
        "nScreenHeight": 1152,
        "eBrowserType": 0,
        "appID": 427410,
        "gameID": "427410",
        "flDisplayScale": 1.25,
        "eUIMode": 7
    }
    */
   unPID: number,
   nBrowserID: number,
   nScreenWidth: number,
   nScreenHeight: number,
   eBrowserType: number,
   appID: number,
   gameID: string,
   flDisplayScale: number,
   eUIMode: number
}