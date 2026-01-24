import { Millennium, sleep } from '@steambrew/client';
import { useAchievementStore } from 'stores';
import { getHltbData } from './HtlbData';

function createInfoWithUrl(title: string, description: string, url: string): HTMLElement {
  const infoItem = document.createElement('div');
  infoItem.classList.add('_2ZcNQxY8YknnhNa4ZvIoU4', 'time-hltb-info');
  infoItem.innerHTML = `
        <div class="_1vYL2q-91QLy-FBzntE7E5">${title}</div>
        <div class="_-9icu8LqT7inRSJISgnkh">
            <a class="_2j8Xh4pPOOgF4MF6FVUI28" href="steam://openurl_external/${url}">${description}</a>
        </div>
    `;

  return infoItem;
}

function toHrs(minutes: number | null): string {
  return minutes !== null ? `${(minutes / 60).toFixed(1)} hrs` : '--';
}

let mainDocument: Document;

async function findElement<T extends Element = Element>(selector: string): Promise<T | null> {
  try {
    const elements = await Millennium.findElement(mainDocument, selector);
    const firstElement = elements[0] as T | undefined;

    return firstElement ?? null;
  } catch {
    return null;
  }
}

async function injectHltbData(appId: string): Promise<void> {
  mainDocument.querySelectorAll('.time-hltb-info').forEach((element) => {
    element.remove();
  });
  const infoContainer = await findElement('._3cntzF30xAuwn1ARWJjvCb._1uS70KI6ZbUE94jUB27ioB');
  if (!infoContainer) {
    console.error('[HLTB] Could not find info container.');

    return;
  }

  const appData = await getHltbData(appId);

  if (appData === null) {
    return;
  }

  const numberFormatter = new Intl.NumberFormat();

  function createBr(): HTMLElement {
    const infoBr = mainDocument.createElement('br');
    infoBr.classList.add('time-hltb-info');

    return infoBr;
  }

  if (appData.hltb !== undefined) {
    infoContainer.appendChild(createBr());
    infoContainer.appendChild(createInfoWithUrl('Main Story:', toHrs(appData.hltb.story), appData.hltb.url));
    infoContainer.appendChild(createInfoWithUrl('Main + Extras:', toHrs(appData.hltb.extras), appData.hltb.url));
    infoContainer.appendChild(createInfoWithUrl('Completionist:', toHrs(appData.hltb.complete), appData.hltb.url));
  }
  if (appData.players !== undefined) {
    const steamdbUrl = `https://steamdb.info/app/${appId}/charts/`;
    infoContainer.appendChild(createBr());
    infoContainer.appendChild(createInfoWithUrl('Playing now:', numberFormatter.format(appData.players.recent), steamdbUrl));
    infoContainer.appendChild(createInfoWithUrl('24-hour peak:', numberFormatter.format(appData.players.peak_today), steamdbUrl));
    infoContainer.appendChild(createInfoWithUrl('All-time peak:', numberFormatter.format(appData.players.peak_all), steamdbUrl));
  }
}

function attachListeners(appId: string, infoButton: HTMLElement): void {
  async function handleInteraction(): Promise<void> {
    if (infoButton.getAttribute('hltb-injected') === 'true') {
      return;
    }

    infoButton.setAttribute('hltb-injected', 'true');

    await injectHltbData(appId);
  }

  infoButton.addEventListener('click', handleInteraction);
  infoButton.addEventListener('mouseenter', handleInteraction);

  // Is info element open
  if (mainDocument.querySelector('._3s6_6sN8LyrlTHc_z6VfNU')) {
    handleInteraction();
  }
}

async function addHltbData(): Promise<void> {
  const showHltbData = useAchievementStore.getState().showHltb;
  if (!showHltbData) {
    return;
  }

  try {
    const appIconElement = await findElement<HTMLImageElement>('._3NBxSLAZLbbbnul8KfDFjw._2dzwXkCVAuZGFC-qKgo8XB');
    const infoButton = (await findElement('._3VQUewWB8g6Z5qB4C7dGFr ._3qDWQGB0rtwM3qpXTb11Q-.Focusable .zvLq1GUCH3yLuqv_TXBJ1'))?.parentElement;

    if (!appIconElement || !infoButton) {
      setTimeout(addHltbData, 100);

      return;
    }

    if (infoButton.getAttribute('hltb-click-listener') === 'true') {
      setTimeout(addHltbData, 100);

      return;
    }

    const appId = appIconElement.src.match(/assets\/(\d+)/)?.[1];
    if (appId === undefined) {
      console.error('[HLTB] Could not find app id');
      setTimeout(addHltbData, 100);

      return;
    }

    infoButton.setAttribute('hltb-click-listener', 'true');

    attachListeners(appId, infoButton);

    setTimeout(addHltbData, 100);
  } catch (error) {
    setTimeout(addHltbData, 500);
    throw error;
  }
}

export async function initHltbInjection(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (mainDocument === undefined) {
    mainDocument = SteamUIStore.WindowStore.MainWindowInstance.m_BrowserWindow.document;

    // eslint-disable-next-line no-await-in-loop
    await sleep(500);
  }

  await addHltbData();
}
