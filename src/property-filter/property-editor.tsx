// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { ParsedText, I18nStrings, Token, FilteringProperty } from './interfaces';
import InternalBox from '../box/internal';
import styles from './styles.css.js';
import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import { getExtendedOperator } from './controller';

interface PorpertyEditorProps {
  filteringProperties: readonly FilteringProperty[];
  parsedText: ParsedText;
  onCancel: () => void;
  onSubmit: (value: Token) => void;
  i18nStrings: I18nStrings;
}

export function PropertyEditor<TokenValue = any>({
  filteringProperties,
  parsedText,
  onCancel,
  onSubmit,
  i18nStrings,
}: PorpertyEditorProps) {
  const OperatorForm =
    parsedText.step === 'property' &&
    getExtendedOperator(filteringProperties, parsedText.property.key, parsedText.operator)?.form;

  const [value, onChange] = useState<null | TokenValue>(null);

  if (!OperatorForm) {
    return null;
  }

  return (
    <InternalBox padding={{ horizontal: 'm', vertical: 's' }}>
      <div className={styles['property-editor']}>
        <div className={styles['property-editor-form']}>
          <InternalFormField label={parsedText.property.groupValuesLabel}>
            <OperatorForm value={value} onChange={onChange} operator={parsedText.operator} filter={parsedText.value} />
          </InternalFormField>
        </div>

        <div className={styles['property-editor-actions']}>
          <InternalButton variant="link" className={styles['property-editor-cancel']} onClick={onCancel}>
            {i18nStrings.cancelActionText}
          </InternalButton>
          <InternalButton
            className={styles['property-editor-submit']}
            onClick={() => onSubmit({ propertyKey: parsedText.property.key, operator: parsedText.operator, value })}
          >
            {i18nStrings.applyActionText}
          </InternalButton>
        </div>
      </div>
    </InternalBox>
  );
}
