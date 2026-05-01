import { callable, Field, TextField } from '@steambrew/client';
import React, { useEffect, useState } from 'react';

interface Settings {
  proxyUrl?: string;
}

const getSettings = callable<[], string>('GetSettings');
const saveSettings = callable<[{ newSettings: string; }], string>('SaveSettings');

function ProxyDescription(): React.JSX.Element {
  return (
    <>
      URL of a proxy server to use for API requests. For a list see
      <a href="https://github.com/themiralay/Proxy-List-World" target="_blank" rel="noreferrer"> https://github.com/themiralay/Proxy-List-World</a>
    </>
  );
}

export function SettingsContent(): React.JSX.Element {
  const [proxyUrl, setProxyUrl] = useState('');

  useEffect(() => {
    getSettings().then((response) => {
      const parsed = JSON.parse(response) as Settings;
      setProxyUrl(parsed.proxyUrl ?? '');
    }).catch(console.error);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setProxyUrl(value);

    const newSettings: Settings = { proxyUrl: value };
    saveSettings({ newSettings: JSON.stringify(newSettings) }).catch(console.error);
  }

  return (
    <Field label="Proxy URL" description={<ProxyDescription />}>
      {/* @ts-expect-error - placeholder is not typed */}
      <TextField placeholder="1.1.1.1:80" value={proxyUrl} onChange={handleChange} />
    </Field>
  );
}
