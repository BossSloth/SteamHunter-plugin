import { createPropListRegex, findModuleByExport, findModuleExport } from '@steambrew/client';
import { FC, ReactNode } from 'react';

// Tab component that is used by the achievements page. Might come in useful later
/**
 * The Tab component used by Steam's achievements page.
 * Might come in useful later
 * @example
 * <TabComponent tabs={props.tabs} onShowTab={(...e: any[]) => console.log('Clicked tab', e)}></TabComponent>
 */
export const TabComponent = findModuleByExport((e) => e?.toString?.().includes('bleedGlyphs')).JZ as FC<unknown>;

type SteamTooltipProps = {
  toolTipContent: ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right'; // Default: 'right'
  nDelayShowMS?: number;
  bDisabled?: boolean;
  strTooltipClassname?: string;
};

// Can be found in library.js
export const SteamTooltip = findModuleExport(
  (e) =>
    // prettier-ignore
    e?.toString
    && createPropListRegex(['children']).test(e.toString())
    && /tooltipProps:\w/.test(e.toString()),
) as FC<SteamTooltipProps>;

interface ControllerFocusableProps {
  noFocusRing?: boolean;
  onOKActionDescription?: string | null;
  onClick?: () => void;
  onActivate?: (e: unknown) => void;
  onGamepadFocus?: () => void;
  onGamepadBlur?: () => void;
  onFocusWithin?: () => void;
}

// prettier-ignore
const focusableModule: object = findModuleByExport(
  (e) =>
    e?.toString && e.toString().includes('strEnterKeyLabel')
    && e.toString().includes('refKeyboardHandle'),
);

// prettier-ignore
export const ControllerFocusable = (
  Object.values(focusableModule).find(
    (f) =>
      f?.toString &&
      f.toString().includes('forwardRef') &&
      !f.toString().includes('virtualKeyboardProps'),
  )('div') ?? ((props) => props.children)
) as FC<ControllerFocusableProps>;
