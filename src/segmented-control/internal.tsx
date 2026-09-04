// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalFormField from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import { useControlGroupContext } from '../internal/context/control-group-context';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalSelect, { InternalSelectProps } from '../select/internal';
import { SegmentedControlProps } from './interfaces';
import InternalSegmentedControlComponent from './internal-segmented-control';

import styles from './styles.css.js';

type InternalSegmentedControlProps = SegmentedControlProps & InternalBaseComponentProps;

export default function InternalSegmentedControl({
  selectedId,
  options,
  label,
  ariaLabelledby,
  onChange,
  __internalRootRef,
  style,
  ...props
}: InternalSegmentedControlProps) {
  const baseProps = getBaseProps(props);

  // When inside a ControlGroup, the segment wrapper fuses with its neighbors
  // (squared interior corners + collapsed seam). Its position decides which sides.
  const { isInControlGroup, position: controlGroupPosition } = useControlGroupContext();

  const selectOptions = (options || []).map(option => {
    const label = option.text || option.iconAlt;
    return { ...option, label, value: option.id };
  });

  const selectedOptions = selectOptions.filter(option => {
    return option.value === selectedId;
  });
  const currentSelectedOption = selectedOptions.length ? selectedOptions[0] : null;

  const selectProps: InternalSelectProps = {
    options: selectOptions,
    selectedOption: currentSelectedOption,
    triggerVariant: 'option',
    onChange: event => fireNonCancelableEvent(onChange, { selectedId: event.detail.selectedOption.value! }),
  };

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, isInControlGroup && styles['in-control-group'])}
      ref={__internalRootRef}
    >
      <InternalSegmentedControlComponent
        selectedId={selectedId}
        options={options}
        label={label}
        ariaLabelledby={ariaLabelledby}
        onChange={onChange}
        style={style}
        controlGroupPosition={isInControlGroup ? controlGroupPosition : undefined}
      />
      <div className={styles.select}>
        {ariaLabelledby && <InternalSelect {...selectProps} ariaLabelledby={ariaLabelledby} />}
        {!ariaLabelledby && label && (
          <InternalFormField label={label} stretch={true}>
            <InternalSelect {...selectProps} />
          </InternalFormField>
        )}
        {!ariaLabelledby && !label && <InternalSelect {...selectProps} />}
      </div>
    </div>
  );
}
