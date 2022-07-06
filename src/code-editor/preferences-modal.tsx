// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import InternalBox from '../box/internal';
import { InternalButton } from '../button/internal';
import InternalCheckbox from '../checkbox/internal';
import InternalColumnLayout from '../column-layout/internal';
import InternalFormField from '../form-field/internal';
import InternalModal from '../modal/internal';
import { SelectProps } from '../select/interfaces';
import InternalSelect from '../select/internal';
import InternalSpaceBetween from '../space-between/internal';
import { FormFieldDomContext } from '../internal/context/form-field-context';
import { NonCancelableCustomEvent } from '../internal/events';
import { LightThemes, DarkThemes } from './ace-themes';
import { CodeEditorProps } from './interfaces';

interface PreferencesModali18nStrings {
  header: string;
  cancel: string;
  confirm: string;
  wrapLines: string;
  theme: string;
  lightThemes: string;
  darkThemes: string;
}

interface PreferencesModalProps {
  preferences?: Partial<CodeEditorProps.Preferences>;

  i18nStrings: PreferencesModali18nStrings;

  defaultTheme: CodeEditorProps.Theme;

  onConfirm: (preferences: CodeEditorProps.Preferences) => void;
  onDismiss: () => void;
}

export default (props: PreferencesModalProps) => {
  const [wrapLines, setWrapLines] = useState<boolean>(props.preferences?.wrapLines ?? true);
  const [theme, setTheme] = useState<CodeEditorProps.Theme>(props.preferences?.theme ?? props.defaultTheme);
  const [selectedThemeOption, setSelectedThemeOption] = useState<SelectProps.Option>(
    () => [...LightThemes, ...DarkThemes].filter(t => t.value === theme)[0]
  );

  const onThemeSelected = (e: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => {
    setTheme(e.detail.selectedOption.value as CodeEditorProps.Theme);
    setSelectedThemeOption(e.detail.selectedOption);
  };

  return (
    <FormFieldDomContext.RootProvider value={{}}>
      <InternalModal
        size="medium"
        visible={true}
        onDismiss={props.onDismiss}
        header={props.i18nStrings.header}
        closeAriaLabel={props.i18nStrings.cancel}
        footer={
          <InternalBox float="right">
            <InternalSpaceBetween direction="horizontal" size="xs">
              <InternalButton onClick={props.onDismiss}>{props.i18nStrings.cancel}</InternalButton>
              <InternalButton onClick={() => props.onConfirm({ wrapLines, theme })} variant="primary">
                {props.i18nStrings.confirm}
              </InternalButton>
            </InternalSpaceBetween>
          </InternalBox>
        }
      >
        <InternalColumnLayout columns={2} variant="text-grid">
          <div>
            <InternalCheckbox checked={wrapLines} onChange={e => setWrapLines(e.detail.checked)}>
              {props.i18nStrings.wrapLines}
            </InternalCheckbox>
          </div>
          <div>
            <InternalFormField label={props.i18nStrings.theme}>
              <InternalSelect
                selectedOption={selectedThemeOption}
                onChange={onThemeSelected}
                options={[
                  { label: props.i18nStrings.lightThemes, options: LightThemes },
                  { label: props.i18nStrings.darkThemes, options: DarkThemes },
                ]}
                filteringType="auto"
              />
            </InternalFormField>
          </div>
        </InternalColumnLayout>
      </InternalModal>
    </FormFieldDomContext.RootProvider>
  );
};
