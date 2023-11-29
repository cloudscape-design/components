// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import InternalSpaceBetween from '../../space-between/internal';
import InternalRadioGroup from '../../radio-group/internal';
import InternalExpandableSection from '../../expandable-section/internal';
import InternalDrawer from '../../drawer/internal';
import InternalFormField from '../../form-field/internal';

export default function UserSettingsDrawerContent() {
  const [visualMode, setVisualMode] = useState('light-mode');
  const [compactMode, setCompactMode] = useState('comfortable-mode');
  const [contentWidth, setContentWidth] = useState('content');
  const [disableMotion, setDisableMotion] = useState('motion-enabled');

  return (
    <InternalDrawer header={<h2>User settings</h2>}>
      <InternalSpaceBetween size="l">
        <InternalExpandableSection headerText="Display" defaultExpanded={true}>
          <InternalSpaceBetween size="l">
            <InternalFormField label="Visual mode">
              <InternalRadioGroup
                onChange={({ detail }) => {
                  setVisualMode(detail.value);
                  if (detail.value === 'awsui-dark-mode') {
                    document.body.classList.add(detail.value);
                  }
                  if (detail.value === 'light-mode') {
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
                  }
                  if (detail.value === 'comfortable-mode') {
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
            <InternalFormField label="Layout width">
              <InternalRadioGroup
                onChange={({ detail }) => {
                  setContentWidth(detail.value);
                  document.body.setAttribute('data-user-settings-layout-width', detail.value);
                }}
                value={contentWidth}
                items={[
                  { value: 'content', label: 'Optimized for content' },
                  { value: 'full-width', label: 'Full viewport' },
                ]}
              />
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>
        <InternalExpandableSection headerText="Accessibility" defaultExpanded={true}>
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
        </InternalExpandableSection>
      </InternalSpaceBetween>
    </InternalDrawer>
  );
}
