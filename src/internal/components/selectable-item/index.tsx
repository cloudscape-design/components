// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import { HighlightType } from '../options-list/utils/use-highlight-option.js';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from './analytics-metadata/interfaces';

import optionAnalyticsSelectors from './../option/analytics-metadata/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface ItemDataAttributes {
  'data-group-index'?: string;
  'data-child-index'?: string;
  'data-in-group-index'?: string;
  'data-test-index'?: string;
}

const getAnayticsMetadata = ({
  isChild,
  value,
  ...restProps
}: Partial<SelectableItemProps>): GeneratedAnalyticsMetadataSelectableItemSelect => {
  const dataAttributes = restProps as ItemDataAttributes;

  const analyticsMetadata: GeneratedAnalyticsMetadataSelectableItemSelect = {
    action: 'select',
    detail: {
      label: {
        selector: [`.${optionAnalyticsSelectors.label}`, `.${analyticsSelectors['option-content']}`],
      },
    },
  };

  let position = undefined;
  if (
    (isChild && dataAttributes['data-group-index'] && dataAttributes['data-in-group-index']) ||
    dataAttributes['data-child-index']
  ) {
    position = `${dataAttributes['data-group-index']},${dataAttributes['data-in-group-index'] || dataAttributes['data-child-index']}`;
  } else if (dataAttributes['data-test-index']) {
    position = `${dataAttributes['data-test-index']}`;
  }
  if (position) {
    analyticsMetadata.detail.position = position;
  }
  if (value) {
    analyticsMetadata.detail.value = value;
  }
  if (isChild) {
    analyticsMetadata.detail.groupLabel = {
      root: 'body',
      selector: `.${analyticsSelectors.parent}[data-group-index="${dataAttributes['data-group-index']}"] .${analyticsSelectors['option-content']}`,
    };
  }
  return analyticsMetadata;
};

export type SelectableItemProps = BaseComponentProps & {
  children: React.ReactNode;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  hasBackground?: boolean;
  isParent?: boolean;
  isChild?: boolean;
  virtualPosition?: number;
  padBottom?: boolean;
  isNextSelected?: boolean;
  useInteractiveGroups?: boolean;
  screenReaderContent?: string;
  ariaPosinset?: number;
  ariaSetsize?: number;
  highlightType?: HighlightType['type'];
  ariaDescribedby?: string;
  value?: string;
} & ({ ariaSelected?: boolean; ariaChecked?: never } | { ariaSelected?: never; ariaChecked?: boolean | 'mixed' });

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
    virtualPosition,
    padBottom,
    isNextSelected,
    useInteractiveGroups,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    value,
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
    [styles['is-keyboard']]: highlightType === 'keyboard',
    [styles.disabled]: disabled,
    [styles.virtual]: virtualPosition !== undefined,
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
        : getAnalyticsMetadataAttribute(getAnayticsMetadata({ isChild, value, ...restProps })))}
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
