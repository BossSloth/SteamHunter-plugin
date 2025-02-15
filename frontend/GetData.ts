import { callable } from "@steambrew/client";
import { AchievementGroupData, RequestAchievementGroupsResponse, AchievementData, SteamGameInfo, AchievementUpdateData } from "./components/types";
import { AppCache, getCachedData, setCachedData } from './utils/cache';

interface ResponseError {
    error?: string;
}

type ApiResponse<T> = T & ResponseError;

const API = {
    groups: callable<[{appId: string}], string>('RequestAchievementGroups'),
    achievements: callable<[{appId: string}], string>('RequestAchievements'),
    gameInfo: callable<[{appId: string}], string>('RequestSteamGameInfo'),
    updates: callable<[{appId: string}], string>('RequestAchievementUpdates'),
};

function decodeUtf8(binaryString: string) {
    const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
}

function handleTimeoutError(error: string, context: string): never {
    if (error.includes('timed out')) {
        throw new Error(`Timed out getting ${context}. Check if website is up. ${error}`);
    }
    throw new Error(error);
}

async function fetchAndCache<T>(
    appId: string,
    callable: ({appId}: {appId: string}) => Promise<string>,
    cacheKey: keyof AppCache,
): Promise<T> {
    const cachedData = getCachedData<T>(appId, cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const response = JSON.parse(decodeUtf8(await callable({ appId }))) as ApiResponse<T>;
    
    if (!response) {
        throw new Error(`Invalid ${cacheKey} response: ${JSON.stringify(response)}`);
    }

    if (response.error) {
        handleTimeoutError(response.error, cacheKey);
    }

    setCachedData(appId, cacheKey, response);
    return response;
}

export async function getGroups(appId: string): Promise<AchievementGroupData[] | null> {
    return fetchAndCache<RequestAchievementGroupsResponse>(
        appId,
        API.groups,
        'groups',
    ).then(response => response.groups);
}

export async function getAchievements(appId: string): Promise<AchievementData[] | null> {
    return fetchAndCache<AchievementData[]>(
        appId,
        API.achievements,
        'achievements',
    );
}

export async function getSteamGameInfo(appId: string): Promise<SteamGameInfo | null> {
    return fetchAndCache<SteamGameInfo>(
        appId,
        API.gameInfo,
        'gameInfo',
    );
}

export async function getAchievementUpdates(appId: string): Promise<AchievementUpdateData[] | null> {
    return fetchAndCache<AchievementUpdateData[]>(
        appId,
        API.updates,
        'updates',
    );
}