import { callable } from '@steambrew/client';
import {
  AchievementData,
  AchievementGroupData,
  RequestAchievementGroupsResponse,
  ScrapedAchievementsResponse,
  SteamGameInfo,
} from './components/types';
import { AppCache, getCachedData, setCachedData } from './utils/cache';
import { BackendScrapedResponse, processScrapedModel } from './utils/scraper';

interface ResponseError {
  error?: string;
}

type ApiResponse<T> = T & ResponseError;

const API = {
  groups: callable<[{ appId: string; }], string>('RequestAchievementGroups'),
  achievements: callable<[{ appId: string; }], string>('RequestAchievements'),
  gameInfo: callable<[{ appId: string; }], string>('RequestSteamGameInfo'),
  updates: callable<[{ appId: string; }], string>('RequestAchievementUpdates'),
  scrapedDetails: callable<[{ appId: string; }], string>('ScrapeAchievementDetails'),
};

function handleTimeoutError(error: string, context: string): never {
  if (error.includes('timed out')) {
    throw new Error(`Timed out getting ${context}. Check if website is up. ${error}`);
  }
  throw new Error(error);
}

async function fetchAndCache<T>(
  appId: string,
  backendCallable: (typeof API)[keyof typeof API],
  cacheKey: keyof AppCache,
): Promise<T> {
  const cachedData = getCachedData<T>(appId, cacheKey);
  if (cachedData !== null) {
    return cachedData;
  }

  const responseStr = await backendCallable({ appId });
  let response: ApiResponse<T> | null;
  try {
    response = JSON.parse(responseStr) as ApiResponse<T> | null;
  } catch (error) {
    throw new Error(`Failed to parse ${cacheKey} response: ${error}\n${responseStr}`, { cause: error });
  }

  if (!response) {
    throw new Error(`Invalid ${cacheKey} response: ${JSON.stringify(response)}`);
  }

  if (response.error !== undefined) {
    handleTimeoutError(response.error, cacheKey);
  }

  setCachedData(appId, cacheKey, response);

  return response;
}

export async function getGroups(appId: string): Promise<AchievementGroupData[] | null> {
  return fetchAndCache<RequestAchievementGroupsResponse>(appId, API.groups, 'groups').then(response => response.groups);
}

export async function getAchievements(appId: string): Promise<AchievementData[] | null> {
  return fetchAndCache<AchievementData[]>(appId, API.achievements, 'achievements');
}

export async function getSteamGameInfo(appId: string): Promise<SteamGameInfo | null> {
  return fetchAndCache<SteamGameInfo>(appId, API.gameInfo, 'gameInfo');
}

export async function getScrapedDetails(appId: string): Promise<ScrapedAchievementsResponse | null> {
  const cachedData = getCachedData<ScrapedAchievementsResponse>(appId, 'scrapedDetails');
  if (cachedData !== null) {
    return cachedData;
  }

  const backendResponse = await fetchAndCache<BackendScrapedResponse>(appId, API.scrapedDetails, 'scrapedDetails' as keyof AppCache);
  if (!backendResponse.success || backendResponse.modelText === undefined) {
    return { success: false, achievements: {}, updates: [] };
  }

  const { achievements, updates } = processScrapedModel(backendResponse.modelText);

  const finalResponse: ScrapedAchievementsResponse = {
    success: true,
    achievements,
    updates,
  };

  setCachedData(appId, 'scrapedDetails', finalResponse);

  return finalResponse;
}
