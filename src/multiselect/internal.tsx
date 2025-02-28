// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component/index.js';
import Dropdown from '../internal/components/dropdown/index.js';
import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { useFormFieldContext } from '../internal/context/form-field-context.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { SomeRequired } from '../internal/types.js';
import { joinStrings } from '../internal/utils/strings/index.js';
import Filter from '../select/parts/filter.js';
import PlainList from '../select/parts/plain-list.js';
import Trigger from '../select/parts/trigger.js';
import VirtualList from '../select/parts/virtual-list.js';
import { TokenGroupProps } from '../token-group/interfaces.js';
import InternalTokenGroup from '../token-group/internal.js';
import { MultiselectProps } from './interfaces.js';
import { useMultiselect } from './use-multiselect.js';

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
          header={filter}
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
            menuProps={multiselectProps.getMenuProps()}
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
