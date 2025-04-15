// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import customCssProps from '../../../../internal/generated/custom-css-properties';
import { useMobile } from '../../../../internal/hooks/use-mobile';
import { createWidgetizedFunction } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import testutilStyles from '../../../test-classes/styles.css.js';
import styles from '../styles.css.js';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

const useSkeletonSlotsAttributes = (props: SkeletonLayoutProps) => {
  const {
    rootRef,
    contentType,
    isNested,
    placement,
    maxContentWidth,
    navigationWidth,
    toolsWidth,
    disableContentPaddings,
    style,
    navigationOpen,
    toolsOpen,
  } = props;
  const isMobile = useMobile();
  const anyPanelOpen = navigationOpen || toolsOpen;
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;
  const wrapperElAttributes = {
    ref: rootRef,
    className: clsx(styles.root, testutilStyles.root, {
      [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
      [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
    }),
    style: {
      minBlockSize: isNested ? '100%' : `calc(100vh - ${placement.insetBlockStart + placement.insetBlockEnd}px)`,
      [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
      [customCssProps.navigationWidth]: `${navigationWidth}px`,
      [customCssProps.toolsWidth]: `${toolsWidth}px`,
    },
  };

  const mainElAttributes = {
    className: clsx(styles['main-landmark'], isMobile && anyPanelOpen && styles['unfocusable-mobile']),
  };

  const contentWrapperElAttributes = {
    className: clsx(styles.main, { [styles['main-disable-paddings']]: disableContentPaddings }),
    style: style,
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
