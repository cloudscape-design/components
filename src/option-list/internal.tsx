// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { DropdownOption } from '../internal/components/option/interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { isDevelopment } from '../internal/is-development';
import PlainList, { SelectListProps } from '../select/parts/plain-list';
import { useAnnouncement } from '../select/utils/use-announcement';
import { useNativeSearch } from '../select/utils/use-native-search';
import { useSelect } from '../select/utils/use-select';
import { OptionDefinition } from '../types/option';
import { OptionListProps } from './interfaces';

import optionStyles from '../internal/components/option/styles.css.js';
import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalOptionListProps<T = any> = OptionListProps<T> & InternalBaseComponentProps;

const EMPTY_SELECTION: ReadonlyArray<string> = [];

// Converts the List-style item result into the option shape the internal options list renders.
// A string `content` becomes the option label (used for the title tooltip, type-ahead and the live announcement);
// any other node is rendered as `labelContent`.
function toDropdownOption({
  id,
  content,
  secondaryContent,
  icon,
  labelTag,
  tags,
  disabled,
  disabledReason,
}: OptionListProps.RenderItemResult): DropdownOption {
  const isStringContent = typeof content === 'string';
  const option: OptionDefinition & { __customIcon?: React.ReactNode } = {
    value: id,
    label: isStringContent ? content : '',
    labelContent: isStringContent ? undefined : content,
    description: secondaryContent,
    labelTag,
    tags,
    // Wrapped in the option icon slot so a custom icon gets the same spacing as `iconName` in Select options.
    __customIcon: icon ? <span className={optionStyles.icon}>{icon}</span> : undefined,
    disabled,
    disabledReason,
  };
  // The engine reads `disabled` from the wrapper to block selection, and from the option for styling.
  return { option, disabled };
}

function InternalOptionList<T>(
  {
    items,
    renderItem,
    selectionType,
    selectedIds: controlledSelectedIds,
    onChange,
    onFocus,
    onBlur,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    i18nStrings,
    __internalRootRef,
    ...restProps
  }: InternalOptionListProps<T>,
  ref: React.Ref<OptionListProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const i18n = useInternalI18n('select');
  const selectedAriaLabel = i18n('selectedAriaLabel', i18nStrings?.selectedAriaLabel);
  const isMulti = selectionType === 'multi';

  const [selectedIds = EMPTY_SELECTION, setSelectedIds] = useControllable(
    controlledSelectedIds,
    onChange,
    EMPTY_SELECTION,
    { componentName: 'OptionList', controlledProp: 'selectedIds', changeHandler: 'onChange' }
  );

  const options = useMemo(() => items.map(item => toDropdownOption(renderItem(item))), [items, renderItem]);

  if (isDevelopment) {
    const ids = options.map(({ option }) => option.value);
    if (new Set(ids).size !== ids.length) {
      warnOnce('OptionList', 'Every item must have a unique `id`. The component may work incorrectly.');
    }
  }

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedOptions = useMemo(
    () => options.map(({ option }) => option as OptionDefinition).filter(option => selectedIdsSet.has(option.value!)),
    [options, selectedIdsSet]
  );

  const updateSelectedOption = useCallback(
    (option: OptionDefinition) => {
      const id = option.value!;
      let nextSelectedIds: ReadonlyArray<string>;
      if (!isMulti) {
        // Same as Select: choosing the selected option again keeps it selected.
        nextSelectedIds = [id];
      } else if (selectedIdsSet.has(id)) {
        nextSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
      } else {
        nextSelectedIds = [...selectedIds, id];
      }
      setSelectedIds(nextSelectedIds);
      fireNonCancelableEvent(onChange, { selectedIds: nextSelectedIds });
    },
    [isMulti, onChange, selectedIds, selectedIdsSet, setSelectedIds]
  );

  const {
    highlightType,
    highlightedOption,
    highlightedIndex,
    getMenuProps,
    getOptionProps,
    highlightOption,
    announceSelected,
  } = useSelect({
    selectedOptions,
    updateSelectedOption,
    options,
    filteringType: 'none',
    keepOpen: true,
    embedded: true,
    externalRef: null,
    fireLoadItems: () => {},
    statusType: 'finished',
  });

  const [isFocused, setIsFocused] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);

  const internalMenuProps = getMenuProps();
  const menuProps: typeof internalMenuProps = {
    ...internalMenuProps,
    onFocus: event => {
      setIsFocused(true);
      internalMenuProps.onFocus?.(event);
      // The engine highlights an option "with the mouse" on mount. When focus arrives from the keyboard,
      // re-apply that highlight as a keyboard highlight so the focus ring is visible.
      if (!isPointerInside && highlightedOption && highlightType.type === 'mouse') {
        highlightOption(highlightedOption);
      }
      fireNonCancelableEvent(onFocus);
    },
    onBlur: event => {
      setIsFocused(false);
      internalMenuProps.onBlur?.(event);
      fireNonCancelableEvent(onBlur);
    },
  };
  useForwardFocus(ref, menuProps.ref);

  const onTypeAhead = useNativeSearch({
    isEnabled: true,
    options,
    highlightOption,
    highlightedOption: highlightedOption?.option,
    useInteractiveGroups: false,
  });

  const announcement = useAnnouncement({
    announceSelected,
    highlightedOption,
    getParent: () => undefined,
    selectedAriaLabel,
  });

  const scrollToIndex = useRef<SelectListProps.SelectListRef>(null);
  useEffect(() => {
    scrollToIndex.current?.(highlightedIndex);
  }, [highlightedIndex]);

  // The shared select engine treats the list as an open dropdown and highlights an option on mount.
  // Inline, a highlight is only meaningful while the user interacts with the list, so it is shown
  // only while the list has focus or the pointer is over it.
  const showHighlight = isFocused || isPointerInside;

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, testClasses.root)}
      ref={__internalRootRef}
      onKeyDown={onTypeAhead}
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
    >
      <PlainList
        ref={scrollToIndex}
        menuProps={{ ...menuProps, embedded: true, ariaLabel, ariaLabelledby, ariaDescribedby }}
        getOptionProps={(option, index) => {
          const optionProps = getOptionProps(option, index);
          return {
            ...optionProps,
            highlighted: showHighlight && optionProps.highlighted,
            className: testClasses.option,
            'data-testid': option.option.value,
          };
        }}
        filteredOptions={options}
        filteringValue=""
        highlightType={highlightType}
        checkboxes={isMulti}
        screenReaderContent={showHighlight ? announcement : undefined}
        isMultiSelect={isMulti}
      />
    </div>
  );
}

export default React.forwardRef(InternalOptionList) as <T>(
  props: InternalOptionListProps<T> & { ref?: React.Ref<OptionListProps.Ref> }
) => JSX.Element;
