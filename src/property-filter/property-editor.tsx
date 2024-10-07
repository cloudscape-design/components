// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import { I18nStringsInternal } from './i18n-utils';
import { ComparisonOperator, ExtendedOperatorForm, InternalFilteringProperty, InternalToken } from './interfaces';

import styles from './styles.css.js';

export function PropertyEditorContent<TokenValue = any>({
  property,
  operator,
  filter,
  value,
  onChange,
  operatorForm,
}: {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  filter: string;
  value: null | TokenValue;
  onChange: (value: null | TokenValue) => void;
  operatorForm: ExtendedOperatorForm<TokenValue>;
}) {
  return (
    <div className={styles['property-editor']}>
      <div className={styles['property-editor-form']}>
        <InternalFormField label={property.groupValuesLabel}>
          {operatorForm({ value, onChange, operator, filter })}
        </InternalFormField>
      </div>
    </div>
  );
}

export function PropertyEditorFooter<TokenValue = any>({
  property,
  operator,
  value,
  onCancel,
  onSubmit,
  i18nStrings,
}: {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  value: null | TokenValue;
  onCancel: () => void;
  onSubmit: (value: InternalToken) => void;
  i18nStrings: I18nStringsInternal;
}) {
  const submitToken = () => onSubmit({ property, operator, value });
  return (
    <div className={styles['property-editor-actions']}>
      <InternalButton variant="link" className={styles['property-editor-cancel']} onClick={onCancel}>
        {i18nStrings.cancelActionText}
      </InternalButton>
      <InternalButton className={styles['property-editor-submit']} onClick={submitToken}>
        {i18nStrings.applyActionText}
      </InternalButton>
    </div>
  );
}
