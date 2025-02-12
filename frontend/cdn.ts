import { callable } from "@steambrew/client";

export let CDN: string;

const PLUGIN_DIR_STORAGE = 'achievement_hunters_plugin_dir';
const getPluginDir = callable<[], string>('GetPluginDir');

export async function initCdn() {
    let pluginDir = sessionStorage.getItem(PLUGIN_DIR_STORAGE);
    if (pluginDir === null) {
        pluginDir = await getPluginDir();
        sessionStorage.setItem(PLUGIN_DIR_STORAGE, pluginDir);
    }
    const extensionFolder = pluginDir.replace(/.*\\([^\\]+)\\([^\\]+)$/, '/$1/$2') + `/public`;
    CDN = 'https://pseudo.millennium.app' + extensionFolder;
}

export function getCdn(path: string) {
    if (path.startsWith('/')) {
        return `${CDN}${path}`;
    }

    return `${CDN}/${path}`;
}

export function testing() {
    console.log('this is my testing func')
}