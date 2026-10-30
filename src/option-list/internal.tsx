// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import Listbox, { ListboxProps } from '../internal/components/listbox';
import { multiSelection } from '../internal/components/listbox/selection/multi-selection';
import { singleSelection } from '../internal/components/listbox/selection/single-selection';
import { useListbox } from '../internal/components/listbox/use-listbox';
import { checkOptionValueField } from '../internal/components/listbox/utils/check-option-value-field';
import { DropdownOption } from '../internal/components/option/interfaces';
import { isGroup } from '../internal/components/option/utils/filter-options';
import { flattenOptions } from '../internal/components/option/utils/flatten-options';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { OptionDefinition, OptionGroup } from '../types/option';
import { OptionListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalOptionListProps = OptionListProps & InternalBaseComponentProps;
type InternalOption = OptionDefinition | OptionGroup;

// The items the listbox passes to `renderOption`, before they are mapped back to the consumer's options.
type ListboxRenderItem = Parameters<NonNullable<ListboxProps['renderOption']>>[0]['item'];
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
  // Options and group headers. A group's `value` is optional; an option's is required by its type.
  const convert = ({
    icon,
    ...option
  }: Omit<OptionListProps.Option, 'value'> & { value?: string }): OptionDefinition => {
    // The shared option renders a custom icon as is, so the wrapper adds the spacing before the content.
    const internal: OptionDefinition & { __customIcon?: React.ReactNode } = {
      ...option,
      __customIcon: icon && <span className={styles.icon}>{icon}</span>,
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

    const { listOptions, parentMap, originals, originalGroups, leafIndexes } = useMemo(() => {
      const { internalOptions, originals, originalGroups } = toInternalOptions(options);
      const { flatOptions, parentMap } = flattenOptions(internalOptions);
      const leafIndexes = new Map<DropdownOption, number>();
      flatOptions.filter(option => option.type !== 'parent').forEach((option, index) => leafIndexes.set(option, index));
      return { listOptions: flatOptions, parentMap, originals, originalGroups, leafIndexes };
    }, [options]);

    const leafOptions = listOptions.filter(option => option.type !== 'parent').map(option => option.option);
    checkOptionValueField('OptionList', 'options', leafOptions);
    const values = leafOptions.map(option => option.value);
    if (new Set(values).size !== values.length) {
      warnOnce('OptionList', 'Every option must have a unique `value`. The component may work incorrectly.');
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

    const controller = useListbox({
      options: listOptions,
      selection,
      onChange: next => {
        const nextSelectedOptions = next.map(toPublicOption);
        setSelectedOptions(nextSelectedOptions);
        fireNonCancelableEvent(onChange, { selectedOptions: nextSelectedOptions });
      },
      getParent: option => parentMap.get(option)?.option as OptionGroup | undefined,
      // The consumer receives its own option and group objects, as with `renderOption`.
      renderHighlightedAriaLive:
        renderHighlightedAriaLive &&
        ((option, group) => renderHighlightedAriaLive(toPublicOption(option), group && toPublicGroup(group))),
      i18nStrings: { selectedAriaLabel: i18n('i18nStrings.selectedAriaLabel', i18nStrings?.selectedAriaLabel) },
    });
    useForwardFocus(ref, controller.listRef);

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

    // The root, not the list, clears the highlight when the pointer leaves, so the leave covers the whole component.
    const { onMouseLeave } = controller.getListProps();

    return (
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles.root, testClasses.root)}
        ref={__internalRootRef}
        onKeyDown={controller.onTypeAhead}
        onMouseLeave={onMouseLeave}
      >
        <Listbox
          controller={controller}
          options={listOptions}
          renderOption={renderOriginalOption}
          listProps={{ onMouseLeave: undefined, ariaLabel, ariaLabelledby, ariaDescribedby }}
          getOptionProps={(option, index) => {
            const leafIndex = leafIndexes.get(option);
            return {
              ...controller.getOptionProps(option, index),
              // Inline, there is no dropdown border above the list, so the first item has no top divider.
              hideTopDivider: index === 0,
              className: leafIndex === undefined ? testClasses['group-header'] : testClasses.option,
              // 1-based option position, used by test-utils. Group headers are not counted.
              'data-option-index': leafIndex === undefined ? undefined : leafIndex + 1,
              'data-value': option.option.value,
            };
          }}
        />
      </div>
    );
  }
);

export default InternalOptionList;
