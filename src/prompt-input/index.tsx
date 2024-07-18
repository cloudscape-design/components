// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { PromptInputProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalPromptInput from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { PromptInputProps };

const PromptInput = React.forwardRef(
  (
    {
      autoComplete,
      autoFocus,
      disableBrowserAutocorrect,
      disableActionButton,
      spellcheck,
      readOnly,
      actionButtonIconName,
      minRows,
      maxRows,
      ...props
    }: PromptInputProps,
    ref: React.Ref<PromptInputProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('PromptInput', {
      props: {
        readOnly,
        autoComplete,
        autoFocus,
        disableBrowserAutocorrect,
        disableActionButton,
        spellcheck,
        actionButtonIconName,
        minRows,
        maxRows,
      },
    });
    return (
      <InternalPromptInput
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disableBrowserAutocorrect={disableBrowserAutocorrect}
        disableActionButton={disableActionButton}
        spellcheck={spellcheck}
        actionButtonIconName={actionButtonIconName}
        minRows={minRows}
        maxRows={maxRows}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);
applyDisplayName(PromptInput, 'PromptInput');
export default PromptInput;
