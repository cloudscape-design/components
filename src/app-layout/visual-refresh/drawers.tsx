// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { InternalButton } from '../../button/internal';
import { ButtonProps } from '../../button/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
import SplitPanel from './split-panel';
import TriggerButton from './trigger-button';
import { useAppLayoutInternals } from './context';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import sharedStyles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/**
 * The Drawers root component is mounted in the AppLayout index file. It will only
 * render if the drawers are defined, and it will take over the mounting of and
 * rendering of the Tools and SplitPanel (side position) if they exist. If drawers
 * do not exist then the Tools and SplitPanel will be handled by the Tools component.
 */
export default function Drawers() {
  const { disableBodyScroll, drawers, hasDrawerViewportOverlay, hasOpenDrawer, isNavigationOpen, navigationHide } =
    useAppLayoutInternals();

  const isUnfocusable = hasDrawerViewportOverlay && isNavigationOpen && !navigationHide;

  if (drawers.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(styles['drawers-container'], {
        [styles['disable-body-scroll']]: disableBodyScroll,
        [styles['has-open-drawer']]: hasOpenDrawer,
        [styles.unfocusable]: isUnfocusable,
      })}
    >
      <SplitPanel.Side />
      <ActiveDrawer />
      <DesktopTriggers />
    </div>
  );
}

/**
 * The ActiveDrawer component will render either the drawer content that corresponds
 * to the activeDrawerId or the Tools content if it exists and isToolsOpen is true.
 * The aria labels, click handling, and focus handling will be updated dynamically
 * based on the active drawer or tools content.
 */
function ActiveDrawer() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    drawersRefs,
    handleDrawersClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isNavigationOpen,
    isToolsOpen,
    navigationHide,
    tools,
    toolsRefs,
    loseDrawersFocus,
    resizeHandle,
    drawerSize,
    drawersMaxWidth,
    drawerRef,
  } = useAppLayoutInternals();

  const activeDrawer = drawers.find(item => item.id === activeDrawerId) ?? null;

  const computedAriaLabels = {
    closeButton: activeDrawerId ? activeDrawer?.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeDrawerId ? activeDrawer?.ariaLabels?.content : ariaLabels?.tools,
  };

  const isHidden = !activeDrawerId && !isToolsOpen;
  const isUnfocusable = isHidden || (hasDrawerViewportOverlay && isNavigationOpen && !navigationHide);

  const size = Math.min(drawersMaxWidth, drawerSize);

  return (
    <aside
      aria-hidden={isHidden}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, sharedStyles['with-motion'], {
        [styles['is-drawer-open']]: activeDrawerId || isToolsOpen,
        [styles.unfocusable]: isUnfocusable,
        [testutilStyles['active-drawer']]: activeDrawerId,
        [testutilStyles.tools]: isToolsOpen,
      })}
      style={{
        ...(!isMobile && drawerSize && { [customCssProps.drawerSize]: `${size}px` }),
      }}
      ref={drawerRef}
      onBlur={e => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
          loseDrawersFocus();
        }
      }}
    >
      {!isMobile && activeDrawer?.resizable && resizeHandle}
      <div className={clsx(styles['drawer-close-button'])}>
        <InternalButton
          ariaLabel={computedAriaLabels.closeButton}
          className={clsx({
            [testutilStyles['active-drawer-close-button']]: activeDrawerId,
            [testutilStyles['tools-close']]: isToolsOpen,
          })}
          formAction="none"
          iconName={isMobile ? 'close' : 'angle-right'}
          onClick={() => (activeDrawerId ? handleDrawersClick(activeDrawerId ?? null) : handleToolsClick(false))}
          ref={isToolsOpen ? toolsRefs.close : drawersRefs.close}
          variant="icon"
        />
      </div>

      <div className={styles['drawer-content']}>
        {activeDrawerId && activeDrawer?.content}
        {isToolsOpen && tools}
      </div>
    </aside>
  );
}

