// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import clsx from 'clsx';
import ButtonTrigger from '../../internal/components/button-trigger';
import { SelectProps } from '../interfaces';
import styles from './styles.css.js';
import { OptionDefinition } from '../../internal/components/option/interfaces';
import { FormFieldValidationControlProps } from '../../internal/context/form-field-context';
import Option from '../../internal/components/option';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { SelectTriggerProps } from '../utils/use-select';
import { joinStrings } from '../../internal/utils/strings';

export interface TriggerProps extends FormFieldValidationControlProps {
  placeholder: string | undefined;
  disabled: boolean | undefined;
  triggerProps: SelectTriggerProps;
  selectedOption: OptionDefinition | null;
  isOpen?: boolean;
  triggerVariant?: SelectProps.TriggerVariant;
  inFilteringToken?: boolean;
}

const Trigger = React.forwardRef(
  (
    {
      ariaLabelledby,
      ariaDescribedby,
      controlId,
      invalid,
      triggerProps,
      selectedOption,
      triggerVariant,
      inFilteringToken,
      isOpen,
      placeholder,
      disabled,
    }: TriggerProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const generatedId = useUniqueId();
    const id = controlId ?? generatedId;
    const triggerContentId = useUniqueId('trigger-content-');

    let triggerContent = null;
    if (!selectedOption) {
      triggerContent = (
        <span aria-disabled="true" className={clsx(styles.placeholder, styles.trigger)} id={triggerContentId}>
          {placeholder}
        </span>
      );
    } else if (triggerVariant === 'option') {
      triggerContent = <Option id={triggerContentId} option={{ ...selectedOption, disabled }} triggerVariant={true} />;
    } else {
      triggerContent = (
        <span id={triggerContentId} className={styles.trigger}>
          {selectedOption.label || selectedOption.value}
        </span>
      );
    }

    const mergedRef = useMergeRefs(triggerProps.ref, ref);

    return (
      <ButtonTrigger
        {...triggerProps}
        id={id}
        ref={mergedRef}
        pressed={isOpen}
        disabled={disabled}
        invalid={invalid}
        inFilteringToken={inFilteringToken}
        ariaDescribedby={ariaDescribedby}
        ariaLabelledby={joinStrings(ariaLabelledby, triggerContentId)}
      >
        {triggerContent}
      </ButtonTrigger>
    );
  }
);

export default Trigger;
