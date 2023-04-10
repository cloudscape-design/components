// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';
import InternalCheckbox from '../checkbox/internal';
import InternalColumnLayout from '../column-layout/internal';
import InternalFormField from '../form-field/internal';
import InternalRadioGroup from '../radio-group/internal';
import InternalSpaceBetween from '../space-between/internal';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';

export const copyPreferences = ({
  pageSize,
  wrapLines,
  stripedRows,
  contentDensity,
  stickyColumns,
  visibleContent,
  custom,
}: CollectionPreferencesProps.Preferences): CollectionPreferencesProps.Preferences => ({
  pageSize,
  wrapLines,
  stripedRows,
  contentDensity,
  visibleContent,
  stickyColumns,
  custom,
});

export const mergePreferences = (
  newPref: CollectionPreferencesProps.Preferences,
  oldPref: CollectionPreferencesProps.Preferences
): CollectionPreferencesProps.Preferences => ({
  pageSize: newPref.pageSize !== undefined ? newPref.pageSize : oldPref.pageSize,
  wrapLines: newPref.wrapLines !== undefined ? newPref.wrapLines : oldPref.wrapLines,
  stripedRows: newPref.stripedRows !== undefined ? newPref.stripedRows : oldPref.stripedRows,
  contentDensity: newPref.contentDensity !== undefined ? newPref.contentDensity : oldPref.contentDensity,
  visibleContent: newPref.visibleContent !== undefined ? newPref.visibleContent : oldPref.visibleContent,
  stickyColumns: newPref.stickyColumns !== undefined ? newPref.stickyColumns : oldPref.stickyColumns,
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
        {left && <div>{left}</div>}
        {right && <div className={clsx(left && styles['second-column-small'])}>{right}</div>}
      </div>
    );
  }

  const columns = left && right ? 2 : 1;
  return (
    <div ref={ref}>
      <InternalColumnLayout columns={columns} variant="text-grid">
        {left && <div>{left}</div>}
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

interface StripedRowsPreferenceProps extends CollectionPreferencesProps.StripedRowsPreference {
  onChange: (value: boolean) => void;
  value?: boolean;
}

export const StripedRowsPreference = ({ label, description, value, onChange }: StripedRowsPreferenceProps) => (
  <InternalCheckbox
    checked={!!value}
    description={description}
    onChange={({ detail }) => onChange(detail.checked)}
    className={styles['striped-rows']}
  >
    {label}
  </InternalCheckbox>
);

interface ContentDensityPreferenceProps extends CollectionPreferencesProps.ContentDensityPreference {
  onChange: (value: 'comfortable' | 'compact') => void;
  value?: 'comfortable' | 'compact';
}

export const ContentDensityPreference = ({ label, description, value, onChange }: ContentDensityPreferenceProps) => (
  <InternalCheckbox
    checked={value === 'compact'}
    description={description}
    onChange={({ detail }) => onChange(detail.checked ? 'compact' : 'comfortable')}
    className={styles['content-density']}
  >
    {label}
  </InternalCheckbox>
);

interface StickyColumnsPreferenceProps extends CollectionPreferencesProps.StickyColumnsPreference {
  onChange: (value: any) => void;
  value?: any;
}

interface StickyPreference extends CollectionPreferencesProps.StickyColumnsPreference {
  onChange: (value: any) => void;
  preference: {
    title: string;
    description: string;
    options: ReadonlyArray<{
      label: string;
      value: number;
    }>;
  };
  value?: any;
  side: 'left' | 'right';
}

const StickyPreference = ({ side, preference, value, onChange }: StickyPreference) => {
  const { title, description, options } = preference;

  return (
    <InternalFormField
      className={styles[`sticky-columns-${side}-form-field`]}
      key={title}
      label={title}
      description={description}
    >
      <InternalRadioGroup
        className={styles[`sticky-columns-${side}-radio-group`]}
        value={typeof value !== undefined ? `${value}` : null}
        items={options.map(({ label, value }) => ({ label, value: `${value}` }))}
        onChange={({ detail }) => onChange(Number(detail.value))}
      />
    </InternalFormField>
  );
};

export const StickyColumnsPreference = ({
  startColumns,
  endColumns,
  onChange,
  value,
}: StickyColumnsPreferenceProps) => {
  return (
    <InternalSpaceBetween className={styles['sticky-columns']} size="l">
      {startColumns && (
        <StickyPreference
          side="left"
          preference={startColumns}
          value={value.start}
          onChange={newValue => onChange({ ...value, start: newValue })}
        />
      )}
      {endColumns && (
        <StickyPreference
          side="right"
          preference={endColumns}
          value={value.end}
          onChange={newValue => onChange({ ...value, end: newValue })}
        />
      )}
    </InternalSpaceBetween>
  );
};

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
