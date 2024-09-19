// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import { I18nStringsInternal } from './i18n-utils';
import { ComparisonOperator, ExtendedOperatorForm, InternalFilteringProperty, InternalToken } from './interfaces';

import styles from './styles.css.js';

interface PropertyEditorProps<TokenValue> {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  filter: string;
  operatorForm: ExtendedOperatorForm<TokenValue>;
  onCancel: () => void;
  onSubmit: (value: InternalToken) => void;
  i18nStrings: I18nStringsInternal;
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
  const submitToken = () => onSubmit({ property, operator, value });
  return (
    <div className={styles['property-editor']}>
      <div className={styles['property-editor-form']}>
        <InternalFormField label={property.groupValuesLabel}>
          {operatorForm({ value, onChange, operator, filter })}
        </InternalFormField>
      </div>

      <div className={styles['property-editor-actions']}>
        <InternalButton
          formAction="none"
          variant="link"
          className={styles['property-editor-cancel']}
          onClick={onCancel}
        >
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton formAction="none" className={styles['property-editor-submit']} onClick={submitToken}>
          {i18nStrings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}
