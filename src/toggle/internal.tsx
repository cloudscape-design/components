// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import {
  GeneratedAnalyticsMetadataFragment,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import AbstractSwitch from '../internal/components/abstract-switch';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import InternalLiveRegion from '../live-region/internal';
import InternalSpinner from '../spinner/internal';
import { GeneratedAnalyticsMetadataToggleComponent } from './analytics-metadata/interfaces';
import { ToggleProps } from './interfaces';
import { getAbstractSwitchStyles, getStyledControlStyle } from './style';

import styles from './styles.css.js';

interface InternalToggleProps extends ToggleProps, InternalBaseComponentProps {
  styleClassNames?: StyleClassNames;
  __injectAnalyticsComponentMetadata?: boolean;
}

// Style API v2
interface StyleClassNames {
  control?: string;
}

const InternalToggle = React.forwardRef<ToggleProps.Ref, InternalToggleProps>(
  (
    {
      controlId,
      checked,
      name,
      disabled,
      readOnly,
      loading,
      i18nStrings,
      children,
      description,
      ariaLabel,
      ariaControls,
      onFocus,
      onBlur,
      onChange,
      nativeInputAttributes,
      __internalRootRef,
      style,
      styleClassNames,
      __injectAnalyticsComponentMetadata,
      ...rest
    },
    ref
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const i18n = useInternalI18n('toggle');

    const isLoading = !!loading;
    const effectiveDisabled = isLoading || !!disabled;
    const resolvedLoadingText = i18n('i18nStrings.loadingText', i18nStrings?.loadingText);

    // The handle's follow-through animation only plays once the state has changed since mount.
    const [initialChecked] = useState(!!checked);
    const [hasChanged, setHasChanged] = useState(false);
    if (!hasChanged && !!checked !== initialChecked) {
      setHasChanged(true);
    }

    const loadingRegionId = useUniqueId('toggle-loading-');
    const [liveMessage, setLiveMessage] = useState('');
    useEffect(() => {
      setLiveMessage(isLoading ? (resolvedLoadingText ?? '') : '');
    }, [isLoading, resolvedLoadingText]);

    const analyticsMetadata: GeneratedAnalyticsMetadataFragment = {};
    const analyticsComponentMetadata: GeneratedAnalyticsMetadataToggleComponent = {
      name: 'awsui.Toggle',
      label: { root: 'self' },
      properties: {
        checked: `${!!checked}`,
      },
    };

    if (__injectAnalyticsComponentMetadata) {
      analyticsMetadata.component = analyticsComponentMetadata;
    }

    if (!effectiveDisabled && !readOnly) {
      analyticsMetadata.action = !checked ? 'select' : 'deselect';
    }

    if (isLoading && !resolvedLoadingText) {
      warnOnce('Toggle', '`loadingText` is required when `loading` is true for accessibility.');
    }

    useForwardFocus(ref, checkboxRef);

    return (
      <>
        <AbstractSwitch
          {...baseProps}
          className={clsx(styles.root, baseProps.className)}
          controlClassName={clsx(styleClassNames?.control, styles['toggle-control'], {
            [styles['toggle-control-checked']]: checked && !isLoading,
            [styles['toggle-control-disabled']]: effectiveDisabled,
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
            <WithNativeAttributes
              {...nativeControlProps}
              tag="input"
              componentName="Toggle"
              nativeAttributes={nativeInputAttributes}
              ref={checkboxRef}
              type="checkbox"
              checked={checked}
              name={name}
              disabled={isLoading ? undefined : disabled}
              aria-disabled={isLoading || (readOnly && !disabled) ? 'true' : undefined}
              aria-busy={isLoading ? 'true' : undefined}
              aria-describedby={
                [nativeControlProps['aria-describedby'], isLoading && loadingRegionId].filter(Boolean).join(' ') ||
                undefined
              }
              onFocus={() => fireNonCancelableEvent(onFocus)}
              onBlur={() => fireNonCancelableEvent(onBlur)}
              onKeyDown={
                isLoading
                  ? e => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }
                  : undefined
              }
              // empty handler to suppress React controllability warning
              onChange={() => {}}
            />
          )}
          onClick={() => {
            if (isLoading) {
              return;
            }
            checkboxRef.current?.focus();
            fireNonCancelableEvent(onChange, { checked: !checked });
          }}
          styledControl={
            isLoading ? (
              /*Using span, not div for HTML validity*/
              <span
                className={clsx(styles['toggle-handle-loading'], {
                  [styles['toggle-handle-loading-checked']]: checked,
                })}
              >
                <InternalSpinner size="x-small" variant="disabled" />
              </span>
            ) : (
              /*Using span, not div for HTML validity*/
              <span
                className={clsx(styles['toggle-handle'], {
                  [styles['toggle-handle-checked']]: checked,
                  [styles['toggle-handle-disabled']]: effectiveDisabled,
                  [styles['toggle-handle-readonly']]: readOnly,
                })}
                data-awsui-motion-ready={hasChanged ? '' : undefined}
                style={getStyledControlStyle(style, checked, effectiveDisabled, readOnly)}
              />
            )
          }
          style={getAbstractSwitchStyles(style, checked, effectiveDisabled, readOnly)}
          __internalRootRef={__internalRootRef}
          {...getAnalyticsMetadataAttribute(analyticsMetadata)}
        />
        <InternalLiveRegion id={loadingRegionId} tagName="span" hidden={true} preventInitialAnnouncement={true}>
          {liveMessage}
        </InternalLiveRegion>
      </>
    );
  }
);

export default InternalToggle;
