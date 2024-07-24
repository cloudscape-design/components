// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useInternalI18n } from '../i18n/context';
import InternalSegmentedControl from '../segmented-control/internal';
import { DateRangePickerProps } from './interfaces';

import styles from './styles.css.js';

interface ModeSwitcherProps extends Pick<DateRangePickerProps, 'i18nStrings'> {
  mode: 'absolute' | 'relative';
  onChange: (mode: 'absolute' | 'relative') => void;
}

export default function ModeSwitcher({ i18nStrings, mode, onChange }: ModeSwitcherProps) {
  const i18n = useInternalI18n('date-range-picker');

  return (
    <InternalSegmentedControl
      className={styles['mode-switch']}
      selectedId={mode}
      label={i18nStrings?.modeSelectionLabel}
      options={[
        { id: 'relative', text: i18n('i18nStrings.relativeModeTitle', i18nStrings?.relativeModeTitle) },
        { id: 'absolute', text: i18n('i18nStrings.absoluteModeTitle', i18nStrings?.absoluteModeTitle) },
      ]}
      onChange={e => onChange(e.detail.selectedId as 'absolute' | 'relative')}
    />
  );
}
