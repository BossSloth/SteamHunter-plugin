/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createPropListRegex, findModuleByExport, findModuleExport } from '@steambrew/client';
import { FC, ReactNode } from 'react';

// Tab component that is used by the achievements page. Might come in useful later
/**
 * The Tab component used by Steam's achievements page.
 * Might come in useful later
 * @example
 * <TabComponent tabs={props.tabs} onShowTab={(...e: any[]) => console.log('Clicked tab', e)}></TabComponent>
 */
export const TabComponent = findModuleByExport(e => e?.toString?.().includes('bleedGlyphs')).JZ as FC<unknown>;

interface SteamTooltipProps {
  toolTipContent: ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right'; // Default: 'right'
  nDelayShowMS?: number;
  bDisabled?: boolean;
  strTooltipClassname?: string;
}

// Can be found in library.js
export const SteamTooltip = findModuleExport((e?: Function) =>
  e?.toString !== undefined
  && createPropListRegex(['children']).test(e.toString())
  && (/tooltipProps:\w/).test(e.toString())
) as FC<SteamTooltipProps>;

interface ControllerFocusableProps {
  onClick?(): void;
  onActivate?(e: unknown): void;
  onGamepadFocus?(): void;
  onGamepadBlur?(): void;
  onFocusWithin?(): void;

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
    && !f.toString().includes('virtualKeyboardProps'))
  ('div') ?? (props => props.children)
) as FC<ControllerFocusableProps>;
