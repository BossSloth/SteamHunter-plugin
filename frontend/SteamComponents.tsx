/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createPropListRegex, findModuleByExport, findModuleExport } from '@steambrew/client';
import React, { FC, PropsWithChildren, ReactNode, useMemo } from 'react';

// Tab component that is used by the achievements page. Might come in useful later
/**
 * The Tab component used by Steam's achievements page.
 * Might come in useful later
 * @example
 * <TabComponent tabs={props.tabs} onShowTab={(...e: any[]) => console.log('Clicked tab', e)}></TabComponent>
 */
export const TabComponent = findModuleByExport(e => e?.toString?.().includes('bleedGlyphs')).JZ as FC<unknown>;

export interface SteamTooltipProps extends PropsWithChildren {
  bDisabled?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right'; // Default: 'right'
  nDelayShowMS?: number;
  strTooltipClassname?: string;
  toolTipContent: ReactNode;
}

// Can be found in library.js
function resolveTooltip(): FC<SteamTooltipProps> | null {
  try {
    const found = findModuleExport((e?: Function) =>
      e?.toString !== undefined
      && createPropListRegex(['children']).test(e.toString())
      && (/tooltipProps:\w/).test(e.toString()));
    return (typeof found === 'function' ? found : null) as FC<SteamTooltipProps> | null;
  } catch {
    return null;
  }
}

export const SteamTooltip: FC<SteamTooltipProps> = (props) => {
  const Resolved = useMemo(resolveTooltip, []);
  if (Resolved !== null) {
    return <Resolved {...props} />;
  }
  const { children } = props;
  return <>{children}</>;
};

interface ControllerFocusableProps extends PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  onActivate?(e: unknown): void;
  onClick?(): void;
  onFocusWithin?(): void;
  onGamepadBlur?(): void;
  onGamepadFocus?(): void;

  noFocusRing?: boolean;
  onOKActionDescription?: string | null;
}

function resolveFocusable(): FC<ControllerFocusableProps> | null {
  try {
    const focusableModule = findModuleByExport(e =>
      e?.toString?.().includes('strEnterKeyLabel')
      && e.toString().includes('refKeyboardHandle'));
    if (focusableModule === undefined || focusableModule === null) {
      return null;
    }
    const found = Object.values(focusableModule).find(f =>
      f?.toString?.().includes('forwardRef')
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      && !f.toString().includes('virtualKeyboardProps'));
    if (typeof found !== 'function') {
      return null;
    }
    return (found as (tag: string) => FC<ControllerFocusableProps>)('div');
  } catch {
    return null;
  }
}

export const ControllerFocusable: FC<ControllerFocusableProps> = (props) => {
  const Resolved = useMemo(resolveFocusable, []);
  if (Resolved !== null) {
    return <Resolved {...props} />;
  }
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
};
