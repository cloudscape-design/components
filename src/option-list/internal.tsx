// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { ItemProps } from '../internal/components/listbox/parts/item';
import PlainList from '../internal/components/listbox/parts/plain-list';
import { multiSelection } from '../internal/components/listbox/selection/multi-selection';
import { singleSelection } from '../internal/components/listbox/selection/single-selection';
import { checkOptionValueField } from '../internal/components/listbox/utils/check-option-value-field';
import { isGroup } from '../internal/components/option/utils/filter-options';
import { prepareOptions } from '../internal/components/option/utils/prepare-options';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { OptionDefinition, OptionGroup } from '../types/option';
import { OptionListProps } from './interfaces';
import { useOptionList } from './use-option-list';

import optionStyles from '../internal/components/option/styles.css.js';
import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalOptionListProps = OptionListProps & InternalBaseComponentProps;
type InternalOption = OptionDefinition | OptionGroup;

// The items the listbox passes to `renderOption`, before they are mapped back to the consumer's options.
type ListboxRenderItem = Parameters<NonNullable<ItemProps['renderOption']>>[0]['item'];
type ListboxGroupItem = Extract<ListboxRenderItem, { type: 'group' }>;
type ListboxRenderOption = (props: { item: ListboxRenderItem }) => React.ReactNode;

const EMPTY_SELECTION: ReadonlyArray<OptionListProps.Option> = [];

const isOptionGroup = (
  option: OptionListProps.Option | OptionListProps.OptionGroup
): option is OptionListProps.OptionGroup => isGroup(option as InternalOption);

/**
 * Converts the public options to the options the shared list renders: the `icon` slot becomes the custom icon of
 * the shared option renderer. `originals` maps each converted option back to the consumer's object, so events and
 * `renderOption` receive the consumer's options.
 */
function toInternalOptions(options: OptionListProps.Options) {
  const originals = new Map<OptionDefinition, OptionListProps.Option>();
  const originalGroups = new Map<OptionGroup, OptionListProps.OptionGroup>();
  // Options and group headers.
  const convert = ({ icon, ...option }: OptionListProps.Option): OptionDefinition => {
    // The shared option renders a custom icon as is, so wrap it in the same class as the built-in icon of Select and
    // Multiselect options, for the same spacing and alignment.
    const internal: OptionDefinition & { __customIcon?: React.ReactNode } = {
      ...option,
      __customIcon: icon && <span className={optionStyles.icon}>{icon}</span>,
    };
    return internal;
  };
  const internalOptions = options.map<InternalOption>(option => {
    if (!isOptionGroup(option)) {
      const internal = convert(option);
      originals.set(internal, option);
      return internal;
    }
    const children = option.options.map(child => {
      const internal = convert(child);
      originals.set(internal, child);
      return internal;
    });
    const group: OptionGroup = { ...convert(option), options: children };
    originalGroups.set(group, option);
    return group;
  });
  return { internalOptions, originals, originalGroups };
}

