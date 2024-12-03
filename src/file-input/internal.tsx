// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, Ref, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { useFormFieldContext } from '../contexts/form-field';
import { getBaseProps } from '../internal/base-component/index.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import { FileInputProps } from './interfaces';

import styles from './styles.css.js';

interface InternalFileInputProps {
  __inputClassName?: string;
  __nativeAttributes?: React.InputHTMLAttributes<HTMLInputElement> | Record<`data-${string}`, string>;
}

const InternalFileInput = React.forwardRef(
  (
    {
      accept,
      ariaRequired,
      ariaLabel,
      multiple = false,
      value,
      onChange,
      variant = 'button',
      children,
      __internalRootRef = null,
      __inputClassName,
      __nativeAttributes,
      ...restProps
    }: FileInputProps & InternalBaseComponentProps & InternalFileInputProps,
    ref: Ref<FileInputProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLButtonElement>(null);
    const mergedRef = useMergeRefs(__internalRootRef, containerRef);

    const uploadButtonLabelId = useUniqueId('upload-button-label');
    const formFieldContext = useFormFieldContext(restProps);
    const selfControlId = useUniqueId('upload-input');
    const controlId = formFieldContext.controlId ?? selfControlId;

    useForwardFocus(ref, uploadInputRef);

    const [isFocused, setIsFocused] = useState(false);
    const onUploadButtonClick = () => uploadInputRef.current?.click();
    const onUploadInputFocus = () => {
      setIsFocused(true);
      containerRef.current?.scrollIntoView();
    };
    const onUploadInputBlur = () => setIsFocused(false);

    const onUploadInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      fireNonCancelableEvent(onChange, { value: target.files ? Array.from(target.files) : [] });
    };

    checkControlled('FileInput', 'value', value, 'onChange', onChange);

    const nativeAttributes: React.HTMLAttributes<HTMLInputElement> = {
      'aria-label': ariaLabel || children,
      'aria-labelledby': joinStrings(formFieldContext.ariaLabelledby, uploadButtonLabelId),
      'aria-describedby': formFieldContext.ariaDescribedby,
      ...__nativeAttributes,
    };
    if (formFieldContext.invalid) {
      nativeAttributes['aria-invalid'] = true;
    }
    if (ariaRequired) {
      nativeAttributes['aria-required'] = true;
    }

    if (variant === 'icon' && !ariaLabel) {
      warnOnce('FileInput', 'Aria label is required with icon variant.');
    }

    // Synchronizing component's value with the native file input state.
    useEffect(() => {
      /* istanbul ignore next: The DataTransfer is not available in jsdom. */
      if (window.DataTransfer) {
        const dataTransfer = new DataTransfer();
        for (const file of value) {
          dataTransfer.items.add(file);
        }
        uploadInputRef.current!.files = dataTransfer.files;
      }
      if (uploadInputRef.current) {
        uploadInputRef.current.value = ''; // reset value to allow calling onChange when the same file is uploaded again
      }
    }, [value]);

    const { tabIndex } = useSingleTabStopNavigation(uploadInputRef);

    return (
      <div {...baseProps} ref={mergedRef} className={clsx(baseProps.className, styles.root)}>
        {/* This is the actual interactive and accessible file-upload element. */}
        {/* It is visually hidden to achieve the desired UX design. */}
        <input
          id={controlId}
          ref={uploadInputRef}
          type="file"
          hidden={false}
          multiple={multiple}
          accept={accept}
          onChange={onUploadInputChange}
          onFocus={onUploadInputFocus}
          onBlur={onUploadInputBlur}
          className={clsx(styles['file-input'], styles.hidden, __inputClassName)}
          tabIndex={tabIndex}
          {...nativeAttributes}
        />

        {/* The button is decorative. It dispatches clicks to the file input and is ARIA-hidden. */}
        {/* When the input is focused the focus outline is forced on the button. */}
        <InternalButton
          iconName="upload"
          variant={variant === 'icon' ? 'icon' : undefined}
          formAction="none"
          onClick={onUploadButtonClick}
          className={clsx(styles['file-input-button'], {
            [styles['force-focus-outline-button']]: isFocused && variant === 'button',
            [styles['force-focus-outline-icon']]: isFocused && variant === 'icon',
          })}
          __nativeAttributes={{ tabIndex: -1, 'aria-hidden': true }}
        >
          {variant === 'button' && children}
        </InternalButton>

        {/* The file input needs to be labelled with provided content. Can't use the button because it is ARIA-hidden. */}
        <ScreenreaderOnly id={uploadButtonLabelId}>{ariaLabel || children}</ScreenreaderOnly>
      </div>
    );
  }
);

export default InternalFileInput;
