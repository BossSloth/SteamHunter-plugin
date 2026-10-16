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
export const TabComponent = findModuleByExport((e) => e?.toString?.().includes('bleedGlyphs')).JZ as FC<unknown>;

export interface SteamTooltipProps extends PropsWithChildren {
  bDisabled?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right'; // Default: 'right'
  nDelayShowMS?: number;
  strTooltipClassname?: string;
  toolTipContent: ReactNode;
}

// Can be found in library.js
export const SteamTooltip = findModuleExport(
  (e?: Function) =>
    e?.toString !== undefined
    && createPropListRegex(['children']).test(e.toString())
    && /tooltipProps:\w/.test(e.toString()),
) as FC<SteamTooltipProps>;

interface ControllerFocusableProps extends PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  onActivate?(e: unknown): void;
  onClick?(): void;
  onFocusWithin?(): void;
  onGamepadBlur?(): void;
  onGamepadFocus?(): void;

  noFocusRing?: boolean;
  onOKActionDescription?: string | null;
}

const focusableModule: object | undefined = findModuleByExport(
  (e) =>
    typeof e === 'function'
    && e.toString().includes('forwardRef') === true
    && e.toString().includes('virtualKeyboardProps') === true
    && e.toString().includes('refKeyboardHandle') === true,
);

const createFocusable = Object.values(focusableModule ?? {}).find(
  (e) =>
    typeof e === 'function'
    && e.toString().includes('forwardRef') === true
    && e.toString().includes('virtualKeyboardProps') === false,
) as ((tagName: 'div') => FC<ControllerFocusableProps>) | undefined;

export const ControllerFocusable =
  createFocusable?.('div') ?? ((async (props) => props.children) as FC<ControllerFocusableProps>);