function useContainerHeight(ref: React.RefObject<HTMLDivElement>) {
  const [height, setHeight] = React.useState(() => (ref.current ? ref.current.clientHeight : 0));
  React.useEffect(() => {
    const handler = () => setHeight(ref.current ? ref.current.clientHeight : 0);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [ref]);
  return height;
}

/**
 * The DesktopTriggers will render the trigger buttons for Tools, Drawers, and the
 * SplitPanel in non mobile viewports. Changes to the activeDrawerId need to be
 * tracked by the previousActiveDrawerId property in order to appropriately apply
 * the ref required to manage focus control.
 */
function DesktopTriggers() {
  const {
    activeDrawerId,
    drawers,
    drawersAriaLabel,
    drawersRefs,
    drawersTriggerCount,
    handleDrawersClick,
    handleSplitPanelClick,
    handleToolsClick,
    hasOpenDrawer,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    splitPanel,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelToggle,
  } = useAppLayoutInternals();

  const hasMultipleTriggers = drawersTriggerCount > 1;
  const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
  const previousActiveDrawerId = useRef(activeDrawerId);

  const triggersContainerRef = useRef<HTMLDivElement>(null);

  const containerHeight = useContainerHeight(triggersContainerRef) || triggersContainerRef.current?.clientHeight;

  const getIndexOfOverflowItem = () => {
    if (containerHeight) {
      const itemHeight = 48;
      const overflowSpot = containerHeight / 1.5;

      const index = Math.floor(overflowSpot / itemHeight).toFixed(0);

      return parseInt(index);
    }

    return 0;
  };

  if (activeDrawerId) {
    previousActiveDrawerId.current = activeDrawerId;
  }

  if (isMobile) {
    return null;
  }

  return (
    <aside
      className={clsx(
        styles['drawers-desktop-triggers-container'],
        testutilStyles['drawers-desktop-triggers-container'],
        {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: hasOpenDrawer,
        }
      )}
      aria-label={drawersAriaLabel}
      ref={triggersContainerRef}
    >
      <div
        className={clsx(styles['drawers-trigger-content'], {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: hasOpenDrawer,
        })}
      >
        {drawers.map(item => (
          <TriggerButton
            ariaLabel={item.ariaLabels?.triggerButton}
            className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'])}
            iconName={item.trigger.iconName}
            iconSvg={item.trigger.iconSvg}
            key={item.id}
            onClick={() => {
              isToolsOpen && handleToolsClick(!isToolsOpen, true);
              handleDrawersClick(item.id);
            }}
            ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
            selected={item.id === activeDrawerId}
            testId={`awsui-app-layout-trigger-${item.id}`}
          />
        ))}

        {drawers.map((item, index) => {
          if (index < getIndexOfOverflowItem()) {
            return (
              <TriggerButton
                ariaLabel={item.ariaLabels?.triggerButton}
                className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'])}
                iconName={item.trigger.iconName}
                iconSvg={item.trigger.iconSvg}
                key={item.id}
                onClick={() => {
                  isToolsOpen && handleToolsClick(!isToolsOpen, true);
                  handleDrawersClick(item.id);
                }}
                ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
                selected={item.id === activeDrawerId}
                badge={item.badge}
              />
            );
          }
        })}
        {hasSplitPanel && splitPanelToggle.displayed && (
          <TriggerButton
            ariaLabel={splitPanelToggle.ariaLabel}
            className={clsx(styles['drawers-trigger'], splitPanelStyles['open-button'])}
            iconName="view-vertical"
            onClick={() => handleSplitPanelClick()}
            selected={hasSplitPanel && isSplitPanelOpen}
            ref={splitPanelRefs.toggle}
          />
        )}
      </div>
    </aside>
  );
}

/**
 * The MobileTriggers will be mounted inside of the AppBar component and
 * only rendered when Drawers are defined in mobile viewports. The same logic
 * will in the AppBar component will suppress the rendering of the legacy
 * trigger button for the Tools drawer.
 */
export function MobileTriggers() {
  const {
    activeDrawerId,
    drawers,
    drawersAriaLabel,
    drawersRefs,
    handleDrawersClick,
    hasDrawerViewportOverlay,
    isMobile,
  } = useAppLayoutInternals();

  const previousActiveDrawerId = useRef(activeDrawerId);

  if (activeDrawerId) {
    previousActiveDrawerId.current = activeDrawerId;
  }

  if (!isMobile || drawers.length === 0) {
    return null;
  }

  return (
    <aside
      aria-hidden={hasDrawerViewportOverlay}
      className={clsx(
        styles['drawers-mobile-triggers-container'],
        testutilStyles['drawers-mobile-triggers-container'],
        {
          [styles.unfocusable]: hasDrawerViewportOverlay,
        }
      )}
      aria-label={drawersAriaLabel}
    >
      {drawers.map(item => (
        <InternalButton
          ariaExpanded={item.id === activeDrawerId}
          ariaLabel={item.ariaLabels?.triggerButton}
          className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'])}
          disabled={hasDrawerViewportOverlay}
          formAction="none"
          iconName={item.trigger.iconName}
          iconSvg={item.trigger.iconSvg}
          key={item.id}
          onClick={() => handleDrawersClick(item.id)}
          ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
          variant="icon"
          __nativeAttributes={{ 'aria-haspopup': true, 'data-testid': `awsui-app-layout-trigger-${item.id}` }}
        />
      ))}
    </aside>
  );
}
