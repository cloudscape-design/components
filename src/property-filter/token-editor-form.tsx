// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InternalButton } from '../button/internal';
import { PropertyFilterProps } from './interfaces';
import styles from './styles.css.js';

interface TokenEditorFormProps extends Pick<PropertyFilterProps, 'i18nStrings'> {
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

export default function TokenEditorForm({ children, onClose, onSubmit, i18nStrings }: TokenEditorFormProps) {
  return (
    <div className={styles['token-editor']}>
      {children}
      <div className={styles['token-editor-actions']}>
        <InternalButton variant="link" className={styles['token-editor-cancel']} onClick={onClose}>
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton className={styles['token-editor-submit']} onClick={onSubmit}>
          {i18nStrings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}
