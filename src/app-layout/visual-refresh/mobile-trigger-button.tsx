// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import Tooltip from '../../internal/components/tooltip/index.js';
import { AppLayoutProps } from '../interfaces';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';
import { useAppLayoutInternals } from './context';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

interface MobileTriggerProps {
  tooltipText?: string;
  item: AppLayoutProps.Drawer;
}
/**
 * The MobileTriggers will be mounted inside of the AppBar component and
 * only rendered when Drawers are defined in mobile viewports. The same logic
 * will in the AppBar component will suppress the rendering of the legacy
 * trigger button for the Tools drawer.
 */
function MobileTriggerButton({ tooltipText, item }: MobileTriggerProps) {
  const { activeDrawerId, drawers, hasOpenDrawer, drawersRefs, handleDrawersClick, hasDrawerViewportOverlay } =
    useAppLayoutInternals();

  const previousActiveDrawerRef = useRef(activeDrawerId);
  const containerRef = useRef(null);
  const previousActiveDrawerIdRef = useRef(activeDrawerId);
  const ariaLabel = item.ariaLabels?.triggerButton || '';
  const tooltipValue = tooltipText
    ? tooltipText
    : item.ariaLabels?.drawerName
      ? item.ariaLabels.drawerName
      : ariaLabel ?? '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const activeTriggerRef = item.id === previousActiveDrawerIdRef.current ? drawersRefs.toggle : undefined;

  useImperativeHandle(activeTriggerRef as React.Ref<ButtonProps.Ref>, () => ({
    focus: () => {
      if (activeTriggerRef && (activeTriggerRef as any)?.current) {
        (activeTriggerRef as any).current?.focus();
      }
    },
  }));

  useEffect(() => {

    const close = () => {
      setShowTooltip(false);
    };

    const handlePointerDownEvent = (event: PointerEvent) => {
      if (event.target && containerRef && (containerRef.current as any)?.contains(event.target as HTMLElement)) {
        return;
      }

      close();
    };

    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('pointerdown', handlePointerDownEvent);
    window.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDownEvent);
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [containerRef]);

  const onShowTooltipSoft = (show: boolean) => {
    setShowTooltip(show);
  };

  const onShowTooltipHard = (show: boolean) => {
    setShowTooltip(show);
  };

  if (!drawers) {
    return null;
  }

  if (activeDrawerId) {
    previousActiveDrawerRef.current = activeDrawerId;
  }

  return (
    <div
      ref={containerRef}
      key={item.id}
      onPointerEnter={() => onShowTooltipSoft(true)}
      onPointerLeave={() => onShowTooltipSoft(false)}
      onFocus={() => onShowTooltipHard(true)}
      onBlur={() => onShowTooltipHard(false)}
    >
      <InternalButton
        ariaExpanded={item.id === activeDrawerId}
        ariaLabel={ariaLabel}
        className={clsx(
          styles['drawers-trigger'],
          testutilStyles['drawers-trigger'],
          item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']
        )}
        disabled={hasDrawerViewportOverlay}
        ref={activeTriggerRef}
        formAction="none"
        iconName={item.trigger.iconName}
        iconSvg={item.trigger.iconSvg}
        badge={item.badge}
        key={item.id}
        onClick={() => handleDrawersClick(item.id)}
        variant="icon"
        __nativeAttributes={{ 'aria-haspopup': true, 'data-testid': `awsui-app-layout-trigger-${item.id}` }}
      />
      {showTooltip && containerRef && containerRef.current && !hasOpenDrawer && tooltipValue && (
        <Tooltip trackRef={containerRef} value={tooltipValue} />
      )}
    </div>
  );
}

export default MobileTriggerButton;
