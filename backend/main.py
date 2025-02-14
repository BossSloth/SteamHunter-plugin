import Millennium
import PluginUtils  # type: ignore

logger = PluginUtils.Logger("steam-hunters")

import json
import os
import shutil
import requests

DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'X-Requested-With': 'Steam',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36',
}

def GetPluginDir():
    return os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..'))

def Request(url: str, params: dict) -> str:
    response = None
    try:
        response = requests.get(url, params=params, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        return response.text
    except Exception as error:
        return json.dumps({
            'success': False,
            'error': str(error) + ' ' + (response.text if response else 'No response')
        })

def RequestAchievementGroups(appId: int) -> str:
    return Request(f'https://steamhunters.com/api/GetAchievementGroups/v1', {'appid': int(appId)})

def RequestAchievements(appId: int) -> str:
    return Request(f'https://steamhunters.com/api/apps/{appId}/achievements', {})

def RequestSteamGameInfo(appId: int) -> str:
    return Request(f'https://steamhunters.com/api/apps/{appId}', {})

def RequestAchievementUpdates(appId: int) -> str:
    return Request(f'https://steamhunters.com/api/apps/{appId}/updates', {})

class Plugin:
    def _front_end_loaded(self):
        pass

    def _load(self):
        logger.log(f"bootstrapping SteamHunters plugin, millennium {Millennium.version()}")

        Millennium.ready()  # this is required to tell Millennium that the backend is ready.

    def _unload(self):
        logger.log("unloading")
