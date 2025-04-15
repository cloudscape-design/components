// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import customCssProps from '../../../../internal/generated/custom-css-properties';
import { useMergeRefs } from '../../../../internal/hooks/use-merge-refs';
import { useMobile } from '../../../../internal/hooks/use-mobile';
import globalVars from '../../../../internal/styles/global-vars';
import { createWidgetizedFunction } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import testutilStyles from '../../../test-classes/styles.css.js';
import styles from '../styles.css.js';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

const useSkeletonSlotsAttributes = ({ appLayoutProps, appLayoutState }: SkeletonLayoutProps) => {
  const {
    intersectionObserverRef,
    rootRef,
    isNested,
    activeDrawerSize,
    resolvedNavigationOpen,
    splitPanelOffsets,
    hasToolbar,
    verticalOffsets,
    activeDrawer,
  } = appLayoutState;
  const { contentType, placement, maxContentWidth, navigationWidth, minContentWidth, disableContentPaddings } =
    appLayoutProps;
  const ref = useMergeRefs(intersectionObserverRef, rootRef);
  const isMobile = useMobile();
  const toolsOpen = !!activeDrawer;
  const anyPanelOpen = resolvedNavigationOpen || toolsOpen;
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;
  const wrapperElAttributes = {
    ref,
    className: clsx(styles.root, testutilStyles.root, {
      [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
      [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
    }),
    style: {
      minBlockSize: isNested ? '100%' : `calc(100vh - ${placement.insetBlockStart + placement.insetBlockEnd}px)`,
      [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
      [customCssProps.navigationWidth]: `${navigationWidth}px`,
      [customCssProps.toolsWidth]: `${activeDrawerSize}px`,
    },
  };

  const mainElAttributes = {
    className: clsx(styles['main-landmark'], isMobile && anyPanelOpen && styles['unfocusable-mobile']),
  };

  const contentWrapperElAttributes = {
    className: clsx(styles.main, { [styles['main-disable-paddings']]: disableContentPaddings }),
    style: {
      paddingBlockEnd: splitPanelOffsets.mainContentPaddingBlockEnd,
      ...(hasToolbar || !isNested
        ? {
            [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`,
            [globalVars.stickyVerticalBottomOffset]: `${splitPanelOffsets.stickyVerticalBottomOffset}px`,
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

export const createWidgetizedUseSkeletonSlotsAttrributes = createWidgetizedFunction(useSkeletonSlotsAttributes);
