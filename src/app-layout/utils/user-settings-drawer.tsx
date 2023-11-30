// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import InternalSpaceBetween from '../../space-between/internal';
import InternalRadioGroup from '../../radio-group/internal';
import InternalExpandableSection from '../../expandable-section/internal';
import InternalDrawer from '../../drawer/internal';
import InternalFormField from '../../form-field/internal';
import InternalSelect from '../../select/internal';
import ColumnLayout from '../../column-layout/internal';
import { SelectProps } from '../../select/interfaces';
import { useLocalStorage } from './use-local-storage';

interface DataSettingProps {
  label: string;
  attribute: string;
  value: string;
  setValue: (value: string) => void;
  items: Array<{ value: string; label: string }>;
}

interface SelectSettingProps {
  label: string;
  attribute: string;
  value: SelectProps.Option | null;
  setValue: (value: SelectProps.Option | null) => void;
  items: SelectProps.Options;
}

function DataSetting(props: DataSettingProps) {
  return (
    <InternalFormField label={props.label}>
      <InternalRadioGroup
        onChange={({ detail }) => {
          props.setValue(detail.value);
          document.body.setAttribute(`data-user-settings-${props.attribute}`, detail.value);
        }}
        value={props.value}
        items={props.items}
      />
    </InternalFormField>
  );
}

function SelectSetting(props: SelectSettingProps) {
  return (
    <InternalFormField label={props.label}>
      <InternalSpaceBetween size="xs" direction="horizontal">
        <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Ctrl + </span>
        <InternalSelect
          selectedOption={props.value}
          onChange={({ detail }) => {
            props.setValue(detail.selectedOption);
            detail.selectedOption.value &&
              document.body.setAttribute(`data-user-settings-${props.attribute}`, detail.selectedOption.value);
          }}
          options={props.items}
        />
      </InternalSpaceBetween>
    </InternalFormField>
  );
}

const selectOptions: SelectProps.Options = [
  { value: 'a' },
  { value: 'b' },
  { value: 'c' },
  { value: 'd' },
  { value: 'e' },
  { value: 'f' },
  { value: 'g' },
  { value: 'h' },
  { value: 'i' },
  { value: 'j' },
  { value: 'k' },
  { value: 'l' },
  { value: 'm' },
  { value: 'n' },
  { value: 'o' },
  { value: 'p' },
  { value: 'q' },
  { value: 'r' },
  { value: 's' },
  { value: 't' },
  { value: 'u' },
  { value: 'v' },
  { value: 'w' },
  { value: 'x' },
  { value: 'y' },
  { value: 'z' },
];

