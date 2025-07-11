// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import customCssProps from '../../../../internal/generated/custom-css-properties';
import { useMobile } from '../../../../internal/hooks/use-mobile';
import globalVars from '../../../../internal/styles/global-vars';
import { VerticalLayoutOutput } from '../../compute-layout';
import { ToolbarProps } from '../../toolbar';
import { SkeletonLayoutProps } from '../index';

import testutilStyles from '../../../test-classes/styles.css.js';
import styles from '../styles.css.js';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

export const useSkeletonSlotsAttributes = ({ appLayoutProps, appLayoutState }: SkeletonLayoutProps) => {
  const { isNested, activeDrawerSize, resolvedNavigationOpen, splitPanelOffsets, activeDrawer, drawerExpandedMode } =
    appLayoutState ?? {};
  const { contentType, placement, maxContentWidth, navigationWidth, minContentWidth, disableContentPaddings, ...rest } =
    appLayoutProps;
  const { __embeddedViewMode: embeddedViewMode } = rest as any;
  const isMobile = useMobile();
  const toolsOpen = !!activeDrawer;
  const anyPanelOpen = resolvedNavigationOpen || toolsOpen;
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;

  const wrapperElAttributes = {
    className: clsx(styles.root, testutilStyles.root, {
      [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
      [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
      [styles['drawer-expanded-mode']]: drawerExpandedMode,
    }),
    style: {
      minBlockSize: isNested ? '100%' : `calc(100vh - ${placement.insetBlockStart + placement.insetBlockEnd}px)`,
      [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
      [customCssProps.navigationWidth]: `${navigationWidth}px`,
      [customCssProps.toolsWidth]: `${activeDrawerSize}px`,
    },
    'data-awsui-app-layout-widget-loaded': true,
  };

  const mainElAttributes = {
    className: clsx(
      styles['main-landmark'],
      isMobile && anyPanelOpen && styles['unfocusable-mobile'],
      drawerExpandedMode && styles.hidden
    ),
  };

  const getContentWrapperElAttributes = (toolbarProps: ToolbarProps | null, verticalOffsets: VerticalLayoutOutput) => {
    const hasToolbar = !embeddedViewMode && !!toolbarProps;
    return {
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
    getContentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  };
};
