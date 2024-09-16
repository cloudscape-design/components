// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import InternalSpaceBetween from '../space-between/internal';
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
  const form = operatorForm({ value, onChange, operator, filter });
  const formMain = form && typeof form === 'object' && 'main' in form ? form.main : form;
  const formSecondary = form && typeof form === 'object' && form && 'secondary' in form ? form.secondary : null;
  return (
    <div className={styles['property-editor']}>
      <div className={styles['property-editor-form']}>
        <InternalFormField label={property.groupValuesLabel}>
          <InternalSpaceBetween size="m">
            {formMain}
            {formSecondary}
          </InternalSpaceBetween>
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
