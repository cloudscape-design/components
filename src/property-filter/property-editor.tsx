// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { FilteringProperty, I18nStrings } from './interfaces';
import InternalBox from '../box/internal';
import styles from './styles.css.js';
import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';

interface PorpertyEditorRenderProps<TokenValue> {
  value: null | TokenValue;
  onChange: (value: null | TokenValue) => void;
}

interface PorpertyEditorProps<TokenValue = any> {
  property: FilteringProperty;
  children: (props: PorpertyEditorRenderProps<TokenValue>) => React.ReactNode;
  onCancel: () => void;
  onSubmit: (value: null | TokenValue) => void;
  i18nStrings: I18nStrings;
}

export function PropertyEditor<TokenValue = any>({
  property,
  children,
  onCancel,
  onSubmit,
  i18nStrings,
}: PorpertyEditorProps<TokenValue>) {
  const [value, onChange] = useState<null | TokenValue>(null);
  return (
    <InternalBox padding={{ horizontal: 'm', vertical: 's' }}>
      <div className={styles['property-editor']}>
        <div className={styles['property-editor-form']}>
          <InternalFormField label={property.groupValuesLabel}>{children({ value, onChange })}</InternalFormField>
        </div>

        <div className={styles['property-editor-actions']}>
          <InternalButton variant="link" className={styles['property-editor-cancel']} onClick={onCancel}>
            {i18nStrings.cancelActionText}
          </InternalButton>
          <InternalButton className={styles['property-editor-submit']} onClick={() => onSubmit(value)}>
            {i18nStrings.applyActionText}
          </InternalButton>
        </div>
      </div>
    </InternalBox>
  );
}
