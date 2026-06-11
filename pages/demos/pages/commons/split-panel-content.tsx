// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Checkbox from '@cloudscape-design/components/checkbox';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import Slider from '@cloudscape-design/components/slider';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { applyCustomTheme } from '../../common/apply-theme';
import {
  generateThemeConfigConsole,
  generateThemeConfigCoreDefault,
  generateThemeConfigCW,
  themeCoreConfig,
} from '../../common/theme-cw';

interface ThemeConfig {
  colorSelectedAccent?: string;
  borderWidthButton?: string;
  borderWidthField?: string;
  borderWidthIconSmall?: string;
  borderWidthIconNormal?: string;
  borderWidthIconMedium?: string;
  borderWidthIconBig?: string;
  borderWidthIconLarge?: string;
  borderWidthItemSelected?: string;
  borderWidthCardSelected?: string;
  borderWidthToken?: string;
  borderRadiusButton?: string;
  borderRadiusInput?: string;
  borderRadiusContainer?: string;
  spaceScaledXxxs?: string;
  spaceScaledXxs?: string;
  spaceScaledXs?: string;
  spaceScaledS?: string;
  spaceScaledM?: string;
  spaceScaledL?: string;
  spaceScaledXl?: string;
  spaceScaledXxl?: string;
  colorBackgroundButtonPrimaryDefault?: string;
  colorBackgroundButtonPrimaryHover?: string;
  colorTextButtonPrimaryDefault?: string;
  fontSizeBodyS?: string;
  fontSizeBodyM?: string;
  fontSizeHeadingXl?: string;
  fontSizeHeadingL?: string;
  fontSizeHeadingM?: string;
  fontSizeHeadingS?: string;
  fontSizeHeadingXs?: string;
  lineHeightHeadingXl?: string;
  lineHeightHeadingL?: string;
  lineHeightHeadingM?: string;
  lineHeightHeadingS?: string;
  lineHeightHeadingXs?: string;
  shadowContainer?: string;
  fontFamilyBase?: string;
  colorTextBodyDefault?: string;
  colorTextLinkDefault?: string;
  colorTextLinkHover?: string;
}