const InternalOptionList = React.forwardRef(
  (
    {
      options,
      selectionType,
      selectedOptions: controlledSelectedOptions,
      onChange,
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      renderOption,
      renderHighlightedAriaLive,
      i18nStrings,
      __internalRootRef,
      ...restProps
    }: InternalOptionListProps,
    ref: React.Ref<OptionListProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const i18n = useInternalI18n('option-list');

    const { listOptions, parentMap, originals, originalGroups, hasDuplicateValues, hasDuplicateGroupValues } =
      useMemo(() => {
        const { internalOptions, originals, originalGroups } = toInternalOptions(options);
        // Also sets the test indexes that test-utils use to find an option by its position.
        const { flatOptions, parentMap } = prepareOptions(internalOptions, 'none', '');
        const values = flatOptions.filter(option => option.type !== 'parent').map(option => option.option.value);
        // Groups are compared only with groups, so a group may share a value with an option.
        const groupValues = options.filter(isOptionGroup).map(group => group.value);
        return {
          listOptions: flatOptions,
          parentMap,
          originals,
          originalGroups,
          hasDuplicateValues: new Set(values).size !== values.length,
          hasDuplicateGroupValues: new Set(groupValues).size !== groupValues.length,
        };
      }, [options]);

    // Check the options inside groups too, not only the top-level entries.
    checkOptionValueField(
      'OptionList',
      'options',
      listOptions.filter(option => option.type !== 'parent').map(option => option.option)
    );
    if (hasDuplicateValues) {
      warnOnce('OptionList', 'Every option must have a unique `value`. The component may work incorrectly.');
    }
    if (hasDuplicateGroupValues) {
      warnOnce('OptionList', 'Every option group must have a unique `value`. The component may work incorrectly.');
    }

    // Maps an option the list returns back to the consumer's object. Options from `options` map to their originals;
    // anything else already came from the consumer through `selectedOptions`.
    const toPublicOption = useCallback(
      (option: OptionDefinition): OptionListProps.Option => originals.get(option) ?? (option as OptionListProps.Option),
      [originals]
    );
    const toPublicGroup = useCallback(
      (group: OptionGroup): OptionListProps.OptionGroup =>
        originalGroups.get(group) ?? (group as OptionListProps.OptionGroup),
      [originalGroups]
    );

    const [selectedOptions = EMPTY_SELECTION, setSelectedOptions] = useControllable(
      controlledSelectedOptions,
      onChange,
      EMPTY_SELECTION,
      { componentName: 'OptionList', controlledProp: 'selectedOptions', changeHandler: 'onChange' }
    );

    const selection =
      selectionType === 'multi'
        ? multiSelection(selectedOptions, { options: listOptions, interactiveGroups: true })
        : singleSelection(selectedOptions);

    const { listRef, listProps, scrollToIndex, highlightType, announcement, getOptionProps, getRootProps } =
      useOptionList({
        options: listOptions,
        selection,
        onSelect: option => {
          const nextSelectedOptions = selection.getNextSelection(option).map(toPublicOption);
          setSelectedOptions(nextSelectedOptions);
          fireNonCancelableEvent(onChange, { selectedOptions: nextSelectedOptions });
        },
        getParent: option => parentMap.get(option)?.option as OptionGroup | undefined,
        selectedAriaLabel: i18n('i18nStrings.selectedAriaLabel', i18nStrings?.selectedAriaLabel),
        // The consumer receives its own option and group objects, as with `renderOption`.
        renderHighlightedAriaLive:
          renderHighlightedAriaLive &&
          ((option, group) =>
            renderHighlightedAriaLive(
              isGroup(option) ? toPublicGroup(option) : toPublicOption(option),
              group && toPublicGroup(group)
            )),
      });
    useForwardFocus(ref, listRef);

    const renderOriginalOption = useMemo<ListboxRenderOption | undefined>(() => {
      if (!renderOption) {
        return undefined;
      }
      const toGroupItem = (item: ListboxGroupItem): OptionListProps.OptionGroupItem => ({
        ...item,
        option: toPublicGroup(item.option),
      });
      return ({ item }) => {
        if (item.type === 'item') {
          const parent = item.parent && toGroupItem(item.parent);
          return renderOption({ item: { ...item, option: toPublicOption(item.option), parent } });
        }
        if (item.type === 'group') {
          return renderOption({ item: toGroupItem(item) });
        }
        // The listbox renders only options and group headers; it has no trigger or select-all item.
        return null;
      };
    }, [renderOption, toPublicOption, toPublicGroup]);

    return (
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles.root, testClasses.root)}
        ref={__internalRootRef}
        {...getRootProps()}
      >
        <PlainList
          ref={scrollToIndex}
          listProps={{ ...listProps, ariaLabel, ariaLabelledby, ariaDescribedby }}
          filteredOptions={listOptions}
          filteringValue=""
          highlightType={highlightType}
          selectionType={selection.selectionType}
          isMultiSelect={listProps.isMultiSelect}
          screenReaderContent={announcement}
          renderOption={renderOriginalOption}
          scrollStrategy="ancestors"
          getOptionProps={(option, index) => ({
            ...getOptionProps(option, index),
            // There is no dropdown border above the list, so the first item has no top divider.
            hideTopDivider: index === 0,
            className: option.type === 'parent' ? testClasses['group-header'] : testClasses.option,
            'data-value': option.option.value,
          })}
        />
      </div>
    );
  }
);

export default InternalOptionList;
