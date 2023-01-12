// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import {
  SplitPanelContextProvider,
  SplitPanelContextProps,
  SplitPanelLastInteraction,
} from '../../internal/context/split-panel-context';
import styles from './styles.css.js';
import { AppLayoutProps } from '../interfaces';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import { Transition } from '../../internal/components/transition';
import customCssProps from '../../internal/generated/custom-css-properties';
import { CONSTRAINED_PAGE_HEIGHT } from '../../split-panel/utils/size-utils';

/**
 * If there is no Split Panel in the AppLayout context then the SplitPanel
 * will pass through the AppLayout children without the context.
 */
function SplitPanel({ children }: React.PropsWithChildren<unknown>) {
  const {
    handleSplitPanelClick,
    handleSplitPanelPreferencesChange,
    handleSplitPanelResize,
    isMobile,
    isSplitPanelForcedPosition,
    isSplitPanelOpen,
    setSplitPanelReportedSize,
    setSplitPanelReportedHeaderHeight,
    splitPanelPosition,
    splitPanelSize,
    headerHeight,
    footerHeight,
  } = useAppLayoutInternals();

  const [openButtonAriaLabel, setOpenButtonAriaLabel] = useState<undefined | string>(undefined);

  const [splitPanelLastInteraction, setSplitPanelLastInteraction] = useState<undefined | SplitPanelLastInteraction>();
  useEffectOnUpdate(
    () => setSplitPanelLastInteraction(isSplitPanelOpen ? { type: 'open' } : { type: 'close' }),
    [isSplitPanelOpen]
  );
  useEffectOnUpdate(() => setSplitPanelLastInteraction({ type: 'position' }), [splitPanelPosition]);

  const context: SplitPanelContextProps = {
    bottomOffset: 0,
    getMaxHeight: () => {
      const availableHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
      // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
      return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
    },
    getMaxWidth: () => document.documentElement.clientWidth,
    isForcedPosition: isSplitPanelForcedPosition,
    isMobile,
    isOpen: isSplitPanelOpen,
    leftOffset: 0,
    onPreferencesChange: handleSplitPanelPreferencesChange,
    onResize: handleSplitPanelResize,
    onToggle: handleSplitPanelClick,
    position: splitPanelPosition,
    reportSize: setSplitPanelReportedSize,
    reportHeaderHeight: setSplitPanelReportedHeaderHeight,
    rightOffset: 0,
    size: splitPanelSize || 0,
    topOffset: 0,
    openButtonAriaLabel,
    setOpenButtonAriaLabel,
    lastInteraction: splitPanelLastInteraction,
    isStickyHeader: () => document.documentElement.clientHeight - headerHeight - footerHeight > CONSTRAINED_PAGE_HEIGHT,
  };

  return <SplitPanelContextProvider value={context}>{children}</SplitPanelContextProvider>;
}

/**
 * This is the render function for the SplitPanel when it is in bottom position.
 * The Split Panel container will be another row entry in the grid definition in
 * the Layout component. The start and finish columns will be variable based
 * on the presence and state of the Navigation and Tools components.
 */
function SplitPanelBottom() {
  const {
    disableBodyScroll,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
    splitPanel,
    splitPanelPosition,
    splitPanelReportedSize,
    splitPanelReportedHeaderHeight,
  } = useAppLayoutInternals();

  if (!splitPanel) {
    return null;
  }

  return (
    <Transition in={isSplitPanelOpen ?? false} exit={false}>
      {(state, transitionEventsRef) => (
        <section
          className={clsx(styles['split-panel-bottom'], styles[`position-${splitPanelPosition}`], {
            [styles.animating]: state === 'entering',
            [styles['disable-body-scroll']]: disableBodyScroll,
            [styles['is-navigation-open']]: isNavigationOpen,
            [styles['is-split-panel-open']]: isSplitPanelOpen,
            [styles['is-tools-open']]: isToolsOpen,
          })}
          ref={transitionEventsRef}
          style={{
            [customCssProps.splitPanelReportedSize]: `${splitPanelReportedSize}px`,
            [customCssProps.splitPanelReportedHeaderSize]: `${splitPanelReportedHeaderHeight}px`,
          }}
        >
          <SplitPanel></SplitPanel>
          {splitPanelPosition === 'bottom' && splitPanel}
        </section>
      )}
    </Transition>
  );
}

/**
 * This is the render function for the SplitPanel when it is side position.
 * The Split Panel will not be within the grid defined in the Layout component
 * but instead a direct child of the Tools component. The width constraints
 * for this position are computed in the Tools component.
 */
function SplitPanelSide() {
  const {
    isSplitPanelOpen,
    splitPanel,
    splitPanelPosition,
    splitPanelMaxWidth,
    splitPanelMinWidth,
    splitPanelReportedSize,
  } = useAppLayoutInternals();

  if (!splitPanel) {
    return null;
  }

  return (
    <Transition in={isSplitPanelOpen ?? false} exit={false}>
      {(state, transitionEventsRef) => (
        <section
          aria-hidden={!isSplitPanelOpen || splitPanelPosition === 'bottom' ? true : false}
          className={clsx(styles['split-panel-side'], styles[`position-${splitPanelPosition}`], {
            [styles.animating]: state === 'entering',
            [styles['is-split-panel-open']]: isSplitPanelOpen,
          })}
          ref={transitionEventsRef}
          style={{
            [customCssProps.splitPanelMaxWidth]: `${splitPanelMaxWidth}px`,
            [customCssProps.splitPanelMinWidth]: `${splitPanelMinWidth}px`,
            [customCssProps.splitPanelReportedHeaderSize]: `${splitPanelReportedSize}px`,
          }}
        >
          <div className={clsx(styles['animated-content'])}>{splitPanelPosition === 'side' && splitPanel}</div>
        </section>
      )}
    </Transition>
  );
}

/**
 * This logic will determine what the Split Panel position should be. It reconciles the possibility
 * of being in forced position with the current selected position in the settings.
 */
export function getSplitPanelPosition(
  isSplitPanelForcedPosition: boolean,
  splitPanelPreferences: AppLayoutProps.SplitPanelPreferences | undefined
) {
  let splitPanelPosition: AppLayoutProps.SplitPanelPosition = 'bottom';

  if (!isSplitPanelForcedPosition && splitPanelPreferences?.position === 'side') {
    splitPanelPosition = 'side';
  }

  return splitPanelPosition;
}
SplitPanel.Bottom = SplitPanelBottom;
SplitPanel.Side = SplitPanelSide;

export default SplitPanel;
