import { callable, findClass } from '@steambrew/client';

export let CDN: string;

const PLUGIN_DIR_STORAGE = 'achievement_hunters_plugin_dir';
const getPluginDir = callable<[], string>('GetPluginDir');

export async function initCdn(): Promise<void> {
  let pluginDir = sessionStorage.getItem(PLUGIN_DIR_STORAGE);
  if (pluginDir === null) {
    pluginDir = await getPluginDir();
    sessionStorage.setItem(PLUGIN_DIR_STORAGE, pluginDir);
  }
  const extensionFolder = `${pluginDir.replace(/.*\\([^\\]+)\\([^\\]+)$/, '/$1/$2')}/public`;
  CDN = `https://pseudo.millennium.app${extensionFolder}`;
}

function getCdn(path: string): string {
  if (path.startsWith('/')) {
    return `${CDN}${path}`;
  }

  return `${CDN}/${path}`;
}

const cssId = 'steam-hunters-main-css';

export async function CreateCssElement(document: Document): Promise<void> {
  const loadingIndicator = 'steam-hunters-css-loading';
  if (document.getElementById(cssId) || document.body.classList.contains(loadingIndicator)) return;
  document.body.classList.add(loadingIndicator);

  let cssContent = await fetch(getCdn('/achievements.css')).then(async r => r.text());

  const steamClassNames = [...cssContent.matchAll(/\.__(\w+)__/g)];
  steamClassNames.forEach((className) => {
    if (className[1] === undefined) return;
    const realClassName = findClass(className[1]) as string;
    cssContent = cssContent.replaceAll(className[0], `.${realClassName}`);
  });

  const cssElement = document.createElement('style');
  cssElement.innerHTML = cssContent;
  cssElement.id = cssId;
  document.head.appendChild(cssElement);
  document.body.classList.remove(loadingIndicator);
}
