import React, { forwardRef, JSX, PropsWithChildren, useEffect, useImperativeHandle, useRef } from 'react';
import { SteamTooltip } from '../SteamComponents';

export interface TooltipProps extends PropsWithChildren {
  readonly showTooltipOnContollerFocus?: boolean;
  readonly toolTipContent: React.ReactNode;
}

export interface TooltipRef {
  hide(): void;
  show(): void;
}

export const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  ({ toolTipContent, showTooltipOnContollerFocus = true, children }, ref): JSX.Element => {
    const content = (
      <>
        {toolTipContent}
        <div className="steam-hunters-tooltip-arrow" />
      </>
    );

    const containerRef = useRef<HTMLDivElement>(null);

    const showEventRef = useRef(new MouseEvent('mouseover', { bubbles: true }));
    const hideEventRef = useRef(new MouseEvent('mouseout', { bubbles: true }));

    useImperativeHandle(ref, () => ({
      show(): void {
        containerRef.current?.dispatchEvent(showEventRef.current);
      },
      hide(): void {
        containerRef.current?.dispatchEvent(hideEventRef.current);
      },
    }));

    useEffect(() => {
      const element = containerRef.current;
      if (element === null) return undefined;

      function handleFocus(): void {
        element?.dispatchEvent(showEventRef.current);
      }

      function handleBlur(): void {
        element?.dispatchEvent(hideEventRef.current);
      }

      element.addEventListener('vgp_onfocus', handleFocus);
      element.addEventListener('vgp_onblur', handleBlur);

      return (): void => {
        element.removeEventListener('vgp_onfocus', handleFocus);
        element.removeEventListener('vgp_onblur', handleBlur);
      };
    }, []);

    return (
      <SteamTooltip
        toolTipContent={content}
        direction="top"
        nDelayShowMS={100}
        strTooltipClassname="steam-hunters-tooltip"
      >
        {showTooltipOnContollerFocus ? <div ref={containerRef}>{children}</div> : children}
      </SteamTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';
