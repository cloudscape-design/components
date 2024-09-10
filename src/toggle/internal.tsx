// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import {
  GeneratedAnalyticsMetadataFragment,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import AbstractSwitch from '../internal/components/abstract-switch';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import {
  GeneratedAnalyticsMetadataToggleComponent,
  GeneratedAnalyticsMetadataToggleSelect,
} from './analytics-metadata/interfaces';
import { ToggleProps } from './interfaces';

import styles from './styles.css.js';

interface InternalToggleProps extends ToggleProps, InternalBaseComponentProps {
  __injectAnalyticsComponentMetadata?: boolean;
}

const InternalToggle = React.forwardRef<ToggleProps.Ref, InternalToggleProps>(
  (
    {
      controlId,
      checked,
      name,
      disabled,
      readOnly,
      children,
      description,
      ariaLabel,
      ariaControls,
      onFocus,
      onBlur,
      onChange,
      __internalRootRef = null,
      __injectAnalyticsComponentMetadata,
      ...rest
    },
    ref
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);
    const checkboxRef = useRef<HTMLInputElement>(null);

    const analyticsMetadata: GeneratedAnalyticsMetadataFragment = {};
    const analyticsComponentMetadata: GeneratedAnalyticsMetadataToggleComponent = {
      name: 'awsui.Toggle',
      label: { root: 'self' },
    };

    if (__injectAnalyticsComponentMetadata) {
      analyticsMetadata.component = analyticsComponentMetadata;
    }

    if (!disabled && !readOnly) {
      analyticsMetadata.detail = {
        selected: `${!checked}`,
      } as Partial<GeneratedAnalyticsMetadataToggleSelect['detail']>;
    }
    useForwardFocus(ref, checkboxRef);

    return (
      <AbstractSwitch
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        controlClassName={clsx(styles['toggle-control'], {
          [styles['toggle-control-checked']]: checked,
          [styles['toggle-control-disabled']]: disabled,
          [styles['toggle-control-readonly']]: readOnly,
        })}
        outlineClassName={styles.outline}
        controlId={controlId}
        disabled={disabled}
        readOnly={readOnly}
        label={children}
        description={description}
        descriptionBottomPadding={true}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        ariaDescribedby={ariaDescribedby}
        ariaControls={ariaControls}
        nativeControl={nativeControlProps => (
          <input
            {...nativeControlProps}
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            name={name}
            aria-disabled={readOnly && !disabled ? 'true' : undefined}
            onFocus={() => fireNonCancelableEvent(onFocus)}
            onBlur={() => fireNonCancelableEvent(onBlur)}
            // empty handler to suppress React controllability warning
            onChange={() => {}}
          />
        )}
        onClick={() => {
          checkboxRef.current?.focus();
          fireNonCancelableEvent(onChange, { checked: !checked });
        }}
        styledControl={
          /*Using span, not div for HTML validity*/
          <span
            className={clsx(styles['toggle-handle'], {
              [styles['toggle-handle-checked']]: checked,
              [styles['toggle-handle-disabled']]: disabled,
              [styles['toggle-handle-readonly']]: readOnly,
            })}
          />
        }
        __internalRootRef={__internalRootRef}
        {...getAnalyticsMetadataAttribute(analyticsMetadata)}
      />
    );
  }
);

export default InternalToggle;
