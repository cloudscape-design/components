// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import customCssProps from '../../../internal/generated/custom-css-properties';
import { useMobile } from '../../../internal/hooks/use-mobile';
import globalVars from '../../../internal/styles/global-vars';
import { AppLayoutInternalProps, AppLayoutState } from '../interfaces';
import { SkeletonSlotsAttributes } from '../skeleton/interfaces';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from '../skeleton/styles.css.js';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

export const useSkeletonSlotsAttributes = (
  hasToolbar: boolean,
  appLayoutProps: AppLayoutInternalProps,
  appLayoutState: AppLayoutState
): SkeletonSlotsAttributes => {
  const {
    isNested,
    activeDrawerSize,
    navigationOpen,
    verticalOffsets,
    splitPanelOffsets,
    activeDrawer,
    expandedDrawerId,
    activeAiDrawer,
  } = appLayoutState.widgetizedState ?? {};
  const { contentType, placement, maxContentWidth, navigationWidth, minContentWidth, disableContentPaddings } =
    appLayoutProps;
  const isMobile = useMobile();
  const toolsOpen = !!activeDrawer;
  const drawerExpandedMode = !!expandedDrawerId;
  const aiDrawerExpandedMode = expandedDrawerId === activeAiDrawer?.id;
  const anyPanelOpen = navigationOpen || toolsOpen;
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;

  const wrapperElAttributes = {
    className: clsx(styles.root, testutilStyles.root, {
      [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
      [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
      [styles['drawer-expanded-mode']]: drawerExpandedMode,
      [styles['ai-drawer-expanded-mode']]: aiDrawerExpandedMode,
    }),
    style: {
      minBlockSize: isNested ? '100%' : `calc(100vh - ${placement.insetBlockStart + placement.insetBlockEnd}px)`,
      [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
      [customCssProps.navigationWidth]: `${navigationWidth}px`,
      [customCssProps.toolsWidth]: `${activeDrawerSize}px`,
    },
    'data-awsui-app-layout-widget-loaded': true,
    // indicates if the app layout has its own border for backward and forward compatibility
    // so that mezzanine could decide whether to show the border on their end or not
    'data-awsui-app-layout-has-top-dark-border': true,
  };

  const mainElAttributes = {
    className: clsx(
      styles['main-landmark'],
      isMobile && anyPanelOpen && styles['unfocusable-mobile'],
      drawerExpandedMode && styles.hidden
    ),
  };

  const contentWrapperElAttributes = {
    className: clsx(styles.main, { [styles['main-disable-paddings']]: disableContentPaddings }),
    style: {
      paddingBlockEnd: splitPanelOffsets?.mainContentPaddingBlockEnd,
      ...(hasToolbar || !isNested
        ? {
            [globalVars.stickyVerticalTopOffset]: `${verticalOffsets?.header ?? 0}px`,
            [globalVars.stickyVerticalBottomOffset]: `${splitPanelOffsets?.stickyVerticalBottomOffset ?? 0}px`,
          }
        : {}),
      ...(!isMobile ? { minWidth: `${minContentWidth}px` } : {}),
    },
  };

  const contentHeaderElAttributes = {
    className: styles['content-header'],
  };

  const contentElAttributes = {
    className: clsx(styles.content, testutilStyles.content),
  };

  return {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  };
};
