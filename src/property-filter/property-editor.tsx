// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { I18nStrings } from './interfaces';
import { TokenEditorForm } from './token-editor';
import InternalBox from '../box/internal';

interface PorpertyEditorRenderProps<TokenValue> {
  value: null | TokenValue;
  onChange: (value: null | TokenValue) => void;
}

interface PorpertyEditorProps<TokenValue = any> {
  children: (props: PorpertyEditorRenderProps<TokenValue>) => React.ReactNode;
  onCancel: () => void;
  onSubmit: (value: null | TokenValue) => void;
  i18nStrings: I18nStrings;
}

export function PropertyEditor<TokenValue = any>({
  children,
  onCancel,
  onSubmit,
  i18nStrings,
}: PorpertyEditorProps<TokenValue>) {
  const [value, onChange] = useState<null | TokenValue>(null);
  return (
    <InternalBox padding={{ horizontal: 'm', vertical: 's' }}>
      <TokenEditorForm i18nStrings={i18nStrings} onCancel={onCancel} onSubmit={() => onSubmit(value)}>
        {children({ value, onChange })}
      </TokenEditorForm>
    </InternalBox>
  );
}
