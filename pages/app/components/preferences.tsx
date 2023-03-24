// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { THEME, ALWAYS_VISUAL_REFRESH } from '~components/internal/environment';
import SpaceBetween from '~components/space-between';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Button from '~components/button';
import Modal from '~components/modal';
import { Select, SelectProps, Toggle } from '~components';

import AppContext from '../app-context';
import { Density, Mode } from '@cloudscape-design/global-styles';

const LOCALES = {
  de: `Deutsch`,
  en: `English (US)`,
  'en-GB': `English (UK)`,
  es: `Español`,
  fr: `Français`,
  id: `Bahasa Indonesia`,
  it: `Italiano`,
  ja: `日本語`,
  ko: `한국어`,
  'pt-BR': `Português`,
  'zh-CN': `中文(简体)`,
  'zh-TW': `中文(繁體)`,
};

const MODES = {
  [Mode.Light]: 'Light',
  [Mode.Dark]: 'Dark',
};

export default function Preferences() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button id="preferences-button" aria-haspopup="dialog" onClick={() => setVisible(true)}>
        Preferences
      </button>
      {visible && <PreferencesModal onDismiss={() => setVisible(false)} />}
    </>
  );
}

function PreferencesModal({ onDismiss }: { onDismiss: () => void }) {
  const { mode, urlParams, update } = useContext(AppContext);

  const [selectedMode, setSelectedMode] = useState<SelectProps.Option>({ value: mode, label: MODES[mode] });
  const [selectedLang, setSelectedLang] = useState<SelectProps.Option>({
    value: urlParams.lang,
    label: LOCALES[urlParams.lang as keyof typeof LOCALES],
  });
  const [selectedRefresh, setSelectedRefresh] = useState(ALWAYS_VISUAL_REFRESH ? true : urlParams.visualRefresh);
  const [selectedDensity, setSelectedDensity] = useState(urlParams.density);
  const [selectedMotionDisabled, setSelectedMotionDisabled] = useState(urlParams.motionDisabled);

  const applyPreferences = () => {
    update({
      mode: selectedMode.value as Mode,
      urlParams: {
        lang: selectedLang.value!,
        visualRefresh: selectedRefresh,
        density: selectedDensity,
        motionDisabled: selectedMotionDisabled,
      },
    });
    onDismiss?.();

    if (urlParams.visualRefresh !== selectedRefresh) {
      window.location.reload();
    }
  };

  return (
    <>
      <Modal
        visible={true}
        header="Preferences"
        onDismiss={onDismiss}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={onDismiss}>
                Cancel
              </Button>
              <Button data-test-id="apply-preferences-button" variant="primary" onClick={applyPreferences}>
                Apply
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <ColumnLayout borders="vertical" columns={2}>
          <SpaceBetween size="xs">
            <FormField label="Theme">
              <Select
                disabled={true}
                selectedOption={{ value: THEME }}
                options={[{ value: THEME }]}
                onChange={() => {}}
              />
            </FormField>

            <FormField label="Mode">
              <Select
                data-test-id="mode-selector"
                selectedOption={selectedMode}
                options={(Object.keys(MODES) as (keyof typeof MODES)[]).map(mode => ({
                  value: mode,
                  label: MODES[mode],
                }))}
                onChange={({ detail }) => setSelectedMode(detail.selectedOption)}
              />
            </FormField>

            <FormField label="Language">
              <Select
                data-test-id="language-selector"
                selectedOption={selectedLang}
                options={(Object.keys(LOCALES) as (keyof typeof LOCALES)[]).map(lang => ({
                  value: lang,
                  label: LOCALES[lang],
                }))}
                onChange={({ detail }) => setSelectedLang(detail.selectedOption)}
              />
            </FormField>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Toggle
              data-test-id="visual-refresh-toggle"
              checked={selectedRefresh}
              disabled={!!ALWAYS_VISUAL_REFRESH}
              onChange={({ detail }) => setSelectedRefresh(detail.checked)}
            >
              Visual refresh
            </Toggle>

            <Toggle
              data-test-id="density-toggle"
              checked={selectedDensity === Density.Compact}
              onChange={({ detail }) => setSelectedDensity(detail.checked ? Density.Compact : Density.Comfortable)}
            >
              Compact mode
            </Toggle>

            <Toggle
              data-test-id="disabled-motion-toggle"
              checked={selectedMotionDisabled}
              onChange={({ detail }) => setSelectedMotionDisabled(detail.checked)}
            >
              Disable motion
            </Toggle>
          </SpaceBetween>
        </ColumnLayout>
      </Modal>
    </>
  );
}
