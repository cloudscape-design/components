// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { getBreakpointValue } from '../internal/breakpoints';
import Dropdown from '../internal/components/dropdown';
import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { SomeRequired } from '../internal/types';
import { getDropdownMinWidth } from '../internal/utils/get-dropdown-min-width';
import { joinStrings } from '../internal/utils/strings';
import Filter from '../select/parts/filter';
import PlainList from '../select/parts/plain-list';
import Trigger from '../select/parts/trigger';
import VirtualList from '../select/parts/virtual-list';
import { TokenGroupProps } from '../token-group/interfaces';
import InternalTokenGroup from '../token-group/internal';
import { MultiselectProps } from './interfaces';
import { useMultiselect } from './use-multiselect';

import styles from './styles.css.js';

type InternalMultiselectProps = SomeRequired<
  MultiselectProps,
  'options' | 'selectedOptions' | 'filteringType' | 'statusType' | 'keepOpen' | 'hideTokens'
> &
  InternalBaseComponentProps;

type ExtendedToken = TokenGroupProps.Item & { _readOnly: boolean };

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
      inlineLabelText,
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
      __internalRootRef,
      autoFocus,
      enableSelectAll,
      renderOption,
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
      i18nStrings,
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

    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    useResizeObserver(
      () => triggerRef.current,
      entry => entry.borderBoxWidth > 0 && setTriggerWidth(entry.borderBoxWidth)
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
        inlineLabelText={inlineLabelText}
        {...formFieldContext}
        controlId={controlId}
        ariaLabelledby={joinStrings(formFieldContext.ariaLabelledby, ariaLabelId)}
      />
    );

    const tokens: Array<ExtendedToken> = selectedOptions.map(option => ({
      label: option.label,
      disabled,
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
      _readOnly: !!option.disabled,
    }));

    const ListComponent = virtualScroll ? VirtualList : PlainList;

    const showTokens = !hideTokens && !inlineTokens && tokens.length > 0;

    const tokenGroupI18nStrings: TokenGroupProps.I18nStrings = {
      limitShowFewer: i18nStrings?.tokenLimitShowFewer,
      limitShowMore: i18nStrings?.tokenLimitShowMore,
    };

    const dropdownStatus = multiselectProps.dropdownStatus;
    const dropdownProps = multiselectProps.getDropdownProps();
    const hasFilteredOptions = multiselectProps.filteredOptions.length > 0;

    const hasOptions = useRef(options.length > 0);
    hasOptions.current = hasOptions.current || options.length > 0;

    return (
      <div
        {...baseProps}
        ref={__internalRootRef}
        className={clsx(styles.root, baseProps.className)}
        {...multiselectProps.getWrapperProps()}
      >
        <Dropdown
          {...dropdownProps}
          ariaLabelledby={dropdownProps.ariaRole ? joinStrings(ariaLabelId, controlId) : undefined}
          ariaDescribedby={dropdownProps.ariaRole ? (dropdownStatus.content ? footerId : undefined) : undefined}
          open={multiselectProps.isOpen}
          minWidth={getDropdownMinWidth({ expandToViewport, triggerWidth })}
          maxWidth={getBreakpointValue('xxs')} // AWSUI-19898
          trigger={trigger}
          header={filter}
          footer={
            dropdownStatus.isSticky ? (
              <DropdownFooter content={multiselectProps.isOpen ? dropdownStatus.content : null} id={footerId} />
            ) : null
          }
          expandToViewport={expandToViewport}
          // Forces dropdown position recalculation when new options are loaded
          contentKey={hasOptions.current.toString()}
          content={
            <ListComponent
              renderOption={renderOption}
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
              firstOptionSticky={hasFilteredOptions && enableSelectAll}
              isMultiSelect={true}
            />
          }
        />

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
            isItemReadOnly={item => (item as ExtendedToken)._readOnly}
          />
        )}

        <ScreenreaderOnly id={ariaLabelId}>{ariaLabel || inlineLabelText}</ScreenreaderOnly>
      </div>
    );
  }
);

export default InternalMultiselect;
