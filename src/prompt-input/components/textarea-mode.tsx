// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import WithNativeAttributes from '../../internal/utils/with-native-attributes';

interface TextareaModeProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  controlId?: string;
  textareaAttributes: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  nativeTextareaAttributes?: Record<string, any>;
}

export default function TextareaMode({
  textareaRef,
  controlId,
  textareaAttributes,
  nativeTextareaAttributes,
}: TextareaModeProps) {
  return (
    <WithNativeAttributes
      {...textareaAttributes}
      tag="textarea"
      componentName="PromptInput"
      nativeAttributes={nativeTextareaAttributes}
      ref={textareaRef}
      id={controlId}
    />
  );
}
