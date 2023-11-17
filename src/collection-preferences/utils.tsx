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
import { useInternalI18n } from '../i18n/context';

export const copyPreferences = ({
  pageSize,
  wrapLines,
  stripedRows,
  contentDensity,
  visibleContent,
  contentDisplay,
  stickyColumns,
  custom,
}: CollectionPreferencesProps.Preferences): CollectionPreferencesProps.Preferences => ({
  pageSize,
  wrapLines,
  stripedRows,
  contentDensity,
  visibleContent,
  contentDisplay,
  stickyColumns,
  custom,
});

type CopyPreferenceName = keyof CollectionPreferencesProps.Preferences;

export const mergePreferences = (
  newPref: CollectionPreferencesProps.Preferences,
  oldPref: CollectionPreferencesProps.Preferences
): CollectionPreferencesProps.Preferences => {
  const newObj = { ...oldPref };
  const prefNames: CopyPreferenceName[] = [
    'pageSize',
    'wrapLines',
    'stripedRows',
    'contentDensity',
    'visibleContent',
    'custom',
    'contentDisplay',
    'stickyColumns',
  ];
  for (const prefName of prefNames) {
    if (newPref[prefName] !== undefined) {
      newObj[prefName] = newPref[prefName];
    }
  }
  return newObj;
};

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

export const PageSizePreference = ({ title, options, value, onChange }: PageSizePreferenceProps) => {
  const i18n = useInternalI18n('collection-preferences');
  return (
    <div className={styles['page-size']}>
      <InternalFormField
        label={i18n('pageSizePreference.title', title)}
        stretch={true}
        className={styles['page-size-form-field']}
      >
        <InternalRadioGroup
          className={styles['page-size-radio-group']}
          value={`${value}`}
          items={options.map(({ label, value }) => ({ label, value: `${value}` }))}
          onChange={({ detail }) => onChange(parseInt(detail.value, 10))}
        />
      </InternalFormField>
    </div>
  );
};

interface WrapLinesPreferenceProps extends CollectionPreferencesProps.WrapLinesPreference {
  onChange: (value: boolean) => void;
  value?: boolean;
}

export const WrapLinesPreference = ({ label, description, value, onChange }: WrapLinesPreferenceProps) => {
  const i18n = useInternalI18n('collection-preferences');
  return (
    <InternalCheckbox
      checked={!!value}
      description={i18n('wrapLinesPreference.description', description)}
      onChange={({ detail }) => onChange(detail.checked)}
      className={styles['wrap-lines']}
    >
      {i18n('wrapLinesPreference.label', label)}
    </InternalCheckbox>
  );
};

interface StripedRowsPreferenceProps extends CollectionPreferencesProps.StripedRowsPreference {
  onChange: (value: boolean) => void;
  value?: boolean;
}

export function StripedRowsPreference({ label, description, value, onChange }: StripedRowsPreferenceProps) {
  const i18n = useInternalI18n('collection-preferences');
  return (
    <InternalCheckbox
      checked={!!value}
      description={i18n('stripedRowsPreference.description', description)}
      onChange={({ detail }) => onChange(detail.checked)}
      className={styles['striped-rows']}
    >
      {i18n('stripedRowsPreference.label', label)}
    </InternalCheckbox>
  );
}

interface ContentDensityPreferenceProps extends CollectionPreferencesProps.ContentDensityPreference {
  onChange: (value: 'comfortable' | 'compact') => void;
  value?: 'comfortable' | 'compact';
}

export const ContentDensityPreference = ({ label, description, value, onChange }: ContentDensityPreferenceProps) => {
  const i18n = useInternalI18n('collection-preferences');
  return (
    <InternalCheckbox
      checked={value === 'compact'}
      description={i18n('contentDensityPreference.description', description)}
      onChange={({ detail }) => onChange(detail.checked ? 'compact' : 'comfortable')}
      className={styles['content-density']}
    >
      {i18n('contentDensityPreference.label', label)}
    </InternalCheckbox>
  );
};

interface StickyColumnsPreferenceProps extends CollectionPreferencesProps.StickyColumnsPreference {
  onChange: (value?: { first?: number; last?: number }) => void;
  value?: { first?: number; last?: number };
}
interface StickyPreference extends CollectionPreferencesProps.StickyColumnsPreference {
  onChange: (value: number) => void;
  preference: {
    title: string;
    description: string;
    options: ReadonlyArray<{
      label: string;
      value: number;
    }>;
  };
  value?: number;
  firstOrLast: 'first' | 'last';
}

const StickyPreference = ({ firstOrLast, preference, value, onChange }: StickyPreference) => {
  const { title, description, options } = preference;
  return (
    <div className={styles[`sticky-columns-${firstOrLast}`]}>
      <InternalFormField className={styles['sticky-columns-form-field']} label={title} description={description}>
        <InternalRadioGroup
          className={styles['sticky-columns-radio-group']}
          value={typeof value !== 'undefined' ? `${value}` : null}
          items={options.map(({ label, value }) => ({ label, value: `${value}` }))}
          onChange={({ detail }) => onChange(Number(detail.value))}
        />
      </InternalFormField>
    </div>
  );
};

export const StickyColumnsPreference = ({
  firstColumns,
  lastColumns,
  onChange,
  value,
}: StickyColumnsPreferenceProps) => {
  return (
    <InternalSpaceBetween className={styles['sticky-columns']} size="l">
      {firstColumns && (
        <StickyPreference
          firstOrLast="first"
          preference={firstColumns}
          value={value?.first}
          onChange={newValue => onChange({ ...value, first: newValue })}
        />
      )}
      {lastColumns && (
        <StickyPreference
          firstOrLast="last"
          preference={lastColumns}
          value={value?.last}
          onChange={newValue => onChange({ ...value, last: newValue })}
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
