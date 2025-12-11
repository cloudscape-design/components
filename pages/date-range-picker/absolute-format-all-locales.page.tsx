// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, FormField, Grid } from '~components';

import { SimplePage } from '../app/templates';
import { locales } from '../date-input/common';
import { Settings, useDateRangePickerSettings } from './common';

const rtlLocales = new Set(['ar', 'he']);

// Locale-specific placeholder formats
const localePlaceholders: Record<string, { date: string; time: string }> = {
  de: { date: 'JJJJ-MM-TT', time: 'hh:mm:ss' }, // German: Jahr-Monat-Tag
  en: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // English
  es: { date: 'AAAA-MM-DD', time: 'hh:mm:ss' }, // Spanish: Año-Mes-Día
  fr: { date: 'AAAA-MM-JJ', time: 'hh:mm:ss' }, // French: Année-Mois-Jour
  id: { date: 'TTTT-BB-HH', time: 'jj:mm:dd' }, // Indonesian: Tahun-Bulan-Hari
  it: { date: 'AAAA-MM-GG', time: 'hh:mm:ss' }, // Italian: Anno-Mese-Giorno
  ja: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Japanese: 年-月-日
  ko: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Korean: 년-월-일
  ms: { date: 'TTTT-BB-HH', time: 'jj:mm:ss' }, // Malay: Tahun-Bulan-Hari
  pt: { date: 'AAAA-MM-DD', time: 'hh:mm:ss' }, // Portuguese: Ano-Mês-Dia
  'pt-BR': { date: 'AAAA-MM-DD', time: 'hh:mm:ss' }, // Portuguese (Brazil)
  th: { date: 'PPPP-DD-WW', time: 'ชช:นน:วว' }, // Thai: ปี-เดือน-วัน
  tr: { date: 'YYYY-AA-GG', time: 'ss:dd:ss' }, // Turkish: Yıl-Ay-Gün
  vi: { date: 'NNNN-TT-NN', time: 'gg:pp:gg' }, // Vietnamese: Năm-Tháng-Ngày
  zh: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Chinese
  'zh-CN': { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Chinese (Simplified)
  'zh-TW': { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Chinese (Traditional)
  ar: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Arabic (RTL)
  he: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' }, // Hebrew (RTL)
};

export default function DateRangePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ rangeSelectorMode: 'absolute-only' });

  const getLocalizedI18nStrings = (locale: string) => {
    const placeholders = localePlaceholders[locale];
    if (!placeholders) {
      return props.i18nStrings;
    }

    return {
      ...props.i18nStrings,
      startDatePlaceholder: placeholders.date,
      endDatePlaceholder: placeholders.date,
      startTimePlaceholder: placeholders.time,
      endTimePlaceholder: placeholders.time,
    };
  };

  return (
    <SimplePage
      title="Date range picker: all locales for absolute format"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      {locales.map(locale => (
        <div key={`pickers-${locale}`} dir={rtlLocales.has(locale) ? 'rtl' : 'ltr'}>
          <Grid gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
            <div style={{ textAlign: 'right' }}>{locale}</div>
            <FormField label="Date Range Picker field">
              <DateRangePicker {...props} locale={locale} i18nStrings={getLocalizedI18nStrings(locale)} />
            </FormField>
          </Grid>
        </div>
      ))}
    </SimplePage>
  );
}
