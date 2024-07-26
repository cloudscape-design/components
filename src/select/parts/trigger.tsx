// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import ButtonTrigger from '../../internal/components/button-trigger';
import Option from '../../internal/components/option';
import { OptionDefinition } from '../../internal/components/option/interfaces';
import { FormFieldValidationControlProps } from '../../internal/context/form-field-context';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { joinStrings } from '../../internal/utils/strings';
import { MultiselectProps } from '../../multiselect/interfaces';
import { SelectProps } from '../interfaces';
import { SelectTriggerProps } from '../utils/use-select';

import styles from './styles.css.js';

export interface TriggerProps extends FormFieldValidationControlProps {
  placeholder: string | undefined;
  disabled: boolean | undefined;
  readOnly?: boolean;
  triggerProps: SelectTriggerProps;
  selectedOption: OptionDefinition | null;
  inlineLabelText?: string;
  isOpen?: boolean;
  triggerVariant?: SelectProps.TriggerVariant | MultiselectProps.TriggerVariant;
  inFilteringToken?: boolean;
  selectedOptions?: ReadonlyArray<OptionDefinition>;
}

const Trigger = React.forwardRef(
  (
    {
      ariaLabelledby,
      ariaDescribedby,
      controlId,
      invalid,
      inlineLabelText,
      warning,
      triggerProps,
      selectedOption,
      selectedOptions,
      triggerVariant,
      inFilteringToken,
      isOpen,
      placeholder,
      disabled,
      readOnly,
    }: TriggerProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const isVisualRefresh = useVisualRefresh();
    const generatedId = useUniqueId();
    const id = controlId ?? generatedId;
    const triggerContentId = useUniqueId('trigger-content-');

    let ariaLabelledbyIds = joinStrings(ariaLabelledby, triggerContentId);

    let triggerContent = null;
    if (triggerVariant === 'tokens') {
      if (selectedOptions?.length) {
        triggerContent = (
          <span
            className={clsx(
              styles['inline-token-trigger'],
              disabled && styles['inline-token-trigger--disabled'],
              isVisualRefresh && styles['visual-refresh']
            )}
          >
            <span className={styles['inline-token-list']}>
              {selectedOptions.map(({ label }, i) => (
                <span key={i} className={styles['inline-token']}>
                  {label}
                </span>
              ))}
            </span>
            <span className={styles['inline-token-counter']} id={triggerContentId}>
              <span className={styles['inline-token-hidden-placeholder']}>{placeholder}</span>
              <span>({selectedOptions.length})</span>
            </span>
          </span>
        );
        ariaLabelledbyIds = ariaLabelledby;
      } else {
        triggerContent = (
          <span aria-disabled="true" className={clsx(styles.placeholder, styles.trigger)} id={triggerContentId}>
            {placeholder}
          </span>
        );
      }
    } else if (!selectedOption) {
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
    const triggerButton = (
      <ButtonTrigger
        {...triggerProps}
        id={id}
        ref={mergedRef}
        pressed={isOpen}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        warning={warning && !invalid}
        inFilteringToken={inFilteringToken}
        inlineTokens={triggerVariant === 'tokens'}
        ariaDescribedby={ariaDescribedby}
        ariaLabelledby={ariaLabelledbyIds}
      >
        {triggerContent}
      </ButtonTrigger>
    );
    return (
      <>
        {inlineLabelText ? (
          <div className={styles['inline-label-wrapper']}>
            <label
              htmlFor={controlId}
              className={clsx(styles['inline-label'], disabled && styles['inline-label-disabled'])}
            >
              {inlineLabelText}
            </label>
            <div className={styles['inline-label-trigger-wrapper']}>{triggerButton}</div>
          </div>
        ) : (
          <>{triggerButton}</>
        )}
      </>
    );
  }
);

export default Trigger;
