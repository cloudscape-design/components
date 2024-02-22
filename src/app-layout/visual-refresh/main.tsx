// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import customCssProps from '../../internal/generated/custom-css-properties';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Main() {
  const {
    content,
    disableContentPaddings,
    footerHeight,
    hasDrawerViewportOverlay,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
    mainElement,
    offsetBottom,
    splitPanelDisplayed,
    splitPanelPosition,
    activeDrawerId,
    contentType,
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
          [styles['is-navigation-open']]: isNavigationOpen,
          [styles['is-tools-open']]: isToolsOpen,
          [styles['has-active-drawer']]: !!activeDrawerId,
          [styles['is-split-panel-open']]: isSplitPanelOpen,
          [styles.unfocusable]: hasDrawerViewportOverlay,
          [styles[`content-type-${contentType}`]]: contentType,
        },
        testutilStyles.content
      )}
      ref={mainElement}
      style={{
        [customCssProps.splitPanelHeight]: `${splitPanelHeight}px`,
      }}
    >
      {content}
    </div>
  );
}
