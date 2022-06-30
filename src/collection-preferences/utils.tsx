// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import InternalCheckbox from '../checkbox/internal';
import InternalColumnLayout from '../column-layout/internal';
import InternalFormField from '../form-field/internal';
import InternalRadioGroup from '../radio-group/internal';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';

export const copyPreferences = ({
  pageSize,
  wrapLines,
  visibleContent,
  custom,
}: CollectionPreferencesProps.Preferences): CollectionPreferencesProps.Preferences => ({
  pageSize,
  wrapLines,
  visibleContent,
  custom,
});

export const mergePreferences = (
  newPref: CollectionPreferencesProps.Preferences,
  oldPref: CollectionPreferencesProps.Preferences
): CollectionPreferencesProps.Preferences => ({
  pageSize: newPref.pageSize !== undefined ? newPref.pageSize : oldPref.pageSize,
  wrapLines: newPref.wrapLines !== undefined ? newPref.wrapLines : oldPref.wrapLines,
  visibleContent: newPref.visibleContent !== undefined ? newPref.visibleContent : oldPref.visibleContent,
  custom: newPref.custom !== undefined ? newPref.custom : oldPref.custom,
});

interface ModalContentLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export const ModalContentLayout = ({ left, right }: ModalContentLayoutProps) => {
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const smallContainer = breakpoint === 'default';

  if (smallContainer) {
    return (
      <div ref={ref}>
        <div>{left}</div>
        {right && <div className={styles['second-column-small']}>{right}</div>}
      </div>
    );
  }

  const columns = right ? 2 : 1;
  return (
    <div ref={ref}>
      <InternalColumnLayout columns={columns} variant="text-grid">
        <div>{left}</div>
        {right && <div>{right}</div>}
      </InternalColumnLayout>
    </div>
  );
};

interface PageSizePreferenceProps extends CollectionPreferencesProps.PageSizePreference {
  onChange: (value: number) => void;
  value?: number;
}

export const PageSizePreference = ({ title, options, value, onChange }: PageSizePreferenceProps) => (
  <div className={styles['page-size']}>
    <InternalFormField label={title} stretch={true} className={styles['page-size-form-field']}>
      <InternalRadioGroup
        className={styles['page-size-radio-group']}
        value={`${value}`}
        items={options.map(({ label, value }) => ({ label, value: `${value}` }))}
        onChange={({ detail }) => onChange(parseInt(detail.value, 10))}
      />
    </InternalFormField>
  </div>
);

interface WrapLinesPreferenceProps extends CollectionPreferencesProps.WrapLinesPreference {
  onChange: (value: boolean) => void;
  value?: boolean;
}

export const WrapLinesPreference = ({ label, description, value, onChange }: WrapLinesPreferenceProps) => (
  <InternalCheckbox
    checked={!!value}
    description={description}
    onChange={({ detail }) => onChange(detail.checked)}
    className={styles['wrap-lines']}
  >
    {label}
  </InternalCheckbox>
);

interface CustomPreferenceProps<T = any> extends Pick<CollectionPreferencesProps<T>, 'customPreference'> {
  onChange: (value: T) => void;
  value: T;
}
export const CustomPreference = ({ value, customPreference, onChange }: CustomPreferenceProps) => {
  const [customState, setCustomState] = useState(value);
  if (customPreference) {
    return (
      <div className={styles.custom}>
        {customPreference(customState, value => {
          // prevent value to be treated as a functional callback
          setCustomState(() => value);
          onChange(value);
        })}
      </div>
    );
  }
  return null;
};
