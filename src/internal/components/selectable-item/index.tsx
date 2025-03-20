// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../../base-component';
import { getAnalyticsSelectActionMetadata } from './analytics-metadata/utils';
import { SelectableItemProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export { SelectableItemProps };

const SelectableItem = (
  {
    children: content,
    ariaSelected,
    ariaChecked,
    selected,
    highlighted,
    disabled,
    hasBackground,
    isParent,
    isChild,
    isSelectAll,
    virtualPosition,
    padBottom,
    isNextSelected,
    useInteractiveGroups,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    value,
    afterHeader,
    ...restProps
  }: SelectableItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, ...rest } = getBaseProps(restProps);
  const classNames = clsx(className, styles['selectable-item'], {
    [styles.selected]: selected,
    [styles.highlighted]: highlighted,
    [styles['has-background']]: hasBackground,
    [styles.parent]: isParent,
    [analyticsSelectors.parent]: isParent,
    [styles.child]: isChild,
    [styles['select-all']]: isSelectAll,
    [styles['after-header']]: !!afterHeader,
    [styles['is-keyboard']]: highlightType === 'keyboard',
    [styles.disabled]: disabled,
    [styles.virtual]: virtualPosition !== undefined && !isSelectAll,
    [styles['pad-bottom']]: padBottom,
    [styles['next-item-selected']]: isNextSelected,
    [styles.interactiveGroups]: useInteractiveGroups,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const screenReaderContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // the state of aria-hidden and announcement is not set back because NVDA+Firefox would announce
    // the item which lost highlight
    // set aria-hidden true when there is announcement content, so that screen reader still announce
    // meaningful content when navigate with screen reader cursor
    // imperatively update to avoid announcement made multiple times when content updates
    if (highlighted && screenReaderContent) {
      if (contentRef.current) {
        contentRef.current.setAttribute('aria-hidden', 'true');
      }
      if (screenReaderContentRef.current) {
        screenReaderContentRef.current.textContent = screenReaderContent;
      }
    }
  }, [highlighted, screenReaderContent, contentRef, screenReaderContentRef]);

  const style =
    virtualPosition !== undefined
      ? {
          transform: `translateY(${virtualPosition}px)`,
        }
      : undefined;

  const a11yProperties: Record<string, string | number | boolean | undefined> = {
    'aria-disabled': disabled,
  };

  if (isParent && !useInteractiveGroups) {
    a11yProperties['aria-hidden'] = true;
  }

  if (ariaSelected !== undefined) {
    a11yProperties['aria-selected'] = ariaSelected;
  }

  // Safari+VO needs aria-checked for multi-selection. Otherwise it only announces selected option even though another option is highlighted.
  if (ariaChecked !== undefined) {
    a11yProperties['aria-checked'] = ariaChecked;
  }

  if (ariaPosinset && ariaSetsize) {
    a11yProperties['aria-posinset'] = ariaPosinset;
    a11yProperties['aria-setsize'] = ariaSetsize;
  }

  if (restProps.ariaDescribedby) {
    a11yProperties['aria-describedby'] = restProps.ariaDescribedby;
  }

  return (
    <li
      role="option"
      className={classNames}
      style={style}
      {...a11yProperties}
      {...rest}
      {...(isParent || disabled
        ? {}
        : getAnalyticsMetadataAttribute(getAnalyticsSelectActionMetadata({ isChild, value, ...restProps })))}
    >
      <div className={clsx(styles['option-content'], analyticsSelectors['option-content'])} ref={contentRef}>
        {content}
      </div>
      <div className={styles['measure-strut']} ref={ref} />
      <div className={styles['screenreader-content']} ref={screenReaderContentRef}></div>
    </li>
  );
};

export default React.forwardRef(SelectableItem);
