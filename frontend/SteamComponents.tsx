/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createPropListRegex, findModuleByExport, findModuleExport } from '@steambrew/client';
import { FC, PropsWithChildren, ReactNode } from 'react';

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
export const SteamTooltip = findModuleExport((e?: Function) =>
  e?.toString !== undefined
  && createPropListRegex(['children']).test(e.toString())
  && (/tooltipProps:\w/).test(e.toString())) as FC<SteamTooltipProps>;

interface ControllerFocusableProps extends PropsWithChildren {
  onActivate?(e: unknown): void;
  onClick?(): void;
  onFocusWithin?(): void;
  onGamepadBlur?(): void;
  onGamepadFocus?(): void;

  noFocusRing?: boolean;
  onOKActionDescription?: string | null;
}

const focusableModule: object = findModuleByExport(e =>
  e?.toString?.().includes('strEnterKeyLabel')
  && e.toString().includes('refKeyboardHandle'));

export const ControllerFocusable = (
  Object.values(focusableModule).find(f =>
    f?.toString?.().includes('forwardRef')
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    && !f.toString().includes('virtualKeyboardProps'))('div') ?? (async props => props.children)
) as FC<ControllerFocusableProps>;
