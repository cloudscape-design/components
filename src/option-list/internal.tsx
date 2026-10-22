// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import Listbox from '../internal/components/listbox';
import { multiSelection } from '../internal/components/listbox/selection/multi-selection';
import { singleSelection } from '../internal/components/listbox/selection/single-selection';
import { useListbox } from '../internal/components/listbox/use-listbox';
import { checkOptionValueField } from '../internal/components/listbox/utils/check-option-value-field';
import { DropdownOption } from '../internal/components/option/interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { OptionDefinition } from '../types/option';
import { OptionListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalOptionListProps = OptionListProps & InternalBaseComponentProps;

const EMPTY_SELECTION: ReadonlyArray<OptionDefinition> = [];

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
      i18nStrings,
      __internalRootRef,
      ...restProps
    }: InternalOptionListProps,
    ref: React.Ref<OptionListProps.Ref>
  ) => {
    checkOptionValueField('OptionList', 'options', options);

    const baseProps = getBaseProps(restProps);
    const i18n = useInternalI18n('select');

    const values = options.map(option => option.value);
    if (new Set(values).size !== values.length) {
      warnOnce('OptionList', 'Every option must have a unique `value`. The component may work incorrectly.');
    }

    const [selectedOptions = EMPTY_SELECTION, setSelectedOptions] = useControllable(
      controlledSelectedOptions,
      onChange,
      EMPTY_SELECTION,
      { componentName: 'OptionList', controlledProp: 'selectedOptions', changeHandler: 'onChange' }
    );

    const listOptions = useMemo(
      () => options.map<DropdownOption>(option => ({ option, disabled: option.disabled })),
      [options]
    );

    const selection =
      selectionType === 'multi'
        ? multiSelection(selectedOptions, { options: listOptions })
        : singleSelection(selectedOptions);

    const controller = useListbox({
      options: listOptions,
      selection,
      onChange: next => {
        setSelectedOptions(next);
        fireNonCancelableEvent(onChange, { selectedOptions: next });
      },
      i18nStrings: { selectedAriaLabel: i18n('selectedAriaLabel', i18nStrings?.selectedAriaLabel) },
    });
    useForwardFocus(ref, controller.listRef);

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
          // OptionList's listbox is never its own scroll container, so the highlighted option is scrolled into
          // view through all scrollable ancestors.
          scrollStrategy="nearest"
          listProps={{ onMouseLeave: undefined, ariaLabel, ariaLabelledby, ariaDescribedby }}
          getOptionProps={(option, index) => ({
            ...controller.getOptionProps(option, index),
            // Inline, there is no dropdown border above the list, so the first item has no top divider.
            hideTopDivider: index === 0,
            className: testClasses.option,
            // 1-based option position, used by test-utils.
            'data-option-index': index + 1,
            'data-value': option.option.value,
          })}
        />
      </div>
    );
  }
);

export default InternalOptionList;
