// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import Dropdown from '../internal/components/dropdown';
import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings';
import Filter from '../select/parts/filter';
import PlainList from '../select/parts/plain-list';
import Trigger from '../select/parts/trigger';
import VirtualList from '../select/parts/virtual-list';
import { TokenGroupProps } from '../token-group/interfaces';
import InternalTokenGroup from '../token-group/internal';
import { MultiselectProps } from './interfaces';
import ToggleAll from './toggle-all';
import { useMultiselect } from './use-multiselect';

import styles from './styles.css.js';

type InternalMultiselectProps = SomeRequired<
  MultiselectProps,
  'options' | 'selectedOptions' | 'filteringType' | 'statusType' | 'keepOpen' | 'hideTokens'
> &
  InternalBaseComponentProps;

const InternalMultiselect = React.forwardRef(
  (
    {
      options,
      filteringType,
      filteringPlaceholder,
      filteringAriaLabel,
      filteringClearAriaLabel,
      ariaRequired,
      placeholder,
      disabled,
      readOnly,
      ariaLabel,
      selectedOptions,
      deselectAriaLabel,
      tokenLimit,
      i18nStrings,
      virtualScroll,
      inlineTokens = false,
      hideTokens,
      expandToViewport,
      tokenLimitShowFewerAriaLabel,
      tokenLimitShowMoreAriaLabel,
      __internalRootRef = null,
      autoFocus,
      enableSelectAll,
      ...restProps
    }: InternalMultiselectProps,
    externalRef: React.Ref<MultiselectProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);
    const i18n = useInternalI18n('multiselect');

    const selfControlId = useUniqueId('trigger');
    const controlId = formFieldContext.controlId ?? selfControlId;
    const ariaLabelId = useUniqueId('multiselect-ariaLabel-');
    const footerId = useUniqueId('multiselect-footer-');

    const [filteringValue, setFilteringValue] = useState('');
    const multiselectProps = useMultiselect({
      options,
      selectedOptions,
      filteringType,
      disabled,
      deselectAriaLabel,
      controlId,
      ariaLabelId,
      footerId,
      filteringValue,
      setFilteringValue,
      externalRef,
      enableSelectAll,
      ...restProps,
    });

    const filter = (
      <Filter
        clearAriaLabel={filteringClearAriaLabel}
        filteringType={filteringType}
        placeholder={filteringPlaceholder}
        ariaLabel={filteringAriaLabel}
        ariaRequired={ariaRequired}
        value={filteringValue}
        {...multiselectProps.getFilterProps()}
      />
    );

    const trigger = (
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        triggerProps={multiselectProps.getTriggerProps(disabled, autoFocus)}
        selectedOption={null}
        selectedOptions={selectedOptions}
        triggerVariant={inlineTokens ? 'tokens' : 'placeholder'}
        isOpen={multiselectProps.isOpen}
        {...formFieldContext}
        controlId={controlId}
        ariaLabelledby={joinStrings(formFieldContext.ariaLabelledby, ariaLabelId)}
      />
    );

    const tokens: TokenGroupProps['items'] = selectedOptions.map(option => ({
      label: option.label,
      disabled: disabled || option.disabled,
      labelTag: option.labelTag,
      description: option.description,
      iconAlt: option.iconAlt,
      iconName: option.iconName,
      iconUrl: option.iconUrl,
      iconSvg: option.iconSvg,
      tags: option.tags,
      dismissLabel: i18n('deselectAriaLabel', deselectAriaLabel?.(option), format =>
        format({ option__label: option.label ?? '' })
      ),
    }));

    const ListComponent = virtualScroll ? VirtualList : PlainList;

    const showTokens = !hideTokens && !inlineTokens && tokens.length > 0;

    const tokenGroupI18nStrings: TokenGroupProps.I18nStrings = {
      limitShowFewer: i18nStrings?.tokenLimitShowFewer,
      limitShowMore: i18nStrings?.tokenLimitShowMore,
    };

    const dropdownStatus = multiselectProps.dropdownStatus;
    const dropdownProps = multiselectProps.getDropdownProps();

    return (
      <div
        {...baseProps}
        ref={__internalRootRef}
        className={clsx(styles.root, baseProps.className)}
        {...multiselectProps.getWrapperProps()}
      >
        <Dropdown
          {...dropdownProps}
          ariaLabelledby={dropdownProps.dropdownContentRole ? joinStrings(ariaLabelId, controlId) : undefined}
          ariaDescribedby={
            dropdownProps.dropdownContentRole ? (dropdownStatus.content ? footerId : undefined) : undefined
          }
          open={multiselectProps.isOpen}
          trigger={trigger}
          header={
            <>
              {filter}
              {enableSelectAll && (
                <ToggleAll
                  onToggle={multiselectProps.toggleAll}
                  highlighted={enableSelectAll && multiselectProps.highlightedIndex === 0}
                  highlightType={multiselectProps.highlightType}
                  state={
                    !options.length || (!multiselectProps.isSomeSelected && !multiselectProps.filteredOptions.length)
                      ? 'disabled'
                      : multiselectProps.isAllSelected
                        ? 'all'
                        : multiselectProps.isSomeSelected
                          ? 'some'
                          : 'none'
                  }
                />
              )}
            </>
          }
          footer={
            dropdownStatus.isSticky ? (
              <DropdownFooter content={multiselectProps.isOpen ? dropdownStatus.content : null} id={footerId} />
            ) : null
          }
          expandToViewport={expandToViewport}
          stretchBeyondTriggerWidth={true}
        >
          <ListComponent
            listBottom={
              !dropdownStatus.isSticky ? (
                <DropdownFooter content={multiselectProps.isOpen ? dropdownStatus.content : null} id={footerId} />
              ) : null
            }
            menuProps={{ ...multiselectProps.getMenuProps(), withHeader: enableSelectAll }}
            getOptionProps={multiselectProps.getOptionProps}
            filteredOptions={multiselectProps.filteredOptions}
            filteringValue={filteringValue}
            ref={multiselectProps.scrollToIndex}
            hasDropdownStatus={dropdownStatus.content !== null}
            checkboxes={true}
            useInteractiveGroups={true}
            screenReaderContent={multiselectProps.announcement}
            highlightType={multiselectProps.highlightType}
          />
        </Dropdown>

        {showTokens && (
          <InternalTokenGroup
            {...multiselectProps.getTokenProps()}
            className={styles.tokens}
            alignment="horizontal"
            limit={tokenLimit}
            items={tokens}
            i18nStrings={tokenGroupI18nStrings}
            limitShowMoreAriaLabel={tokenLimitShowMoreAriaLabel}
            limitShowFewerAriaLabel={tokenLimitShowFewerAriaLabel}
            disableOuterPadding={true}
            readOnly={readOnly}
          />
        )}

        <ScreenreaderOnly id={ariaLabelId}>{ariaLabel}</ScreenreaderOnly>
      </div>
    );
  }
);

export default InternalMultiselect;