export function GlobalSplitPanelContent() {
  // Helper function to extract numeric value from CSS value like "24px" -> "24"
  const extractNumericValue = (value: string | undefined): string => {
    if (!value) {
      return '';
    }
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    return match ? match[1] : value;
  };

  // Helper function to format color object to string
  const formatColorValue = (value: { light: string; dark: string } | undefined): string => {
    if (!value) {
      return '';
    }
    return `light: '${value.light}', dark: '${value.dark}'`;
  };

  const [fontStretch, setFontStretch] = useState(95);
  const [themeValue, setThemeValue] = useState('core-default');
  const [checked, setChecked] = useState(false);
  const [checkedFontSmooth, setCheckedFontSmooth] = useState(true);
  const [blueAccent, setBlueAccent] = useState(true);
  const linkColorOptions: SelectProps.Options = [
    {
      label: 'Blue for info links only',
      value: 'blue-secondary',
      description:
        'Recommended default: primary links use the body text color, while info links use blue for clearer distinction.',
    },
    { label: 'Same color as normal text', value: 'same-as-text' },
    { label: 'Lighter than normal text', value: 'lighter' },
    { label: 'Darker than normal text', value: 'darker' },
    { label: 'Blue for all link texts', value: 'blue' },
  ];
  const [selectedLinkColor, setSelectedLinkColor] = useState<SelectProps.Option>(linkColorOptions[0]);
  const [config, setConfig] = useState<ThemeConfig>({
    colorSelectedAccent: formatColorValue({ light: '#1b232d', dark: '#f3f3f7' }),
    borderWidthButton: extractNumericValue((themeCoreConfig.tokens?.borderWidthButton as string) || '2px'),
    borderWidthIconSmall: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconSmall as string) || '1.5px'),
    borderWidthIconNormal: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconNormal as string) || '1.5px'),
    borderWidthIconMedium: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconMedium as string) || '2px'),
    borderWidthIconBig: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconBig as string) || '2px'),
    borderWidthIconLarge: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconLarge as string) || '2.5px'),
    borderWidthItemSelected: extractNumericValue((themeCoreConfig.tokens?.borderWidthItemSelected as string) || '1px'),
    borderWidthCardSelected: extractNumericValue((themeCoreConfig.tokens?.borderWidthCardSelected as string) || '1px'),
    borderWidthToken: extractNumericValue((themeCoreConfig.tokens?.borderWidthToken as string) || '1px'),
    borderRadiusButton: extractNumericValue((themeCoreConfig.tokens?.borderRadiusButton as string) || '8px'),
    borderRadiusContainer: extractNumericValue((themeCoreConfig.tokens?.borderRadiusContainer as string) || '12px'),
    fontSizeHeadingXl: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingXl as string) || '26px'),
    fontSizeHeadingL: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingL as string) || '22px'),
    fontSizeHeadingM: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingM as string) || '20px'),
    fontSizeHeadingS: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingS as string) || '18px'),
    fontSizeHeadingXs: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingXs as string) || '16px'),
    lineHeightHeadingXl: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingXl as string) || '32px'),
    lineHeightHeadingL: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingL as string) || '26px'),
    lineHeightHeadingM: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingM as string) || '24px'),
    lineHeightHeadingS: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingS as string) || '22px'),
    lineHeightHeadingXs: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingXs as string) || '20px'),
    fontFamilyBase: (themeCoreConfig.tokens?.fontFamilyBase as string) || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fontFamilyOptions: SelectProps.Options = [
    { label: 'NotoSans', value: "'NotoSans', 'Noto Sans', sans-serif" },
    { label: 'AmazonEmberDisplay', value: "'AmazonEmberDisplay', 'Amazon Ember Display', sans-serif" },
  ];

  // Apply CSS class to body when toggle changes
  useEffect(() => {
    const applyThemeChanges = () => {
      try {
        // Parse colorSelectedAccent if present
        let customAccentColor;
        if (config.colorSelectedAccent) {
          const lightMatch = config.colorSelectedAccent.match(/light:\s*'([^']+)'/);
          const darkMatch = config.colorSelectedAccent.match(/dark:\s*'([^']+)'/);
          if (lightMatch && darkMatch) {
            customAccentColor = { light: lightMatch[1], dark: darkMatch[1] };
          }
        }

        // Select base theme based on checkbox selection
        let baseTheme;
        let shouldApplyCustomTokens = true;

        if (themeValue === 'console') {
          // Console theme: Minimal theme with only specific tokens
          // Don't apply form customizations for Console theme
          baseTheme = generateThemeConfigConsole();
          shouldApplyCustomTokens = false;
        } else if (themeValue === 'core-default') {
          // New Core default theme: Complete theme from theme-core.ts
          baseTheme = customAccentColor
            ? generateThemeConfigCoreDefault(customAccentColor)
            : generateThemeConfigCoreDefault();
          shouldApplyCustomTokens = false;
        } else {
          // New CloudWatch theme: Complete theme with form customizations
          const accentColor = blueAccent ? { light: '#006CE0', dark: '#42B4FF' } : customAccentColor;
          const accentSubtleHover = blueAccent ? { light: '#F0FBFF', dark: '#001129' } : undefined;
          baseTheme = generateThemeConfigCW(accentColor, accentSubtleHover);
          shouldApplyCustomTokens = true;
        }

        // Build the theme object

        let themeTokens: any = { ...baseTheme.tokens };

        // Only apply custom tokens from form for Option A
        if (shouldApplyCustomTokens) {
          const colorTokenKeys = ['colorTextBodyDefault', 'colorTextLinkDefault', 'colorTextLinkHover'];
          const customTokens = Object.fromEntries(
            Object.entries(config)
              .filter(([key, value]) => key !== 'colorSelectedAccent' && value !== undefined && value !== '')
              .map(([key, value]) => {
                // Parse color tokens that use "light: '...', dark: '...'" format
                if (colorTokenKeys.includes(key)) {
                  const lightMatch = String(value).match(/light:\s*'([^']+)'/);
                  const darkMatch = String(value).match(/dark:\s*'([^']+)'/);
                  if (lightMatch && darkMatch) {
                    return [key, { light: lightMatch[1], dark: darkMatch[1] }];
                  }
                  return [key, undefined]; // skip invalid color values
                }
                // Font family should not have 'px' appended
                if (key === 'fontFamilyBase') {
                  return [key, value];
                }
                // If value is a number without unit, append 'px'
                const stringValue = String(value).trim();
                if (stringValue && /^\d+(\.\d+)?$/.test(stringValue)) {
                  return [key, `${stringValue}px`];
                }
                return [key, value];
              })
              .filter(([, value]) => value !== undefined)
          );
          themeTokens = { ...themeTokens, ...customTokens };
        }

        // Apply borderRadiusFlashbar only when toggle is on
        if (checked) {
          themeTokens.borderRadiusFlashbar = '0px';
        }

        const updatedTheme = {
          tokens: themeTokens,

          referenceTokens: (baseTheme as any).referenceTokens || {},

          contexts: (baseTheme as any).contexts || {},
        };

        // Apply theme - reset happens automatically in applyCustomTheme

        applyCustomTheme(updatedTheme as any);
      } catch (error) {
        console.error('Failed to apply theme:', error);
      }
    };

    if (checked) {
      document.body.classList.add('filled-flashbar');
    } else {
      document.body.classList.remove('filled-flashbar');
    }

    // Apply custom CSS class when Console theme is not selected
    if (themeValue !== 'console') {
      document.body.classList.add('custom-css-enabled');
    } else {
      document.body.classList.remove('custom-css-enabled');
    }

    // Toggle blue-secondary link color class
    if (selectedLinkColor?.value === 'blue-secondary') {
      document.body.classList.add('blue-secondary-link');
    } else {
      document.body.classList.remove('blue-secondary-link');
    }

    // Apply theme changes when toggle state or console theme changes
    applyThemeChanges();
  }, [checked, config, themeValue, selectedLinkColor, blueAccent]);

  // Toggle font-smooth-auto class on body
  // When checkbox is OFF (default), font smoothing is subpixel-antialiased (normal browser behavior)
  // When checkbox is ON, we add the class to set font-smoothing to auto
  useEffect(() => {
    if (checkedFontSmooth) {
      document.body.classList.remove('font-smooth-auto');
    } else {
      document.body.classList.add('font-smooth-auto');
    }
  }, [checkedFontSmooth]);

  // Apply font-stretch globally via injected style tag
  useEffect(() => {
    const styleId = 'font-stretch-override';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `* { font-stretch: ${fontStretch}% !important; }`;
    return () => {
      styleEl?.remove();
    };
  }, [fontStretch]);

  const handleInputChange = (key: keyof ThemeConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const applyThemeChanges = () => {
    try {
      // Parse colorSelectedAccent if present
      let customAccentColor;
      if (config.colorSelectedAccent) {
        const lightMatch = config.colorSelectedAccent.match(/light:\s*'([^']+)'/);
        const darkMatch = config.colorSelectedAccent.match(/dark:\s*'([^']+)'/);
        if (lightMatch && darkMatch) {
          customAccentColor = { light: lightMatch[1], dark: darkMatch[1] };
        }
      }

      // Select base theme based on checkbox selection
      let baseTheme;
      let shouldApplyCustomTokens = true;

      if (themeValue === 'console') {
        // Console theme: Minimal theme with only specific tokens
        // Don't apply form customizations for Console theme
        baseTheme = generateThemeConfigConsole();
        shouldApplyCustomTokens = false;
      } else if (themeValue === 'core-default') {
        // New Core default theme: Complete theme from theme-core.ts
        baseTheme = customAccentColor
          ? generateThemeConfigCoreDefault(customAccentColor)
          : generateThemeConfigCoreDefault();
        shouldApplyCustomTokens = false;
      } else {
        // New CloudWatch theme: Complete theme with form customizations
        const accentColor = blueAccent ? { light: '#006CE0', dark: '#42B4FF' } : customAccentColor;
        const accentSubtleHover = blueAccent ? { light: '#F0FBFF', dark: '#001129' } : undefined;
        baseTheme = generateThemeConfigCW(accentColor, accentSubtleHover);
        shouldApplyCustomTokens = true;
      }

      // Build the theme object

      let themeTokens: any = { ...baseTheme.tokens };

      // Only apply custom tokens from form for Option A
      if (shouldApplyCustomTokens) {
        const customTokens = Object.fromEntries(
          Object.entries(config)
            .filter(([key, value]) => key !== 'colorSelectedAccent' && value !== undefined && value !== '')
            .map(([key, value]) => {
              // Font family should not have 'px' appended
              if (key === 'fontFamilyBase') {
                return [key, value];
              }
              // If value is a number without unit, append 'px'
              const stringValue = String(value).trim();
              if (stringValue && /^\d+(\.\d+)?$/.test(stringValue)) {
                return [key, `${stringValue}px`];
              }
              return [key, value];
            })
        );
        themeTokens = { ...themeTokens, ...customTokens };
      }

      // Apply borderRadiusFlashbar only when toggle is on
      if (checked) {
        themeTokens.borderRadiusFlashbar = '0px';
      }

      const updatedTheme = {
        tokens: themeTokens,

        referenceTokens: (baseTheme as any).referenceTokens || {},

        contexts: (baseTheme as any).contexts || {},
      };

      // Apply theme - reset happens automatically in applyCustomTheme

      applyCustomTheme(updatedTheme as any);
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  const resetTheme = () => {
    setThemeValue('core');
    setChecked(false);
    setCheckedFontSmooth(true);
    setBlueAccent(true);
    setFontStretch(100);
    setSelectedLinkColor(linkColorOptions[0]);
    setConfig({
      colorSelectedAccent: formatColorValue({ light: '#1b232d', dark: '#f3f3f7' }),
      borderWidthButton: extractNumericValue((themeCoreConfig.tokens?.borderWidthButton as string) || '1px'),
      borderWidthIconSmall: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconSmall as string) || '1.5px'),
      borderWidthIconNormal: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconNormal as string) || '1.5px'),
      borderWidthIconMedium: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconMedium as string) || '2px'),
      borderWidthIconBig: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconBig as string) || '2px'),
      borderWidthIconLarge: extractNumericValue((themeCoreConfig.tokens?.borderWidthIconLarge as string) || '2.5px'),
      borderWidthItemSelected: extractNumericValue(
        (themeCoreConfig.tokens?.borderWidthItemSelected as string) || '1px'
      ),
      borderWidthCardSelected: extractNumericValue(
        (themeCoreConfig.tokens?.borderWidthCardSelected as string) || '1px'
      ),
      borderWidthToken: extractNumericValue((themeCoreConfig.tokens?.borderWidthToken as string) || '1px'),
      borderRadiusButton: extractNumericValue((themeCoreConfig.tokens?.borderRadiusButton as string) || '8px'),
      borderRadiusInput: extractNumericValue((themeCoreConfig.tokens?.borderRadiusInput as string) || '8px'),
      borderRadiusContainer: extractNumericValue((themeCoreConfig.tokens?.borderRadiusContainer as string) || '12px'),
      fontSizeHeadingXl: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingXl as string) || '26px'),
      fontSizeHeadingL: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingL as string) || '22px'),
      fontSizeHeadingM: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingM as string) || '20px'),
      fontSizeHeadingS: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingS as string) || '18px'),
      fontSizeHeadingXs: extractNumericValue((themeCoreConfig.tokens?.fontSizeHeadingXs as string) || '16px'),
      lineHeightHeadingXl: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingXl as string) || '32px'),
      lineHeightHeadingL: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingL as string) || '26px'),
      lineHeightHeadingM: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingM as string) || '24px'),
      lineHeightHeadingS: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingS as string) || '22px'),
      lineHeightHeadingXs: extractNumericValue((themeCoreConfig.tokens?.lineHeightHeadingXs as string) || '20px'),
      fontFamilyBase: (themeCoreConfig.tokens?.fontFamilyBase as string) || '',
    });
    setErrors({});
    // Reset to Cloudscape defaults by passing undefined
    applyCustomTheme(undefined);
  };

  return (
    <Box padding={{ vertical: 'm' }}>
      <ColumnLayout borders="horizontal">
        <Box padding={{ bottom: 'l' }}>
          <Box variant="h3" padding={{ vertical: 'm' }}>
            Theme Selection
          </Box>
          <RadioGroup
            onChange={({ detail }) => setThemeValue(detail.value)}
            value={themeValue}
            items={[
              { value: 'core-default', label: 'New Core default' },
              { value: 'core', label: 'New CloudWatch theme', disabled: true },
              { value: 'console', label: 'Current Console', disabled: true },
            ]}
          />
        </Box>

        {false && (
          <>
            <Box padding={{ bottom: 'l' }}>
              <Box variant="h3" padding={{ top: 'xl', bottom: 's' }}>
                Font
              </Box>
              <SpaceBetween size="m">
                <FormField label="fontFamilyBase" errorText={errors.fontFamilyBase}>
                  <Select
                    selectedOption={
                      fontFamilyOptions.find(o => o.value === config.fontFamilyBase) || fontFamilyOptions[0]
                    }
                    onChange={({ detail }) => handleInputChange('fontFamilyBase', detail.selectedOption.value ?? '')}
                    options={fontFamilyOptions}
                  />
                </FormField>
                <FormField label="fontSmooth">
                  <Checkbox onChange={({ detail }) => setCheckedFontSmooth(detail.checked)} checked={checkedFontSmooth}>
                    font-smooth
                  </Checkbox>
                </FormField>
                <FormField label={`fontStretch: ${fontStretch}%`} constraintText="Available only for variable font">
                  <Slider
                    onChange={({ detail }) => setFontStretch(detail.value)}
                    value={fontStretch}
                    max={100}
                    min={90}
                  />
                </FormField>
              </SpaceBetween>
              <Box variant="h3" padding={{ top: 'xl', bottom: 's' }}>
                Accent color
              </Box>
              <SpaceBetween size="xs">
                <FormField label="Link color">
                  <Select
                    selectedOption={selectedLinkColor}
                    onChange={({ detail }) => {
                      setSelectedLinkColor(detail.selectedOption);
                      switch (detail.selectedOption.value) {
                        case 'same-as-text':
                          handleInputChange('colorTextBodyDefault', '');
                          handleInputChange('colorTextLinkDefault', "light: '#0f141a', dark: '#c6c6cd'");
                          handleInputChange('colorTextLinkHover', "light: '#424650', dark: '#FFFFFF'");
                          break;
                        case 'lighter':
                          handleInputChange('colorTextBodyDefault', '');
                          handleInputChange('colorTextLinkDefault', "light: '#656871', dark: '#B4B4BB'");
                          handleInputChange('colorTextLinkHover', "light: '#424650', dark: '#FFFFFF'");
                          break;
                        case 'darker':
                          handleInputChange('colorTextBodyDefault', "light: '#424650', dark: '#c6c6cd'");
                          handleInputChange('colorTextLinkDefault', "light: '#06080A', dark: '#FFFFFF'");
                          handleInputChange('colorTextLinkHover', "light: '#424650', dark: '#FFFFFF'");
                          break;
                        case 'blue':
                          handleInputChange('colorTextBodyDefault', '');
                          handleInputChange('colorTextLinkDefault', "light: '#295EFF', dark: '#7598FF'");
                          handleInputChange('colorTextLinkHover', "light: '#0033CC', dark: '#C2D1FF'");
                          break;
                        case 'blue-secondary':
                          handleInputChange('colorTextBodyDefault', '');
                          handleInputChange('colorTextLinkDefault', "light: '#0f141a', dark: '#c6c6cd'");
                          handleInputChange('colorTextLinkHover', "light: '#424650', dark: '#FFFFFF'");
                          break;
                      }
                    }}
                    options={linkColorOptions}
                  />
                </FormField>
                {/* <FormField label="Accent color">
                <Input
                  type="text"
                  placeholder="light: '#1b232d', dark: '#f3f3f7'"
                  value={config.colorSelectedAccent || ''}
                  onChange={({ detail }) => handleInputChange('colorSelectedAccent', detail.value)}
                />
              </FormField> */}
              </SpaceBetween>
            </Box>
            <Box padding={{ bottom: 'l' }}>
              <SpaceBetween size="xs">
                <FormField label="borderWidthButton" errorText={errors.borderWidthButton}>
                  <Input
                    type="number"
                    placeholder="1px"
                    value={config.borderWidthButton || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthButton', detail.value)}
                  />
                </FormField>

                <FormField label="borderRadiusButton" errorText={errors.borderRadiusButton}>
                  <Input
                    type="number"
                    placeholder="8px"
                    value={config.borderRadiusButton || ''}
                    onChange={({ detail }) => handleInputChange('borderRadiusButton', detail.value)}
                  />
                </FormField>

                <FormField label="borderRadiusContainer" errorText={errors.borderRadiusContainer}>
                  <Input
                    type="number"
                    placeholder="12px"
                    value={config.borderRadiusContainer || ''}
                    onChange={({ detail }) => handleInputChange('borderRadiusContainer', detail.value)}
                  />
                </FormField>

                <FormField label="borderRadiusInput" errorText={errors.borderRadiusInput}>
                  <Input
                    type="number"
                    placeholder="8px"
                    value={config.borderRadiusInput || ''}
                    onChange={({ detail }) => handleInputChange('borderRadiusInput', detail.value)}
                  />
                </FormField>
              </SpaceBetween>
            </Box>

            <Box padding={{ bottom: 'l' }}>
              <Box variant="h3" padding={{ vertical: 'm' }}>
                Icon stroke
              </Box>

              <SpaceBetween size="xs">
                <FormField label="borderWidthIconSmall" errorText={errors.borderWidthIconSmall}>
                  <Input
                    type="number"
                    placeholder="1.5px"
                    value={config.borderWidthIconSmall || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthIconSmall', detail.value)}
                  />
                </FormField>

                <FormField label="borderWidthIconNormal" errorText={errors.borderWidthIconNormal}>
                  <Input
                    type="number"
                    placeholder="1.5px"
                    value={config.borderWidthIconNormal || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthIconNormal', detail.value)}
                  />
                </FormField>

                <FormField label="borderWidthIconMedium" errorText={errors.borderWidthIconMedium}>
                  <Input
                    type="number"
                    placeholder="2px"
                    value={config.borderWidthIconMedium || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthIconMedium', detail.value)}
                  />
                </FormField>

                <FormField label="borderWidthIconBig" errorText={errors.borderWidthIconBig}>
                  <Input
                    type="number"
                    placeholder="2px"
                    value={config.borderWidthIconBig || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthIconBig', detail.value)}
                  />
                </FormField>

                <FormField label="borderWidthIconLarge" errorText={errors.borderWidthIconLarge}>
                  <Input
                    type="number"
                    placeholder="2.5px"
                    value={config.borderWidthIconLarge || ''}
                    onChange={({ detail }) => handleInputChange('borderWidthIconLarge', detail.value)}
                  />
                </FormField>
              </SpaceBetween>
            </Box>

            <Box padding={{ bottom: 'l' }}>
              <Box variant="h3" padding={{ top: 'm' }}>
                Font related themes
              </Box>

              <SpaceBetween size="xs">
                <Box variant="h5" padding={{ top: 's' }}>
                  H1
                </Box>
                <FormField label="fontSizeHeadingXl" errorText={errors.fontSizeHeadingXl}>
                  <Input
                    type="number"
                    placeholder="26px"
                    value={config.fontSizeHeadingXl || ''}
                    onChange={({ detail }) => handleInputChange('fontSizeHeadingXl', detail.value)}
                  />
                </FormField>

                <FormField label="lineHeightHeadingXl" errorText={errors.lineHeightHeadingXl}>
                  <Input
                    type="number"
                    placeholder="32px"
                    value={config.lineHeightHeadingXl || ''}
                    onChange={({ detail }) => handleInputChange('lineHeightHeadingXl', detail.value)}
                  />
                </FormField>

                <Box variant="h5" padding={{ top: 's' }}>
                  H2
                </Box>
                <FormField label="fontSizeHeadingL" errorText={errors.fontSizeHeadingL}>
                  <Input
                    type="number"
                    placeholder="22px"
                    value={config.fontSizeHeadingL || ''}
                    onChange={({ detail }) => handleInputChange('fontSizeHeadingL', detail.value)}
                  />
                </FormField>

                <FormField label="lineHeightHeadingL" errorText={errors.lineHeightHeadingL}>
                  <Input
                    type="number"
                    placeholder="26px"
                    value={config.lineHeightHeadingL || ''}
                    onChange={({ detail }) => handleInputChange('lineHeightHeadingL', detail.value)}
                  />
                </FormField>

                <Box variant="h5" padding={{ top: 's' }}>
                  H3
                </Box>
                <FormField label="fontSizeHeadingM" errorText={errors.fontSizeHeadingM}>
                  <Input
                    type="number"
                    placeholder="20px"
                    value={config.fontSizeHeadingM || ''}
                    onChange={({ detail }) => handleInputChange('fontSizeHeadingM', detail.value)}
                  />
                </FormField>

                <FormField label="lineHeightHeadingM" errorText={errors.lineHeightHeadingM}>
                  <Input
                    type="number"
                    placeholder="24px"
                    value={config.lineHeightHeadingM || ''}
                    onChange={({ detail }) => handleInputChange('lineHeightHeadingM', detail.value)}
                  />
                </FormField>

                <Box variant="h5" padding={{ top: 's' }}>
                  H4
                </Box>
                <FormField label="fontSizeHeadingS" errorText={errors.fontSizeHeadingS}>
                  <Input
                    type="number"
                    placeholder="18px"
                    value={config.fontSizeHeadingS || ''}
                    onChange={({ detail }) => handleInputChange('fontSizeHeadingS', detail.value)}
                  />
                </FormField>

                <FormField label="lineHeightHeadingS" errorText={errors.lineHeightHeadingS}>
                  <Input
                    type="number"
                    placeholder="22px"
                    value={config.lineHeightHeadingS || ''}
                    onChange={({ detail }) => handleInputChange('lineHeightHeadingS', detail.value)}
                  />
                </FormField>

                <Box variant="h5" padding={{ top: 's' }}>
                  H5
                </Box>
                <FormField label="fontSizeHeadingXs" errorText={errors.fontSizeHeadingXs}>
                  <Input
                    type="number"
                    placeholder="16px"
                    value={config.fontSizeHeadingXs || ''}
                    onChange={({ detail }) => handleInputChange('fontSizeHeadingXs', detail.value)}
                  />
                </FormField>

                <FormField label="lineHeightHeadingXs" errorText={errors.lineHeightHeadingXs}>
                  <Input
                    type="number"
                    placeholder="20px"
                    value={config.lineHeightHeadingXs || ''}
                    onChange={({ detail }) => handleInputChange('lineHeightHeadingXs', detail.value)}
                  />
                </FormField>
              </SpaceBetween>
            </Box>
            <Box padding={{ bottom: 'm' }}>
              {/* <Box variant="h5">
              <FormField label="Filled flashbar">
                <Toggle
                  onChange={({ detail }) => {
                    setChecked(detail.checked);
                  }}
                  checked={checked}
                >
                  Filled flashbar
                </Toggle>
              </FormField>
            </Box> */}
            </Box>
          </>
        )}
      </ColumnLayout>

      <SpaceBetween direction="horizontal" size="xs">
        {/* <Button onClick={applyThemeChanges} variant="primary">
          Apply Theme
        </Button>
        <Button onClick={resetTheme}>Reset to Default</Button> */}
      </SpaceBetween>
    </Box>
  );
}
