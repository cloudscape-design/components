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
import { checkOptionValueField } from '../select/utils/check-option-value-field.js';
import { findOptionIndex } from '../select/utils/connect-options';
import { useAnnouncement } from '../select/utils/use-announcement';
import { useNativeSearch } from '../select/utils/use-native-search';
import { useSelect } from '../select/utils/use-select';
import { OptionDefinition } from '../types/option';
import { OptionListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalOptionListProps = OptionListProps & InternalBaseComponentProps;

const EMPTY_SELECTION: ReadonlyArray<OptionDefinition> = [];

function InternalOptionList(
  {
    options,
    selectionType,
    selectedOptions: controlledSelectedOptions,
    onChange,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    i18nStrings,
    __internalRootRef,
    ...restProps
  }: InternalOptionListProps,
  ref: React.Ref<OptionListProps.Ref>
) {
  checkOptionValueField('OptionList', 'options', options);

  const baseProps = getBaseProps(restProps);
  const i18n = useInternalI18n('select');
  const selectedAriaLabel = i18n('selectedAriaLabel', i18nStrings?.selectedAriaLabel);
  const isMulti = selectionType === 'multi';
  // There are no groups. The shared engine uses this flag to render Multiselect-style rows, so it follows multi selection.
  const useInteractiveGroups = isMulti;

  const [rawSelectedOptions = EMPTY_SELECTION, setSelectedOptions] = useControllable(
    controlledSelectedOptions,
    onChange,
    EMPTY_SELECTION,
    { componentName: 'OptionList', controlledProp: 'selectedOptions', changeHandler: 'onChange' }
  );
  const selectedOptions = useMemo(
    () => (isMulti ? rawSelectedOptions : rawSelectedOptions.slice(0, 1)),
    [isMulti, rawSelectedOptions]
  );

  const dropdownOptions = useMemo(
    () => options.map<DropdownOption>(option => ({ option, disabled: option.disabled })),
    [options]
  );

  if (isDevelopment) {
    const values = options.map(option => option.value);
    if (new Set(values).size !== values.length) {
      warnOnce('OptionList', 'Every option must have a unique `value`. The component may work incorrectly.');
    }
  }

  const updateSelectedOption = useCallback(
    (option: OptionDefinition) => {
      let nextSelectedOptions: ReadonlyArray<OptionDefinition>;
      if (!isMulti) {
        // Same as Select: choosing the selected option again keeps it selected.
        nextSelectedOptions = [option];
      } else {
        // Same as Multiselect: toggle the option.
        const index = findOptionIndex(selectedOptions, option);
        nextSelectedOptions = index > -1 ? selectedOptions.filter((_, i) => i !== index) : [...selectedOptions, option];
      }
      setSelectedOptions(nextSelectedOptions);
      fireNonCancelableEvent(onChange, { selectedOptions: nextSelectedOptions });
    },
    [isMulti, onChange, selectedOptions, setSelectedOptions]
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
    options: dropdownOptions,
    filteringType: 'none',
    keepOpen: true,
    embedded: true,
    externalRef: null,
    fireLoadItems: () => {},
    statusType: 'finished',
    useInteractiveGroups,
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
    },
    onBlur: event => {
      setIsFocused(false);
      internalMenuProps.onBlur?.(event);
    },
  };
  useForwardFocus(ref, menuProps.ref);

  const onTypeAhead = useNativeSearch({
    isEnabled: true,
    options: dropdownOptions,
    highlightOption,
    highlightedOption: highlightedOption?.option,
    useInteractiveGroups,
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
            // Inline, there is no dropdown border above the list, so the first item has no top divider.
            hideTopDivider: index === 0,
            className: testClasses.option,
            // 1-based option position, used by test-utils.
            'data-option-index': index + 1,
            'data-value': option.option.value,
          };
        }}
        filteredOptions={dropdownOptions}
        filteringValue=""
        highlightType={highlightType}
        checkboxes={isMulti}
        useInteractiveGroups={useInteractiveGroups}
        screenReaderContent={showHighlight ? announcement : undefined}
        isMultiSelect={isMulti}
      />
    </div>
  );
}

export default React.forwardRef(InternalOptionList);
