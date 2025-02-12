import { createPropListRegex, findModuleByExport, findModuleExport } from "@steambrew/client";
import { FC, ReactNode } from "react";

// Tab component that is used by the achievements page. Might come in useful later
export const TabComponent = findModuleByExport((e) => e?.toString?.().includes('bleedGlyphs')).JZ as FC<any>;
//<TabComponent tabs={props.tabs} onShowTab={(...e: any[]) => console.log('Clicked tab', e)}></TabComponent>

type SteamTooltipProps = {
    toolTipContent: ReactNode
    direction?: 'top' | 'bottom' | 'left' | 'right' // Default: 'right'
    nDelayShowMS?: number,
    bDisabled?: boolean,
    strTooltipClassname?: string
}

// Can be found in library.js 
// export const SteamTooltip = findModuleExport((e) => e?.toString?.().includes('tooltipProps:i')) as FC<SteamTooltipProps>;
export const SteamTooltip = findModuleExport((e) => 
    e?.toString 
    && createPropListRegex(['children']).test(e.toString()) 
    && /tooltipProps:\w/.test(e.toString())
) as FC<SteamTooltipProps>;