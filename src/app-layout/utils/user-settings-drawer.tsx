// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalBox from '../../box/internal';
import InternalDrawer from '../../drawer/internal';
import InternalExpandableSection from '../../expandable-section/internal';
import InternalFormField from '../../form-field/internal';
import InternalHeader from '../../header/internal';
import InternalSelect from '../../select/internal';
import InternalSpaceBetween from '../../space-between/internal';
import { useLocalStorage } from './use-local-storage';

const keyOptions = [
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
  /**
   * Theme properties
   */
  const [colorScheme, setColorScheme] = useLocalStorage('color-scheme', { label: 'Light mode', value: 'light-mode' });
  const [density, setDensity] = useLocalStorage('density', { label: 'Comfortable', value: 'comfortable-mode' });
  const [highContrastHeader, setHighContrastHeader] = useLocalStorage('high-contrast-header', {
    label: 'Enabled',
    value: 'enabled',
  });
  const [borderRadius, setBorderRadius] = useLocalStorage('border-radius', { label: 'Rounded', value: 'rounded' });

  /**
   * Layout properties
   */
  const [contentWidth, setContentWidth] = useLocalStorage('content-width', { label: 'Optimized', value: 'optimized' });

  /**
   * Accessibility properties
   */
  const [motion, setMotion] = useLocalStorage('motion', { label: 'Enabled', value: 'enabled' });
  const [links, setLinks] = useLocalStorage('links', { label: 'Underlined', value: 'underlined' });

  /**
   * Internationalization properties
   */
  const [direction, setDirection] = useLocalStorage('direction', { label: 'Left to Right', value: 'ltr' });
  const [notificationsPosition, setNotificationsPosition] = useLocalStorage('notifications-position', {
    label: 'Top, Center',
    value: 'top-center',
  });

  /**
   * Keyboard shortcuts
   */
  const [toggleNavigationKey, setToggleNavigationKey] = useLocalStorage('toggle-navigation-key', { value: null });
  const [toggleToolsKey, setToggleToolsKey] = useLocalStorage('toggle-tools-key', { value: null });
  const [toggleStackedNotificationsKey, setToggleStackedNotificationsKey] = useLocalStorage(
    'toggle-stacked-notifications-key',
    { value: null }
  );
  const [toggleSplitPanelKey, setToggleSplitPanelKey] = useLocalStorage('toggle-split-panel-key', { value: null });

  return (
    <InternalDrawer header={<h2>User Settings</h2>}>
      <InternalBox variant="p">
        Cloudscape user settings were built to accommodate the unique needs of each individual user. Your workflow is
        yours to optimize as you see fit.
      </InternalBox>

      <InternalBox variant="p">
        <i>
          Do you have an idea for a user setting addition? Or, perhaps, suggestions on how we can further improve your
          experience?
        </i>
      </InternalBox>

      <InternalBox variant="p">
        <strong>Send us your thoughts in the feedback section. ❤️</strong>
      </InternalBox>

      <InternalBox margin={{ bottom: 'm', top: 'm' }}>
        <div style={{ border: '1px solid #eaeded', width: '100%' }}></div>
      </InternalBox>

      <InternalSpaceBetween size="xs">
        <InternalExpandableSection headerText="Theme" variant="footer">
          <InternalSpaceBetween size="m">
            <InternalFormField
              description="Adjusting the color scheme can improve readability and help reduce eye strain."
              label="Color scheme"
            >
              <InternalSelect
                selectedOption={colorScheme}
                onChange={({ detail }) => {
                  setColorScheme(detail.selectedOption);

                  if (detail.selectedOption.value === 'awsui-dark-mode') {
                    document.body.classList.add(detail.selectedOption.value);
                  } else {
                    document.body.classList.remove('awsui-dark-mode');
                  }
                }}
                options={[
                  {
                    label: 'Light mode',
                    value: 'light-mode',
                  },
                  {
                    label: 'Dark mode',
                    value: 'awsui-dark-mode',
                  },
                ]}
              />
            </InternalFormField>

            <InternalFormField
              description="Adjusting the density can increase the amount of content that fits in the viewport."
              label="Density"
            >
              <InternalSelect
                selectedOption={density}
                options={[
                  {
                    label: 'Comfortable',
                    value: 'comfortable-mode',
                  },
                  {
                    label: 'Compact',
                    value: 'awsui-compact-mode',
                  },
                ]}
                onChange={({ detail }) => {
                  setDensity(detail.selectedOption);

                  if (detail.selectedOption.value === 'awsui-compact-mode') {
                    document.body.classList.add(detail.selectedOption.value);
                  } else {
                    document.body.classList.remove('awsui-compact-mode');
                  }
                }}
              />
            </InternalFormField>

            <InternalFormField
              description="Modify the presentation of the header content on a page."
              label="High contrast header"
            >
              <InternalSelect
                selectedOption={highContrastHeader}
                options={[
                  {
                    label: 'Enabled',
                    value: 'enabled',
                  },
                  {
                    label: 'Disabled',
                    value: 'disabled',
                  },
                ]}
                onChange={({ detail }) => {
                  setHighContrastHeader(detail.selectedOption);
                  document.body.setAttribute(
                    'data-user-settings-theme-high-contrast-header',
                    detail.selectedOption.value ?? ''
                  );
                }}
              />
            </InternalFormField>

            <InternalFormField description="Add or remove curved corners for elements on a page." label="Border radius">
              <InternalSelect
                selectedOption={borderRadius}
                options={[
                  {
                    label: 'Rounded',
                    value: 'rounded',
                  },
                  {
                    label: 'Straight edges',
                    value: 'straight-edges',
                  },
                ]}
                onChange={({ detail }) => {
                  setBorderRadius(detail.selectedOption);

                  document.body.setAttribute(
                    'data-user-settings-theme-border-radius',
                    detail.selectedOption.value ?? ''
                  );
                }}
              />
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>

        <InternalExpandableSection headerText="Layout" variant="footer">
          <InternalSpaceBetween size="m">
            <InternalFormField
              description="Optimize widths based on the page content or always use the full viewport width."
              label="Content width"
            >
              <InternalSelect
                selectedOption={contentWidth}
                onChange={({ detail }) => {
                  setContentWidth(detail.selectedOption);

                  document.body.setAttribute(
                    'data-user-settings-layout-content-width',
                    detail.selectedOption.value ?? ''
                  );
                }}
                options={[
                  {
                    label: 'Optimized',
                    value: 'optimized',
                  },
                  {
                    label: 'Full width',
                    value: 'full-width',
                  },
                ]}
              />
            </InternalFormField>

            <InternalFormField
              description="Position the notifications inline above the page content or overlay as toasts."
              label="Notifications position"
            >
              <InternalSelect
                selectedOption={notificationsPosition}
                onChange={({ detail }) => {
                  setNotificationsPosition(detail.selectedOption);

                  document.body.setAttribute(
                    'data-user-settings-layout-notifications-position',
                    detail.selectedOption.value ?? ''
                  );
                }}
                options={[
                  {
                    label: 'Top, Center',
                    value: 'top-center',
                  },
                  {
                    label: 'Bottom, Right',
                    value: 'bottom-right',
                  },
                ]}
              />
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>

        <InternalExpandableSection headerText="Accessibility" variant="footer">
          <InternalSpaceBetween size="m">
            <InternalFormField
              description="Adjust the motion based on visual preferences or to accommodate motion sensitivities."
              label="Motion"
            >
              <InternalSelect
                selectedOption={motion}
                options={[
                  {
                    label: 'Enabled',
                    value: 'enabled',
                  },
                  {
                    label: 'Disabled',
                    value: 'awsui-motion-disabled',
                  },
                ]}
                onChange={({ detail }) => {
                  setMotion(detail.selectedOption);

                  if (detail.selectedOption.value === 'awsui-motion-disabled') {
                    document.body.classList.add(detail.selectedOption.value);
                  } else {
                    document.body.classList.remove('awsui-motion-disabled');
                  }
                }}
              />
            </InternalFormField>

            <InternalFormField
              description="Adjust link styles to assist in element distinction or reduce visual noise."
              label="Links"
            >
              <InternalSelect
                selectedOption={links}
                options={[
                  {
                    label: 'Underlined',
                    value: 'underlined',
                  },
                  {
                    label: 'No underline',
                    value: 'no-underline',
                  },
                ]}
                onChange={({ detail }) => {
                  setLinks(detail.selectedOption);

                  document.body.setAttribute(
                    'data-user-settings-accessibility-links',
                    detail.selectedOption.value ?? ''
                  );
                }}
              />
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>

        <InternalExpandableSection headerText="Internationalization" variant="footer">
          <InternalSpaceBetween size="m">
            <InternalFormField
              description="Set the document direction to correspond with native locale."
              label="Direction"
            >
              <InternalSelect
                selectedOption={direction}
                onChange={({ detail }) => {
                  setDirection(detail.selectedOption);
                  document.body.setAttribute('dir', detail.selectedOption.value ?? '');
                }}
                options={[
                  {
                    label: 'Left to Right',
                    value: 'ltr',
                  },
                  {
                    label: 'Right to Left',
                    value: 'rtl',
                  },
                ]}
              />
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>

        <InternalExpandableSection headerText="One more thing..." variant="footer">
          <InternalSpaceBetween size="m">
            <InternalFormField
              description="Set a keyboard shortcut to open and close the navigation."
              label="Toggle navigation"
            >
              <InternalSpaceBetween size="xs" direction="horizontal">
                <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Ctrl +</span>

                <InternalSelect
                  selectedOption={toggleNavigationKey}
                  onChange={({ detail }) => {
                    setToggleNavigationKey(detail.selectedOption);

                    detail.selectedOption.value &&
                      document.body.setAttribute(
                        `data-user-settings-keyboard-shortcuts-toggle-navigation-key`,
                        detail.selectedOption.value
                      );
                  }}
                  options={keyOptions}
                />
              </InternalSpaceBetween>
            </InternalFormField>

            <InternalFormField description="Set a keyboard shortcut to open and close the tools." label="Toggle tools">
              <InternalSpaceBetween size="xs" direction="horizontal">
                <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Ctrl +</span>

                <InternalSelect
                  selectedOption={toggleToolsKey}
                  onChange={({ detail }) => {
                    setToggleToolsKey(detail.selectedOption);

                    detail.selectedOption.value &&
                      document.body.setAttribute(
                        `data-user-settings-keyboard-shortcuts-toggle-tools-key`,
                        detail.selectedOption.value
                      );
                  }}
                  options={keyOptions}
                />
              </InternalSpaceBetween>
            </InternalFormField>

            <InternalFormField
              description="Set a keyboard shortcut to expand and collapse stacked notifications."
              label="Toggle stacked notifications"
            >
              <InternalSpaceBetween size="xs" direction="horizontal">
                <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Ctrl +</span>

                <InternalSelect
                  selectedOption={toggleStackedNotificationsKey}
                  onChange={({ detail }) => {
                    setToggleStackedNotificationsKey(detail.selectedOption);

                    detail.selectedOption.value &&
                      document.body.setAttribute(
                        `data-user-settings-keyboard-shortcuts-toggle-stacked-notifications-key`,
                        detail.selectedOption.value
                      );
                  }}
                  options={keyOptions}
                />
              </InternalSpaceBetween>
            </InternalFormField>

            <InternalFormField
              description="Set a keyboard shortcut to expand and collapse the split panel."
              label="Toggle split panel"
            >
              <InternalSpaceBetween size="xs" direction="horizontal">
                <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Ctrl +</span>

                <InternalSelect
                  selectedOption={toggleSplitPanelKey}
                  onChange={({ detail }) => {
                    setToggleSplitPanelKey(detail.selectedOption);

                    detail.selectedOption.value &&
                      document.body.setAttribute(
                        `data-user-settings-keyboard-shortcuts-toggle-splitpanel-key`,
                        detail.selectedOption.value
                      );
                  }}
                  options={keyOptions}
                />
              </InternalSpaceBetween>
            </InternalFormField>
          </InternalSpaceBetween>
        </InternalExpandableSection>

        <InternalBox margin={{ top: 's' }}>
          <div style={{ border: '1px solid #eaeded', width: '100%' }}></div>
        </InternalBox>

        <InternalHeader variant="h3">Feedback</InternalHeader>
      </InternalSpaceBetween>
    </InternalDrawer>
  );
}
