// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useFormFieldContext } from '../contexts/form-field.js';
import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { SomeRequired } from '../internal/types.js';
import PlainList from '../select/parts/plain-list.js';
import VirtualList from '../select/parts/virtual-list.js';
import { MultiselectProps } from './interfaces.js';
import { useMultiselect } from './use-multiselect.js';

import styles from './styles.css.js';

export type EmbeddedMultiselectProps = SomeRequired<
  Pick<
    MultiselectProps,
    | 'options'
    | 'selectedOptions'
    | 'ariaLabel'
    | 'filteringType'
    | 'deselectAriaLabel'
    | 'virtualScroll'
    | 'statusType'
    | 'controlId'
    | 'onChange'
    | 'onLoadItems'
    | 'loadingText'
    | 'finishedText'
    | 'errorText'
    | 'recoveryText'
    | 'empty'
    | 'noMatch'
  >,
  'options' | 'selectedOptions' | 'filteringType' | 'statusType'
> & { filteringText?: string };

const EmbeddedMultiselect = React.forwardRef(
  (
    {
      options,
      filteringType,
      ariaLabel,
      selectedOptions,
      deselectAriaLabel,
      virtualScroll,
      filteringText = '',
      ...restProps
    }: EmbeddedMultiselectProps,
    externalRef: React.Ref<MultiselectProps.Ref>
  ) => {
    const formFieldContext = useFormFieldContext(restProps);
    const ariaLabelId = useUniqueId('multiselect-ariaLabel-');
    const footerId = useUniqueId('multiselect-footer-');
    const multiselectProps = useMultiselect({
      options,
      selectedOptions,
      filteringType,
      disabled: false,
      deselectAriaLabel,
      controlId: formFieldContext.controlId,
      ariaLabelId,
      footerId,
      filteringValue: filteringText,
      externalRef,
      keepOpen: true,
      embedded: true,
      ...restProps,
    });

    const ListComponent = virtualScroll ? VirtualList : PlainList;
    const status = multiselectProps.dropdownStatus;

    return (
      <div className={styles.embedded}>
        <ListComponent
          menuProps={multiselectProps.getMenuProps()}
          getOptionProps={multiselectProps.getOptionProps}
          filteredOptions={multiselectProps.filteredOptions}
          filteringValue={filteringText}
          ref={multiselectProps.scrollToIndex}
          hasDropdownStatus={status.content !== null}
          checkboxes={true}
          useInteractiveGroups={true}
          screenReaderContent={multiselectProps.announcement}
          highlightType={multiselectProps.highlightType}
        />

        {status.content && <DropdownFooter content={status.content} id={footerId} />}

        <ScreenreaderOnly id={ariaLabelId}>{ariaLabel}</ScreenreaderOnly>
      </div>
    );
  }
);

export default EmbeddedMultiselect;