export default function UserSettingsDrawerContent() {
  const [visualMode, setVisualMode] = useLocalStorage('visual-mode', 'light-mode');
  const [compactMode, setCompactMode] = useLocalStorage('compact-mode', 'comfortable-mode');
  const [contentWidth, setContentWidth] = useLocalStorage('layout-width', 'content');
  const [disableMotion, setDisableMotion] = useLocalStorage('disable-motion', 'motion-enabled');
  const [links, setLinks] = useLocalStorage('accessibility-links', 'underline');
  const [highContrastHeader, setHighContrastHeader] = useLocalStorage('theme-high-contrast-header', 'enabled');
  const [direction, setDirection] = useLocalStorage('dir', 'ltr');
  const [notificationsPosition, setNotificationsPosition] = useLocalStorage(
    'layout-notifications-position',
    'top-center'
  );

  const [navigationKey, setNavigationKey] = useState<SelectProps.Option | null>(null);
  const [toolsKey, setToolsKey] = useState<SelectProps.Option | null>(null);
  const [flashbarKey, setFlashbarKey] = useState<SelectProps.Option | null>(null);
  const [splitPanelKey, setSplitPanelKey] = useState<SelectProps.Option | null>(null);

  return (
    <InternalDrawer header={<h2>User settings</h2>}>
      <InternalSpaceBetween size="l">
        <InternalExpandableSection headerText="Theme" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
            <ColumnLayout columns={3}>
              <InternalFormField label="Visual mode">
                <InternalRadioGroup
                  onChange={({ detail }) => {
                    setVisualMode(detail.value);
                    if (detail.value === 'awsui-dark-mode') {
                      document.body.classList.add(detail.value);
                    } else {
                      document.body.classList.remove('awsui-dark-mode');
                    }
                  }}
                  value={visualMode}
                  items={[
                    { value: 'light-mode', label: 'Light mode' },
                    { value: 'awsui-dark-mode', label: 'Dark mode' },
                  ]}
                />
              </InternalFormField>
              <InternalFormField label="Compact mode">
                <InternalRadioGroup
                  onChange={({ detail }) => {
                    setCompactMode(detail.value);
                    if (detail.value === 'awsui-compact-mode') {
                      document.body.classList.add(detail.value);
                    } else {
                      document.body.classList.remove('awsui-compact-mode');
                    }
                  }}
                  value={compactMode}
                  items={[
                    { value: 'comfortable-mode', label: 'Comfortable' },
                    { value: 'awsui-compact-mode', label: 'Compact' },
                  ]}
                />
              </InternalFormField>
              <DataSetting
                label="High contrast header"
                attribute="theme-high-contrast-header"
                value={highContrastHeader}
                setValue={setHighContrastHeader}
                items={[
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
              />
            </ColumnLayout>
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Layout" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
            <ColumnLayout columns={3}>
              <DataSetting
                label="Layout width"
                attribute="layout-width"
                value={contentWidth}
                setValue={setContentWidth}
                items={[
                  { value: 'content', label: 'Optimized for content' },
                  { value: 'full-width', label: 'Full viewport' },
                ]}
              />
              <InternalFormField label="Direction">
                <InternalRadioGroup
                  onChange={({ detail }) => {
                    setDirection(detail.value);
                    document.body.setAttribute('dir', detail.value);
                  }}
                  value={direction}
                  items={[
                    { value: 'ltr', label: 'Left-to-right' },
                    { value: 'rtl', label: 'Right-to-left' },
                  ]}
                />
              </InternalFormField>
              <DataSetting
                label="Notifications position"
                attribute="layout-notifications-position"
                value={notificationsPosition}
                setValue={setNotificationsPosition}
                items={[
                  { value: 'top-center', label: 'Top center' },
                  { value: 'bottom-right', label: 'Bottom right' },
                ]}
              />
            </ColumnLayout>
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Accessibility" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
            <ColumnLayout columns={3}>
              <InternalFormField label="Disable motion">
                <InternalRadioGroup
                  onChange={({ detail }) => {
                    setDisableMotion(detail.value);
                    if (detail.value === 'awsui-motion-disabled') {
                      document.body.classList.add(detail.value);
                    }
                    if (detail.value === 'motion-enabled') {
                      document.body.classList.remove('awsui-motion-disabled');
                    }
                  }}
                  value={disableMotion}
                  items={[
                    { value: 'motion-enabled', label: 'Enable motion' },
                    { value: 'awsui-motion-disabled', label: 'Disable motion' },
                  ]}
                />
              </InternalFormField>
              <DataSetting
                label="Links"
                attribute="accessibility-links"
                value={links}
                setValue={setLinks}
                items={[
                  { value: 'underline', label: 'Underlined' },
                  { value: 'no-underline', label: 'No underline' },
                ]}
              />
            </ColumnLayout>
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Keyboard shortcuts" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
            <ColumnLayout columns={3}>
              <SelectSetting
                label="Navigation toggle"
                attribute="customization-toggle-navigation-modifier"
                value={navigationKey}
                setValue={setNavigationKey}
                items={selectOptions}
              />
              <SelectSetting
                label="Tools toggle"
                attribute="customization-toggle-tools-modifier"
                value={toolsKey}
                setValue={setToolsKey}
                items={selectOptions}
              />
              <SelectSetting
                label="Flashbar toggle"
                attribute="customization-toggle-stacked-flashbar-modifier"
                value={flashbarKey}
                setValue={setFlashbarKey}
                items={selectOptions}
              />
              <SelectSetting
                label="Split panel toggle"
                attribute="customization-toggle-split-panel-modifier"
                value={splitPanelKey}
                setValue={setSplitPanelKey}
                items={selectOptions}
              />
            </ColumnLayout>
          </InternalSpaceBetween>
        </InternalExpandableSection>
      </InternalSpaceBetween>
    </InternalDrawer>
  );
}
