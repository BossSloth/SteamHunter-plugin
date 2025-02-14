import { callable } from "@steambrew/client";
import { AchievementGroupData, RequestAchievementGroupsResponse, AchievementData, SteamGameInfo, AchievementUpdateData } from "./components/types";

const RequestAchievementGroups = callable<[{appId: string}], string>('RequestAchievementGroups');
const RequestAchievements = callable<[{appId: string}], string>('RequestAchievements');
const RequestSteamGameInfo = callable<[{appId: string}], string>('RequestSteamGameInfo');
const RequestAchievementUpdates = callable<[{appId: string}], string>('RequestAchievementUpdates');

export async function getGroups(appId: string): Promise<AchievementGroupData[] | null> {
    const response = JSON.parse(await RequestAchievementGroups({ appId })) as RequestAchievementGroupsResponse;
    if (!response) {
        throw new Error('Invalid group response: ' + JSON.stringify(response));
    }
    // @ts-ignore
    if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
    }

    return response.groups;
}

export async function getAchievements(appId: string): Promise<AchievementData[] | null> {
    const response = JSON.parse(await RequestAchievements({ appId })) as AchievementData[];
    if (!response) {
        throw new Error('Invalid achievements response: ' + JSON.stringify(response));
    }
    // @ts-ignore
    if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
    }

    return response;
}

export async function getSteamGameInfo(appId: string): Promise<SteamGameInfo | null> {
    const response = JSON.parse(await RequestSteamGameInfo({ appId })) as SteamGameInfo;
    if (!response) {
        throw new Error('Invalid game info response: ' + JSON.stringify(response));
    }
    // @ts-ignore
    if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
    }

    return response;
}

export async function getAchievementUpdates(appId: string): Promise<AchievementUpdateData[] | null> {
    const response = JSON.parse(await RequestAchievementUpdates({ appId })) as AchievementUpdateData[];
    if (!response) {
        throw new Error('Invalid achievement updates response: ' + JSON.stringify(response));
    }
    // @ts-ignore
    if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
    }

    return response;
}
