// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import InternalSpaceBetween from '../../space-between/internal';
import InternalRadioGroup from '../../radio-group/internal';
import InternalExpandableSection from '../../expandable-section/internal';
import InternalDrawer from '../../drawer/internal';
import InternalFormField from '../../form-field/internal';

interface DataSettingProps {
  label: string;
  attribute: string;
  value: string;
  setValue: (value: string) => void;
  items: Array<{ value: string; label: string }>;
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

export default function UserSettingsDrawerContent() {
  const [visualMode, setVisualMode] = useState('light-mode');
  const [compactMode, setCompactMode] = useState('comfortable-mode');
  const [contentWidth, setContentWidth] = useState('content');
  const [disableMotion, setDisableMotion] = useState('motion-enabled');
  const [links, setLinks] = useState('underline');
  const [highContrastHeader, setHighContrastHeader] = useState('enabled');
  const [direction, setDirection] = useState('ltr');
  const [notificationsPosition, setNotificationsPosition] = useState('top-center');

  return (
    <InternalDrawer header={<h2>User settings</h2>}>
      <InternalSpaceBetween size="l">
        <InternalExpandableSection headerText="Theme" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
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
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Layout" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
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
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Accessibility" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
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
          </InternalSpaceBetween>
        </InternalExpandableSection>
      </InternalSpaceBetween>
    </InternalDrawer>
  );
}
