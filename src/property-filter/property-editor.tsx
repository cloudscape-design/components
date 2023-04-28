// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { I18nStrings, Token, ExtendedOperatorForm, ComparisonOperator, InternalFilteringProperty } from './interfaces';
import styles from './styles.css.js';
import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';

interface PropertyEditorProps<TokenValue> {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  filter: string;
  operatorForm: ExtendedOperatorForm<TokenValue>;
  onCancel: () => void;
  onSubmit: (value: Token) => void;
  i18nStrings: I18nStrings;
}

export function PropertyEditor<TokenValue = any>({
  property,
  operator,
  filter,
  operatorForm,
  onCancel,
  onSubmit,
  i18nStrings,
}: PropertyEditorProps<TokenValue>) {
  const [value, onChange] = useState<null | TokenValue>(null);
  const submitToken = () => onSubmit({ propertyKey: property.propertyKey, operator, value });
  return (
    <div className={styles['property-editor']}>
      <div className={styles['property-editor-form']}>
        <InternalFormField label={property.groupValuesLabel}>
          {operatorForm({ value, onChange, operator, filter })}
        </InternalFormField>
      </div>

      <div className={styles['property-editor-actions']}>
        <InternalButton variant="link" className={styles['property-editor-cancel']} onClick={onCancel}>
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton className={styles['property-editor-submit']} onClick={submitToken}>
          {i18nStrings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}
