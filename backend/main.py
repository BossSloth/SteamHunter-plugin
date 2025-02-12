import Millennium
import PluginUtils  # type: ignore

logger = PluginUtils.Logger("steam-hunters")

import json
import os
import shutil
import requests

def GetPluginDir():
    return os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..'))

class Plugin:
    def _front_end_loaded(self):
        pass

    def _load(self):
        logger.log(f"bootstrapping SteamHunters plugin, millennium {Millennium.version()}")

        Millennium.ready()  # this is required to tell Millennium that the backend is ready.

    def _unload(self):
        logger.log("unloading")
