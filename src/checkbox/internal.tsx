// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import {
  GeneratedAnalyticsMetadataFragment,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import AbstractSwitch from '../internal/components/abstract-switch';
import CheckboxIcon from '../internal/components/checkbox-icon';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { GeneratedAnalyticsMetadataCheckboxComponent } from './analytics-metadata/interfaces';
import { CheckboxProps } from './interfaces';
import { getAbstractSwitchStyles, getCheckboxIconStyles } from './style';

import styles from './styles.css.js';

export const css_style_api = {
  root: {
    className: 'awsui-style-checkbox-root',
    children: {
      control: {
        className: 'awsui-style-checkbox-control',
        attributes: {
          ':has(input:checked)': 'checked',
          ':has(input:indeterminate)': 'indeterminate',
          ':has(input:disabled)': 'disabled',
        },
        children: {
          svg: {
            className: 'awsui-style-checkbox-svg',
            children: {
              box: { className: 'awsui-style-checkbox-box', type: 'svg:rect' as const },
              checkmark: { className: 'awsui-style-checkbox-checkmark', type: 'svg:polyline' as const },
            },
          },
        },
      },
      label: { className: 'awsui-style-checkbox-label' },
    },
  },
};

// Flat lookup for internal use
const cssStyleApiClasses = {
  root: css_style_api.root.className,
  control: css_style_api.root.children.control.className,
};

interface InternalProps extends CheckboxProps, InternalBaseComponentProps {
  tabIndex?: -1;
  showOutline?: boolean;
  __injectAnalyticsComponentMetadata?: boolean;
}

const InternalCheckbox = React.forwardRef<CheckboxProps.Ref, InternalProps>(
  (
    {
      controlId,
      name,
      checked,
      disabled,
      readOnly,
      ariaRequired,
      indeterminate,
      children,
      description,
      ariaLabel,
      onFocus,
      onBlur,
      onChange,
      tabIndex: explicitTabIndex,
      showOutline,
      ariaControls,
      style,
      nativeInputAttributes,
      __internalRootRef,
      __injectAnalyticsComponentMetadata = false,
      ...rest
    },
    ref
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);
    const checkboxRef = useRef<HTMLInputElement>(null);
    useForwardFocus(ref, checkboxRef);
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = Boolean(indeterminate);
      }
    });

    const { tabIndex } = useSingleTabStopNavigation(checkboxRef, { tabIndex: explicitTabIndex });

    const analyticsMetadata: GeneratedAnalyticsMetadataFragment = {};
    const analyticsComponentMetadata: GeneratedAnalyticsMetadataCheckboxComponent = {
      name: 'awsui.Checkbox',
      label: { root: 'self' },
      properties: {
        checked: `${!!checked}`,
      },
    };
    if (__injectAnalyticsComponentMetadata) {
      analyticsMetadata.component = analyticsComponentMetadata;
    }
    if (!disabled && !readOnly) {
      analyticsMetadata.action = !checked ? 'select' : 'deselect';
    }

    return (
      <AbstractSwitch
        {...baseProps}
        className={clsx(styles.root, baseProps.className, cssStyleApiClasses.root)}
        controlClassName={clsx(styles['checkbox-control'], cssStyleApiClasses.control)}
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
        showOutline={showOutline}
        nativeControl={nativeControlProps => (
          <WithNativeAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
            {...nativeControlProps}
            tag="input"
            componentName="Checkbox"
            nativeAttributes={nativeInputAttributes}
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            name={name}
            aria-required={ariaRequired ? 'true' : undefined}
            aria-disabled={readOnly && !disabled ? 'true' : undefined}
            tabIndex={tabIndex}
            onFocus={() => fireNonCancelableEvent(onFocus)}
            onBlur={() => fireNonCancelableEvent(onBlur)}
            // empty handler to suppress React controllability warning
            onChange={() => {}}
          />
        )}
        onClick={() => {
          checkboxRef.current?.focus();
          fireNonCancelableEvent(
            onChange,
            // for deterministic transitions "indeterminate" -> "checked" -> "unchecked"
            indeterminate ? { checked: true, indeterminate: false } : { checked: !checked, indeterminate: false }
          );
        }}
        styledControl={
          <CheckboxIcon
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            readOnly={readOnly}
            style={getCheckboxIconStyles(style, checked, disabled, readOnly, indeterminate)}
          />
        }
        style={getAbstractSwitchStyles(style, checked, disabled, readOnly, indeterminate)}
        __internalRootRef={__internalRootRef}
        {...getAnalyticsMetadataAttribute(analyticsMetadata)}
      />
    );
  }
);

export default InternalCheckbox;
