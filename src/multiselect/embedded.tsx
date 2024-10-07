// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DropdownFooter from '../internal/components/dropdown-footer/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SomeRequired } from '../internal/types';
import PlainList from '../select/parts/plain-list';
import VirtualList from '../select/parts/virtual-list';
import { MultiselectProps } from './interfaces';
import { useMultiselect } from './use-multiselect';

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
  >,
  'options' | 'selectedOptions' | 'filteringType' | 'statusType' | 'controlId'
> & { filteringText?: string };

const EmbeddedMultiselect = React.forwardRef(
  (
    {
      controlId,
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
    const ariaLabelId = useUniqueId('multiselect-ariaLabel-');
    const footerId = useUniqueId('multiselect-footer-');

    const multiselectProps = useMultiselect({
      options,
      selectedOptions,
      filteringType,
      disabled: false,
      deselectAriaLabel,
      controlId,
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
      <div
        role="group"
        className={styles.embedded}
        aria-labelledby={ariaLabelId}
        aria-describedby={status.content ? footerId : undefined}
      >
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
