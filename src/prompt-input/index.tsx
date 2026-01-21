// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { PromptInputProps } from './interfaces';
import InternalPromptInput from './internal';

export { PromptInputProps };

const PromptInput = React.forwardRef<PromptInputProps.Ref | HTMLTextAreaElement, PromptInputProps>(
  (
    {
      autoFocus,
      disableBrowserAutocorrect,
      disableActionButton,
      spellcheck,
      readOnly,
      actionButtonIconName,
      minRows = 1,
      maxRows = 3,
      ...props
    },
    ref
  ) => {
    const baseComponentProps = useBaseComponent('PromptInput', {
      props: {
        readOnly,
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
