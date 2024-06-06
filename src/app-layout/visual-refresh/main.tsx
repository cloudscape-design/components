// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import customCssProps from '../../internal/generated/custom-css-properties';
import { getStickyOffsetVars } from '../utils/sticky-offsets';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import * as tokens from '../../internal/generated/styles/tokens';

export default function Main() {
  const {
    content,
    disableBodyScroll,
    disableContentPaddings,
    footerHeight,
    hasDrawerViewportOverlay,
    navigationOpen,
    placement,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    mainElement,
    notificationsHeight,
    stickyNotifications,
    offsetBottom,
    splitPanelDisplayed,
    splitPanelPosition,
    activeDrawerId,
  } = useAppLayoutInternals();

  const splitPanelHeight = offsetBottom - footerHeight;

  return (
    <div
      className={clsx(
        styles.container,
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-content-paddings']]: disableContentPaddings,
          [styles['has-split-panel']]: splitPanelDisplayed,
          [styles['is-navigation-open']]: navigationOpen,
          [styles['is-tools-open']]: isToolsOpen,
          [styles['has-active-drawer']]: !!activeDrawerId,
          [styles['is-split-panel-open']]: isSplitPanelOpen,
          [styles.unfocusable]: hasDrawerViewportOverlay,
        },
        testutilStyles.content
      )}
      ref={mainElement}
      style={{
        [customCssProps.splitPanelHeight]: `${splitPanelHeight}px`,
        ...getStickyOffsetVars(
          placement.insetBlockStart,
          offsetBottom,
          stickyNotifications && notificationsHeight > 0 ? `${tokens.spaceXs} + ${notificationsHeight}px` : '0px',
          `var(${customCssProps.mobileBarHeight})`,
          !!disableBodyScroll,
          isMobile
        ),
      }}
    >
      {content}
    </div>
  );
}
