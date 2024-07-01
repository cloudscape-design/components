// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { PromptInputProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalPromptInput from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { PromptInputProps };

export default function PromptInput({
  autoComplete,
  autoFocus,
  disableBrowserAutocorrect,
  disableActionButton,
  spellcheck,
  readOnly,
  ...props
}: PromptInputProps) {
  const baseComponentProps = useBaseComponent('PromptInput', {
    props: { readOnly, autoComplete, autoFocus, disableBrowserAutocorrect, disableActionButton, spellcheck },
  });
  return (
    <InternalPromptInput
      readOnly={readOnly}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disableBrowserAutocorrect={disableBrowserAutocorrect}
      disableActionButton={disableActionButton}
      spellcheck={spellcheck}
      {...props}
      {...baseComponentProps}
    />
  );
}
applyDisplayName(PromptInput, 'PromptInput');
