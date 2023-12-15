// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useLayoutEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import { HighlightType } from '../options-list/utils/use-highlight-option.js';

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

  return (
    <li role="option" className={classNames} style={style} {...a11yProperties} {...rest}>
      <div className={styles['option-content']} ref={contentRef}>
        {content}
      </div>
      <div className={styles['measure-strut']} ref={ref} />
      <div className={styles['screenreader-content']} ref={screenReaderContentRef}></div>
    </li>
  );
};

export default React.forwardRef(SelectableItem);
