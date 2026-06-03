// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';

import { applyDensity, applyMode, Density, Mode } from '@cloudscape-design/global-styles';

import {
  Box,
  Button,
  Divider,
  Drawer,
  FormField,
  Icon,
  RadioGroup,
  Slider,
  SpaceBetween,
  Tiles,
  Toggle,
} from '~components';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { applyTheme } from '~components/theming';
import {
  colorBackgroundContainerContent,
  colorBackgroundLayoutMain,
  colorBorderDividerDefault,
  colorTextBodySecondary,
  motionDurationComplex,
  motionEasingResponsive,
} from '~design-tokens';

import { bedrockItems, courtyardItems, omegaItems } from './new-features.page';
import { generateThemeConfigOneTheme } from './one-theme-config';

// =============================================================================
// Constants
// =============================================================================
const COLLAPSED_SIZE = 52;
const EXPANDED_SIZE = 225;
const MAX_SIZE = 400;
const COLLAPSE_THRESHOLD = 185;
const SNAP_BUFFER = 30;

const DEFAULTS = {
  itemHeight: '28',
  itemGap: '4',
  alignment: 'center',
  layout: 'top-full',
  theme: 'true',
  resizable: 'true',
  dark: 'false',
  compact: 'false',
  topNavBg: 'container',
  sideNavBg: 'container',
  topNavBorder: 'true',
  sideNavBorder: 'true',
  toggleIcon: 'panel',
  togglePosition: 'above-list',
  toggleAlign: 'start',
  qPosition: 'right',
  qOpen: 'false',
  qSize: '0',
  itemSet: 'omega',
} as const;

const PRESETS: Record<string, Record<string, string>> = {
  Omega: { resizable: 'false', sideNavBg: 'layout', sideNavBorder: 'false', qPosition: 'left', itemSet: 'omega' },
  Juice: {
    layout: 'top-full',
    resizable: 'false',
    sideNavBg: 'container',
    sideNavBorder: 'true',
    qPosition: 'right',
    alignment: 'top',
    itemHeight: '32',
    itemSet: 'juice',
    toggleAlign: 'start',
  },
  'AWS Settings': {
    layout: 'side-only',
    resizable: 'true',
    sideNavBg: 'container',
    toggleAlign: 'end',
    alignment: 'top',
    itemHeight: '32',
    itemSet: 'courtyard',
  },
  Bedrock: {
    layout: 'top-full',
    resizable: 'true',
    sideNavBg: 'container',
    sideNavBorder: 'true',
    alignment: 'top',
    itemSet: 'bedrock',
    toggleIcon: 'arrows',
  },
};

// =============================================================================
// Layout Tile Images (inline SVG thumbnails)
// =============================================================================
function LayoutSvg({ type }: { type: string }) {
  if (type === 'top-full') {
    // Top nav goes full width, side nav below
    return (
      <svg viewBox="0 0 64 44" fill="none" style={{ inlineSize: '100%', blockSize: '40px' }}>
        <rect x="0" y="0" width="64" height="8" rx="1" fill={colorTextBodySecondary} opacity="0.4" />
        <rect x="0" y="10" width="14" height="34" rx="1" fill={colorTextBodySecondary} opacity="0.25" />
        <rect
          x="16"
          y="10"
          width="48"
          height="34"
          rx="1"
          fill={colorBackgroundLayoutMain}
          stroke={colorBorderDividerDefault}
          strokeWidth="0.5"
        />
      </svg>
    );
  }
  if (type === 'side-only') {
    return (
      <svg viewBox="0 0 64 44" fill="none" style={{ inlineSize: '100%', blockSize: '40px' }}>
        <rect x="0" y="0" width="14" height="44" rx="1" fill={colorTextBodySecondary} opacity="0.25" />
        <rect
          x="16"
          y="0"
          width="48"
          height="44"
          rx="1"
          fill={colorBackgroundLayoutMain}
          stroke={colorBorderDividerDefault}
          strokeWidth="0.5"
        />
      </svg>
    );
  }
  // Side nav goes full height, top nav to the right
  return (
    <svg viewBox="0 0 64 44" fill="none" style={{ inlineSize: '100%', blockSize: '40px' }}>
      <rect x="0" y="0" width="14" height="44" rx="1" fill={colorTextBodySecondary} opacity="0.25" />
      <rect x="16" y="0" width="48" height="8" rx="1" fill={colorTextBodySecondary} opacity="0.4" />
      <rect
        x="16"
        y="10"
        width="48"
        height="34"
        rx="1"
        fill={colorBackgroundLayoutMain}
        stroke={colorBorderDividerDefault}
        strokeWidth="0.5"
      />
    </svg>
  );
}

// =============================================================================
// Top Navigation
// =============================================================================
function TopNav({
  drawerOpen,
  onSettingsClick,
  onQClick,
  bg,
  border,
}: {
  drawerOpen: boolean;
  onSettingsClick: () => void;
  onQClick: () => void;
  bg: 'container' | 'layout';
  border: boolean;
}) {
  return (
    <div
      style={{
        blockSize: '48px',
        boxSizing: 'border-box',
        backgroundColor: bg === 'container' ? colorBackgroundContainerContent : colorBackgroundLayoutMain,
        display: 'flex',
        alignItems: 'center',
        paddingInline: '16px',
        gap: '16px',
        borderBlockEnd: border ? `1px solid ${colorBorderDividerDefault}` : 'none',
        flexShrink: 0,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="19"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 29 17"
        style={{ color: 'inherit' }}
      >
        <path
          fill="currentColor"
          d="M8.38 6.17a2.6 2.6 0 00.11.83c.08.232.18.456.3.67a.4.4 0 01.07.21.36.36 0 01-.18.28l-.59.39a.43.43 0 01-.24.08.38.38 0 01-.28-.13 2.38 2.38 0 01-.34-.43c-.09-.16-.18-.34-.28-.55a3.44 3.44 0 01-2.74 1.29 2.54 2.54 0 01-1.86-.67 2.36 2.36 0 01-.68-1.79 2.43 2.43 0 01.84-1.92 3.43 3.43 0 012.29-.72 6.75 6.75 0 011 .07c.35.05.7.12 1.07.2V3.3a2.06 2.06 0 00-.44-1.49 2.12 2.12 0 00-1.52-.43 4.4 4.4 0 00-1 .12 6.85 6.85 0 00-1 .32l-.33.12h-.14c-.14 0-.2-.1-.2-.29v-.46A.62.62 0 012.3.87a.78.78 0 01.27-.2A6 6 0 013.74.25 5.7 5.7 0 015.19.07a3.37 3.37 0 012.44.76 3 3 0 01.77 2.29l-.02 3.05zM4.6 7.59a3 3 0 001-.17 2 2 0 00.88-.6 1.36 1.36 0 00.32-.59 3.18 3.18 0 00.09-.81V5A7.52 7.52 0 006 4.87h-.88a2.13 2.13 0 00-1.38.37 1.3 1.3 0 00-.46 1.08 1.3 1.3 0 00.34 1c.278.216.63.313.98.27zm7.49 1a.56.56 0 01-.36-.09.73.73 0 01-.2-.37L9.35.93a1.39 1.39 0 01-.08-.38c0-.15.07-.23.22-.23h.92a.56.56 0 01.36.09.74.74 0 01.19.37L12.53 7 14 .79a.61.61 0 01.18-.37.59.59 0 01.37-.09h.75a.62.62 0 01.38.09.74.74 0 01.18.37L17.31 7 18.92.76a.74.74 0 01.19-.37.56.56 0 01.36-.09h.87a.21.21 0 01.23.23 1 1 0 010 .15s0 .13-.06.23l-2.26 7.2a.74.74 0 01-.19.37.6.6 0 01-.36.09h-.8a.53.53 0 01-.37-.1.64.64 0 01-.18-.37l-1.45-6-1.44 6a.64.64 0 01-.18.37.55.55 0 01-.37.1l-.82.02zm12 .24a6.29 6.29 0 01-1.44-.16 4.21 4.21 0 01-1.07-.37.69.69 0 01-.29-.26.66.66 0 01-.06-.27V7.3c0-.19.07-.29.21-.29a.57.57 0 01.18 0l.23.1c.32.143.656.25 1 .32.365.08.737.12 1.11.12a2.47 2.47 0 001.36-.31 1 1 0 00.48-.88.88.88 0 00-.25-.65 2.29 2.29 0 00-.94-.49l-1.35-.43a2.83 2.83 0 01-1.49-.94 2.24 2.24 0 01-.47-1.36 2 2 0 01.25-1c.167-.3.395-.563.67-.77a3 3 0 011-.48A4.1 4.1 0 0124.4.08a4.4 4.4 0 01.62 0l.61.1.53.15.39.16c.105.062.2.14.28.23a.57.57 0 01.08.31v.44c0 .2-.07.3-.21.3a.92.92 0 01-.36-.12 4.35 4.35 0 00-1.8-.36 2.51 2.51 0 00-1.24.26.92.92 0 00-.44.84c0 .249.1.488.28.66.295.236.635.41 1 .51l1.32.42a2.88 2.88 0 011.44.9 2.1 2.1 0 01.43 1.31 2.38 2.38 0 01-.24 1.08 2.34 2.34 0 01-.68.82 3 3 0 01-1 .53 4.59 4.59 0 01-1.35.22l.03-.01z"
        />
        <path
          fill="currentColor"
          d="M25.82 13.43a20.07 20.07 0 01-11.35 3.47A20.54 20.54 0 01.61 11.62c-.29-.26 0-.62.32-.42a27.81 27.81 0 0013.86 3.68 27.54 27.54 0 0010.58-2.16c.52-.22.96.34.45.71z"
        />
        <path
          fill="currentColor"
          d="M27.1 12c-.4-.51-2.6-.24-3.59-.12-.3 0-.34-.23-.07-.42 1.75-1.23 4.63-.88 5-.46.37.42-.09 3.3-1.74 4.68-.25.21-.49.09-.38-.18.34-.95 1.17-3.02.78-3.5z"
        />
      </svg>
      <span style={{ blockSize: '55%' }}>
        <Divider orientation="vertical" />
      </span>
      <button
        aria-label="Amazon Q"
        onClick={onQClick}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="26" height="26" rx="6" />
          <path
            d="M18.22 7.41L12.87 4.32C12.63 4.18 12.32 4.11 12 4.11C11.68 4.11 11.37 4.18 11.13 4.32L5.78 7.41C5.3 7.68 4.91 8.36 4.91 8.91V15.09C4.91 15.64 5.3 16.31 5.78 16.59L11.14 19.68C11.38 19.82 11.69 19.89 12.01 19.89C12.33 19.89 12.64 19.82 12.88 19.68L18.24 16.59C18.72 16.31 19.11 15.64 19.11 15.09V8.91C19.11 8.36 18.72 7.68 18.24 7.41H18.22ZM12 17.88L6.91 14.94V9.06L12 6.12L17.09 9.06V13.78L14 12V11.26C14 11 13.86 10.77 13.64 10.64L12.36 9.9C12.25 9.84 12.12 9.8 12 9.8C11.88 9.8 11.75 9.83 11.64 9.9L10.36 10.64C10.14 10.77 10 11.01 10 11.26V12.74C10 13 10.14 13.23 10.36 13.36L11.64 14.1C11.75 14.16 11.88 14.2 12 14.2C12.12 14.2 12.25 14.17 12.36 14.1L13 13.73L16.09 15.51L12 17.87V17.88Z"
            fill="url(#q-gradient)"
          />
          <defs>
            <radialGradient
              id="q-gradient"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(26.14 -2.14) rotate(135) scale(40 51.18)"
            >
              <stop stopColor="#0099FF" />
              <stop offset="0.3" stopColor="#003B8F" />
              <stop offset="0.45" stopColor="#0033CC" />
              <stop offset="0.6" stopColor="#4200DB" />
              <stop offset="0.8" stopColor="#45008A" />
            </radialGradient>
          </defs>
        </svg>
      </button>
      {/* <span style={{ blockSize: '55%' }}>
        <Divider orientation="vertical" />
      </span> */}
      <nav
        aria-label="Breadcrumbs"
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
      >
        <Box color="text-status-inactive">[Omega/Harbor] Projects</Box>
        <Box color="text-status-inactive">/</Box>
        <Box color="text-status-inactive">
          <SpaceBetween direction="horizontal" size="xs">
            CycleSafe <Icon name="angle-down" />
          </SpaceBetween>
        </Box>
        <Box color="text-status-inactive">/</Box>
        <Box color="text-status-inactive">Deployments</Box>
        <Box color="text-status-inactive">/</Box>
        <Box>
          <SpaceBetween direction="horizontal" size="xs">
            dep-34u92 <Icon name="angle-down" />
          </SpaceBetween>
        </Box>
      </nav>

      <Button iconName="notification" variant="icon" ariaLabel="Notifications" />
      <Button iconName="support" variant="icon" ariaLabel="User" />
      <Button
        iconName="settings"
        variant="icon"
        onClick={onSettingsClick}
        ariaLabel={drawerOpen ? 'Close settings' : 'Open settings'}
      />
      <SpaceBetween direction="vertical" size="xxxs" alignItems="end">
        <Box variant="small" fontWeight="bold">
          My project name
        </Box>
        <Box variant="small">Jessica Kuelz</Box>
      </SpaceBetween>
    </div>
  );
}

// =============================================================================
// Config Drawer
// =============================================================================
function ConfigDrawer({
  itemHeight,
  setItemHeight,
  itemGap,
  setItemGap,
  itemSet,
  setItemSet,
  alignment,
  setAlignment,
  layout,
  setLayout,
  themeEnabled,
  setThemeEnabled,
  resizable,
  setResizable,
  darkMode,
  setDarkMode,
  compact,
  setCompact,
  topNavBg,
  setTopNavBg,
  sideNavBg,
  setSideNavBg,
  topNavBorder,
  setTopNavBorder,
  sideNavBorder,
  setSideNavBorder,
  toggleIcon,
  setToggleIcon,
  togglePosition,
  setTogglePosition,
  toggleAlign,
  setToggleAlign,
}: {
  itemHeight: number;
  setItemHeight: (v: number) => void;
  itemGap: number;
  setItemGap: (v: number) => void;
  itemSet: string;
  setItemSet: (v: string) => void;
  alignment: string;
  setAlignment: (v: string) => void;
  layout: string;
  setLayout: (v: string) => void;
  themeEnabled: boolean;
  setThemeEnabled: (v: boolean) => void;
  resizable: boolean;
  setResizable: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  compact: boolean;
  setCompact: (v: boolean) => void;
  topNavBg: 'container' | 'layout';
  setTopNavBg: (v: 'container' | 'layout') => void;
  sideNavBg: 'container' | 'layout';
  setSideNavBg: (v: 'container' | 'layout') => void;
  topNavBorder: boolean;
  setTopNavBorder: (v: boolean) => void;
  sideNavBorder: boolean;
  setSideNavBorder: (v: boolean) => void;
  toggleIcon: 'arrows' | 'panel';
  setToggleIcon: (v: 'arrows' | 'panel') => void;
  togglePosition: 'top' | 'above-list' | 'below-list' | 'bottom';
  setTogglePosition: (v: 'top' | 'above-list' | 'below-list' | 'bottom') => void;
  toggleAlign: 'start' | 'center' | 'end';
  setToggleAlign: (v: 'start' | 'center' | 'end') => void;
}) {
  return (
    <div style={{ padding: '16px' }}>
      <SpaceBetween size="xxl">
        <SpaceBetween size="s">
          <Button
            variant="link"
            iconName="undo"
            onClick={() => {
              setItemHeight(Number(DEFAULTS.itemHeight));
              setItemGap(Number(DEFAULTS.itemGap));
              setAlignment(DEFAULTS.alignment);
              setLayout(DEFAULTS.layout);
              setThemeEnabled(true);
              setResizable(true);
              setDarkMode(false);
              setCompact(false);
              setTopNavBg(DEFAULTS.topNavBg as any);
              setSideNavBg(DEFAULTS.sideNavBg as any);
              setTopNavBorder(true);
              setSideNavBorder(true);
              setToggleIcon(DEFAULTS.toggleIcon as any);
              setTogglePosition(DEFAULTS.togglePosition as any);
              setToggleAlign(DEFAULTS.toggleAlign as any);
            }}
          >
            Reset to defaults
          </Button>

          <Box variant="h4">Page Layout</Box>
          <FormField label="Orientation">
            <Tiles
              value={layout}
              onChange={({ detail }) => setLayout(detail.value)}
              columns={2}
              items={[
                { value: 'top-full', label: 'Top nav full', image: <LayoutSvg type="top-full" /> },
                { value: 'side-full', label: 'Side nav full', image: <LayoutSvg type="side-full" /> },
                { value: 'side-only', label: 'Side nav only', image: <LayoutSvg type="side-only" /> },
              ]}
            />
          </FormField>
          <FormField label="Top nav background color">
            <RadioGroup
              value={topNavBg}
              onChange={({ detail }) => setTopNavBg(detail.value as 'container' | 'layout')}
              items={[
                { value: 'container', label: 'Container' },
                { value: 'layout', label: 'Layout' },
              ]}
            />
          </FormField>
          <FormField label="Side nav background color">
            <RadioGroup
              value={sideNavBg}
              onChange={({ detail }) => setSideNavBg(detail.value as 'container' | 'layout')}
              items={[
                { value: 'container', label: 'Container' },
                { value: 'layout', label: 'Layout' },
              ]}
            />
          </FormField>
          <Toggle checked={topNavBorder} onChange={({ detail }) => setTopNavBorder(detail.checked)}>
            Top nav border
          </Toggle>
          <Toggle checked={sideNavBorder} onChange={({ detail }) => setSideNavBorder(detail.checked)}>
            Side nav border
          </Toggle>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Box variant="h4">Side Nav Panel</Box>
          <Toggle checked={resizable} onChange={({ detail }) => setResizable(detail.checked)}>
            Resizable
          </Toggle>
        </SpaceBetween>

        {/* No SpaceBetween here because sliders come with their own padding that provide enough gap */}
        <div>
          <Box variant="h4" margin={{ bottom: 's' }}>
            Side Nav Items
          </Box>
          <FormField label={`Item height: ${itemHeight}px`}>
            <Slider value={itemHeight} min={20} max={44} onChange={({ detail }) => setItemHeight(detail.value)} />
          </FormField>
          <FormField label={`Item gap: ${itemGap}px`}>
            <Slider value={itemGap} min={0} max={12} onChange={({ detail }) => setItemGap(detail.value)} />
          </FormField>
          <SpaceBetween size="s">
            <FormField label="Items alignment">
              <RadioGroup
                value={alignment}
                onChange={({ detail }) => setAlignment(detail.value)}
                items={[
                  { value: 'top', label: 'Top' },
                  { value: 'center', label: 'Center' },
                ]}
              />
            </FormField>
            <FormField label="Navigation items">
              <RadioGroup
                value={itemSet}
                onChange={({ detail }) => setItemSet(detail.value)}
                items={[
                  { value: 'omega', label: 'Omega' },
                  { value: 'juice', label: 'Juice' },
                  { value: 'courtyard', label: 'AWS Settings' },
                  { value: 'bedrock', label: 'Bedrock' },
                ]}
              />
            </FormField>
          </SpaceBetween>
        </div>

        <SpaceBetween size="s">
          <Box variant="h4">Side Nav Toggle</Box>
          <FormField label="Toggle icon">
            <RadioGroup
              value={toggleIcon}
              onChange={({ detail }) => setToggleIcon(detail.value as 'arrows' | 'panel')}
              items={[
                { value: 'arrows', label: 'Arrows' },
                { value: 'panel', label: 'Panel' },
              ]}
            />
          </FormField>
          <FormField label="Toggle position">
            <RadioGroup
              value={togglePosition}
              onChange={({ detail }) => setTogglePosition(detail.value as any)}
              items={[
                { value: 'top', label: 'Top of panel' },
                { value: 'above-list', label: 'Above list' },
                { value: 'below-list', label: 'Below list' },
                { value: 'bottom', label: 'Bottom of panel' },
              ]}
            />
          </FormField>
          <FormField label="Toggle alignment">
            <RadioGroup
              value={toggleAlign}
              onChange={({ detail }) => setToggleAlign(detail.value as 'start' | 'center' | 'end')}
              items={[
                { value: 'start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'end', label: 'End' },
              ]}
            />
          </FormField>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Box variant="h4">Misc</Box>
          <Toggle checked={themeEnabled} onChange={({ detail }) => setThemeEnabled(detail.checked)}>
            One Theme
          </Toggle>
          <Toggle checked={darkMode} onChange={({ detail }) => setDarkMode(detail.checked)}>
            Dark mode
          </Toggle>
          <Toggle checked={compact} onChange={({ detail }) => setCompact(detail.checked)}>
            Compact density
          </Toggle>
        </SpaceBetween>
      </SpaceBetween>
    </div>
  );
}

// =============================================================================
// Toggle Button Wrapper
// =============================================================================
function ToggleWrapper({
  children,
  position,
  collapsed,
  align,
  headerText,
}: {
  children: React.ReactNode;
  position: 'top' | 'above-list' | 'below-list' | 'bottom';
  collapsed: boolean;
  align: 'start' | 'center' | 'end';
  headerText?: string;
}) {
  const isAbsolute = position === 'top' || position === 'bottom';
  const showHeader = !collapsed && align !== 'center' && headerText;
  const headerElement = showHeader && (
    <div style={{ flex: 1, paddingBlockStart: '2px' }}>
      <Box variant="h4" padding={{ bottom: 'n' }}>
        {headerText}
      </Box>
      {headerText === 'Amazon Bedrock' && <Box color="text-body-secondary">Bedrock Mantle</Box>}
    </div>
  );
  return (
    <div
      style={{
        ...(isAbsolute && {
          position: 'absolute',
          insetInline: 0,
          zIndex: 1,
          ...(position === 'top' ? { insetBlockStart: 0 } : { insetBlockEnd: 0 }),
        }),
        paddingBlockStart: '12px',
        paddingInline: `${collapsed ? '0px' : '20px 16px'}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '4px',
        justifyContent: collapsed || align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
      }}
    >
      {align === 'end' && headerElement}
      {children}
      {align === 'start' && headerElement}
    </div>
  );
}

// =============================================================================
// Main Page
// =============================================================================
export default function SideNavigationLayoutPage() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const p = (key: keyof typeof DEFAULTS) => params.get(key) ?? DEFAULTS[key];

  const [activeHref, setActiveHref] = useState('#/overview');
  const [panelSize, setPanelSize] = useState(EXPANDED_SIZE);
  const [isResizing, setIsResizing] = useState(false);
  const expandIconPosition: SideNavigationProps.ExpandIconPosition = 'end';
  const [itemHeight, setItemHeight] = useState(Number(p('itemHeight')));
  const [itemGap, setItemGap] = useState(Number(p('itemGap')));
  const [alignment, setAlignment] = useState(p('alignment'));
  const [layout, setLayout] = useState(p('layout'));
  const [themeEnabled, setThemeEnabled] = useState(p('theme') === 'true');
  const [resizable, setResizable] = useState(p('resizable') === 'true');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [qOpen, setQOpen] = useState(p('qOpen') === 'true');
  const [qPosition, setQPosition] = useState<'left' | 'right'>(p('qPosition') as any);
  const [qSize, setQSize] = useState(p('qOpen') === 'true' ? Number(p('qSize')) || 300 : Number(p('qSize')));
  const [itemSet, setItemSet] = useState(p('itemSet'));
  const [darkMode, setDarkMode] = useState(p('dark') === 'true');
  const [compact, setCompact] = useState(p('compact') === 'true');
  const [topNavBg, setTopNavBg] = useState<'container' | 'layout'>(p('topNavBg') as any);
  const [sideNavBg, setSideNavBg] = useState<'container' | 'layout'>(p('sideNavBg') as any);
  const [topNavBorder, setTopNavBorder] = useState(p('topNavBorder') === 'true');
  const [sideNavBorder, setSideNavBorder] = useState(p('sideNavBorder') === 'true');
  const [toggleIcon, setToggleIcon] = useState<'arrows' | 'panel'>(p('toggleIcon') as any);
  const [togglePosition, setTogglePosition] = useState<'top' | 'above-list' | 'below-list' | 'bottom'>(
    p('togglePosition') as any
  );
  const [toggleAlign, setToggleAlign] = useState<'start' | 'center' | 'end'>(p('toggleAlign') as any);

  const activePreset =
    Object.entries(PRESETS).find(([, preset]) => {
      const merged: Record<string, string> = { ...DEFAULTS, ...preset };
      const current: Record<string, string> = {
        itemHeight: String(itemHeight),
        itemGap: String(itemGap),
        alignment,
        layout,
        theme: String(themeEnabled),
        resizable: String(resizable),
        dark: String(darkMode),
        compact: String(compact),
        topNavBg,
        sideNavBg,
        topNavBorder: String(topNavBorder),
        sideNavBorder: String(sideNavBorder),
        toggleIcon,
        togglePosition,
        toggleAlign,
        qOpen: String(qOpen),
        qPosition,
        itemSet,
      };
      return Object.keys(merged).every(k => !current[k] || current[k] === merged[k]);
    })?.[0] ?? null;

  // Sync config to URL
  useEffect(() => {
    const current: Record<string, string> = {
      itemHeight: String(itemHeight),
      itemGap: String(itemGap),
      alignment,
      layout,
      theme: String(themeEnabled),
      resizable: String(resizable),
      dark: String(darkMode),
      compact: String(compact),
      topNavBg,
      sideNavBg,
      topNavBorder: String(topNavBorder),
      sideNavBorder: String(sideNavBorder),
      toggleIcon,
      togglePosition,
      toggleAlign,
      qOpen: String(qOpen),
      qPosition,
      itemSet,
    };
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(current)) {
      if (value !== DEFAULTS[key as keyof typeof DEFAULTS]) {
        q.set(key, value);
      }
    }
    const qs = q.toString();
    const hash = window.location.hash.split('?')[0];
    window.history.replaceState(null, '', `${window.location.pathname}${hash}${qs ? '?' + qs : ''}`);
  }, [
    itemHeight,
    itemGap,
    alignment,
    layout,
    themeEnabled,
    resizable,
    darkMode,
    compact,
    topNavBg,
    sideNavBg,
    topNavBorder,
    sideNavBorder,
    toggleIcon,
    togglePosition,
    toggleAlign,
    qOpen,
    qPosition,
    itemSet,
  ]);
  const effectiveCollapsedSize = resizable ? COLLAPSED_SIZE + 16 : COLLAPSED_SIZE;
  const collapsed = panelSize < COLLAPSE_THRESHOLD && panelSize <= effectiveCollapsedSize + SNAP_BUFFER;

  // Grid column width for side-full top nav

  // Snap panel size when collapsed size changes (e.g. switching handle mode while collapsed)
  useEffect(() => {
    if (collapsed) {
      setPanelSize(effectiveCollapsedSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCollapsedSize]);

  useEffect(() => {
    const theme = themeEnabled ? (generateThemeConfigOneTheme() as any) : { tokens: {} };
    theme.tokens.sizeSideNavigationItemHeight = `${itemHeight}px`;
    theme.tokens.spaceSideNavigationItemGap = `${itemGap}px`;
    theme.tokens.spaceSideNavigationItemCollapsedGap = `${Math.min(Math.round(itemGap * 2), 12)}px`;
    const { reset } = applyTheme({ theme });
    return reset;
  }, [themeEnabled, sideNavBg, layout, itemHeight, itemGap]);

  useEffect(() => {
    applyMode(darkMode ? Mode.Dark : Mode.Light);
  }, [darkMode]);

  useEffect(() => {
    applyDensity(compact ? Density.Compact : Density.Comfortable);
  }, [compact]);

  useEffect(() => {
    const header = document.getElementById('h');
    if (header) {
      header.style.display = 'none';
    }
    return () => {
      if (header) {
        header.style.display = '';
      }
    };
  }, []);

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    e.preventDefault();
    setActiveHref(e.detail.href);
  }, []);

  const onPanelResize = useCallback(
    (event: any) => {
      setIsResizing(true);
      const size = event.detail.size;
      if (collapsed) {
        if (size > effectiveCollapsedSize + SNAP_BUFFER) {
          setPanelSize(Math.max(size, EXPANDED_SIZE));
        }
      } else {
        if (size < COLLAPSE_THRESHOLD) {
          setPanelSize(effectiveCollapsedSize);
        } else {
          setPanelSize(size);
        }
      }
    },
    [collapsed, effectiveCollapsedSize]
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }
    const onPointerUp = () => setIsResizing(false);
    document.addEventListener('pointerup', onPointerUp);
    return () => document.removeEventListener('pointerup', onPointerUp);
  }, [isResizing]);

  const toggleCollapse = useCallback(() => {
    setPanelSize(prev => (prev < COLLAPSE_THRESHOLD ? EXPANDED_SIZE : effectiveCollapsedSize));
  }, [effectiveCollapsedSize]);

  const containerStyles = {
    backgroundColor: colorBackgroundContainerContent,
    border: `1px solid ${colorBorderDividerDefault}`,
    borderRadius: '8px',
  };

  const alignmentMap: Record<string, React.CSSProperties> = {
    top: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    bottom: { justifyContent: 'flex-end' },
  };

  const panelIconSvg = (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke="currentColor" />
      <line x1="4.5" y1="1" x2="4.5" y2="9" stroke="currentColor" />
    </svg>
  );

  const toggleButton = (
    <Button
      iconName={toggleIcon === 'arrows' ? (collapsed ? 'angle-right' : 'angle-left') : undefined}
      iconSvg={toggleIcon === 'panel' ? panelIconSvg : undefined}
      variant="icon"
      onClick={toggleCollapse}
      ariaLabel={collapsed ? 'Expand navigation' : 'Collapse navigation'}
    />
  );

  const headerText = itemSet === 'bedrock' ? 'Amazon Bedrock' : itemSet === 'courtyard' ? 'Settings' : undefined;

  const sideNavPanel = (
    <div
      style={{
        display: 'flex',
        blockSize: '100%',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: sideNavBg === 'container' ? colorBackgroundContainerContent : colorBackgroundLayoutMain,
      }}
    >
      {togglePosition === 'top' && (
        <ToggleWrapper position="top" collapsed={collapsed} align={toggleAlign} headerText={headerText}>
          {toggleButton}
        </ToggleWrapper>
      )}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : undefined,
          position: 'relative',
          paddingBlockStart: togglePosition === 'top' ? '40px' : undefined,
          paddingBlockEnd: togglePosition === 'bottom' ? '40px' : undefined,
          ...alignmentMap[alignment],
          minInlineSize: resizable ? panelSize - 16 : panelSize,
        }}
      >
        {togglePosition === 'above-list' && (
          <ToggleWrapper position="above-list" collapsed={collapsed} align={toggleAlign} headerText={headerText}>
            {toggleButton}
          </ToggleWrapper>
        )}
        <SideNavigation
          activeHref={activeHref}
          items={itemSet === 'omega' ? omegaItems : itemSet === 'bedrock' ? bedrockItems : courtyardItems}
          expandIconPosition={expandIconPosition}
          collapsed={collapsed}
          variant="highlighted"
          onFollow={onFollow}
        />
        {togglePosition === 'below-list' && (
          <ToggleWrapper position="below-list" collapsed={collapsed} align={toggleAlign} headerText={headerText}>
            {toggleButton}
          </ToggleWrapper>
        )}
      </div>
      {togglePosition === 'bottom' && (
        <ToggleWrapper position="bottom" collapsed={collapsed} align={toggleAlign} headerText={headerText}>
          {toggleButton}
        </ToggleWrapper>
      )}
    </div>
  );

  const mainContent = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: '90px 200px 200px',
        gap: '16px',
      }}
    >
      <div style={{ gridColumn: 'span 3', ...containerStyles }} />
      <div style={containerStyles} />
      <div style={{ gridColumn: 'span 2', ...containerStyles }} />
      <div style={{ gridColumn: 'span 2', ...containerStyles }} />
      <div style={containerStyles} />
    </div>
  );

  // Build grid layout
  const hasQ = true;
  const qIsLeft = qPosition === 'left';
  const showTopNav = layout !== 'side-only';
  const sideFull = layout === 'side-full';
  const qColumnSize = qOpen ? qSize : 0;

  // Grid columns: [q-left?] [nav] [q-right?] [content]
  const columns: string[] = [];
  const areas: { top: string[]; main: string[] } = { top: [], main: [] };

  if (hasQ && qIsLeft) {
    columns.push(`${qColumnSize}px`);
    areas.top.push(sideFull ? 'q' : 'topnav');
    areas.main.push('q');
  }
  columns.push(`${panelSize}px`);
  areas.top.push(sideFull ? 'nav' : 'topnav');
  areas.main.push('nav');
  if (hasQ && !qIsLeft) {
    columns.push(`${qColumnSize}px`);
    areas.top.push(sideFull ? 'q' : 'topnav');
    areas.main.push('q');
  }
  columns.push('1fr');
  areas.top.push('topnav');
  areas.main.push('content');

  const gridTemplateAreas = showTopNav
    ? `"${areas.top.join(' ')}" "${areas.main.join(' ')}"`
    : `"${areas.main.join(' ')}"`;
  const gridTemplateRows = showTopNav ? '48px 1fr' : '1fr';

  return (
    <div style={{ display: 'flex', blockSize: '100vh' }}>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: columns.join(' '),
          gridTemplateRows,
          gridTemplateAreas,
          overflow: 'hidden',
          transition: isResizing ? 'none' : `grid-template-columns ${motionDurationComplex} ${motionEasingResponsive}`,
        }}
      >
        {/* Top Nav */}
        {showTopNav && (
          <div
            style={{
              gridArea: 'topnav',
            }}
          >
            <TopNav
              drawerOpen={drawerOpen}
              onSettingsClick={() => setDrawerOpen(prev => !prev)}
              onQClick={() => {
                setQOpen(prev => {
                  if (!prev && qSize === 0) {
                    setQSize(300);
                  }
                  return !prev;
                });
              }}
              bg={topNavBg}
              border={topNavBorder}
            />
          </div>
        )}

        {/* Side-full nav header (toggle in top row) */}
        {sideFull && (
          <div
            style={{
              gridArea: 'nav',
              gridRow: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              borderInlineEnd: sideNavBorder ? `1px solid ${colorBorderDividerDefault}` : 'none',
              backgroundColor: sideNavBg === 'container' ? colorBackgroundContainerContent : colorBackgroundLayoutMain,
            }}
          >
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Drawer
                ariaLabel="Navigation"
                placement="start"
                size={panelSize}
                resizable={resizable}
                minSize={effectiveCollapsedSize}
                maxSize={MAX_SIZE}
                onResize={onPanelResize}
                hideCloseAction={true}
                disableContentPaddings={true}
                role="presentation"
              >
                {sideNavPanel}
              </Drawer>
            </div>
          </div>
        )}

        {/* Non-side-full nav (top-full or side-only) */}
        {!sideFull && (
          <div
            style={{
              gridArea: 'nav',
              overflow: 'hidden',
              backgroundColor: sideNavBg === 'container' ? colorBackgroundContainerContent : colorBackgroundLayoutMain,
              borderInlineEnd: sideNavBorder || (!qIsLeft && qOpen) ? `1px solid ${colorBorderDividerDefault}` : 'none',
            }}
          >
            <Drawer
              ariaLabel="Navigation"
              placement="start"
              size={panelSize}
              resizable={resizable}
              minSize={effectiveCollapsedSize}
              maxSize={MAX_SIZE}
              onResize={onPanelResize}
              hideCloseAction={true}
              disableContentPaddings={true}
              role="presentation"
            >
              {sideNavPanel}
            </Drawer>
          </div>
        )}

        {/* Q drawer */}
        {hasQ && (
          <div
            style={{
              gridArea: 'q',
              gridRow: sideFull ? '1 / -1' : undefined,
              overflow: 'hidden',
              backgroundColor: colorBackgroundContainerContent,
              borderInlineEnd: qOpen ? `1px solid ${colorBorderDividerDefault}` : 'none',
            }}
          >
            <Drawer
              header="Amazon Q"
              onClose={() => {
                setQOpen(false);
                setQSize(0);
              }}
              closeAction={{ ariaLabel: 'Close Q' }}
              placement="start"
              resizable={true}
              size={qSize}
              minSize={200}
              maxSize={500}
              onResize={({ detail }) => {
                setIsResizing(true);
                setQSize(detail.size);
              }}
              headerActions={
                <Button
                  variant="inline-icon"
                  iconName={qIsLeft ? 'angle-right' : 'angle-left'}
                  ariaLabel={qIsLeft ? 'Move to right of nav' : 'Move to left of nav'}
                  onClick={() => setQPosition(prev => (prev === 'left' ? 'right' : 'left'))}
                />
              }
            >
              <Box color="text-status-inactive">Q assistant content</Box>
            </Drawer>
          </div>
        )}

        {/* Main content */}
        <div style={{ gridArea: 'content', overflow: 'auto', padding: '24px' }}>{mainContent}</div>
      </div>

      {/* Config drawer */}
      {drawerOpen && (
        <div
          style={{
            inlineSize: '280px',
            borderInlineStart: `1px solid ${colorBorderDividerDefault}`,
            overflow: 'auto',
            flexShrink: 0,
            backgroundColor: colorBackgroundContainerContent,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderBlockEnd: `1px solid ${colorBorderDividerDefault}`,
            }}
          >
            <Box variant="h4">Configuration</Box>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Button iconName="close" variant="icon" onClick={() => setDrawerOpen(false)} ariaLabel="Close config" />
            </div>
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderBlockEnd: `1px solid ${colorBorderDividerDefault}`,
            }}
          >
            <RadioGroup
              value={activePreset}
              onChange={({ detail }) => {
                setIsResizing(true);
                requestAnimationFrame(() => requestAnimationFrame(() => setIsResizing(false)));
                const merged: Record<string, string> = { ...DEFAULTS, ...PRESETS[detail.value] };
                setItemHeight(Number(merged.itemHeight));
                setItemGap(Number(merged.itemGap));
                setAlignment(merged.alignment);
                setLayout(merged.layout);
                setThemeEnabled(merged.theme === 'true');
                setResizable(merged.resizable === 'true');
                setDarkMode(merged.dark === 'true');
                setCompact(merged.compact === 'true');
                setTopNavBg(merged.topNavBg as any);
                setSideNavBg(merged.sideNavBg as any);
                setTopNavBorder(merged.topNavBorder === 'true');
                setSideNavBorder(merged.sideNavBorder === 'true');
                setToggleIcon(merged.toggleIcon as any);
                setTogglePosition(merged.togglePosition as any);
                setToggleAlign(merged.toggleAlign as any);
                setQOpen(merged.qOpen === 'true');
                setQPosition(merged.qPosition as any);
                setItemSet(merged.itemSet);
                const hrefs: Record<string, string> = {
                  omega: '#/overview',
                  courtyard: '#/workspaces',
                  bedrock: '#/home',
                };
                setActiveHref(hrefs[merged.itemSet] ?? '#/overview');
              }}
              items={Object.keys(PRESETS).map(name => ({ value: name, label: name }))}
            />
          </div>
          <ConfigDrawer
            itemHeight={itemHeight}
            setItemHeight={setItemHeight}
            itemGap={itemGap}
            setItemGap={setItemGap}
            itemSet={itemSet}
            setItemSet={setItemSet}
            alignment={alignment}
            setAlignment={setAlignment}
            layout={layout}
            setLayout={setLayout}
            themeEnabled={themeEnabled}
            setThemeEnabled={setThemeEnabled}
            resizable={resizable}
            setResizable={setResizable}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            compact={compact}
            setCompact={setCompact}
            topNavBg={topNavBg}
            setTopNavBg={setTopNavBg}
            sideNavBg={sideNavBg}
            setSideNavBg={setSideNavBg}
            topNavBorder={topNavBorder}
            setTopNavBorder={setTopNavBorder}
            sideNavBorder={sideNavBorder}
            setSideNavBorder={setSideNavBorder}
            toggleIcon={toggleIcon}
            setToggleIcon={setToggleIcon}
            togglePosition={togglePosition}
            setTogglePosition={setTogglePosition}
            toggleAlign={toggleAlign}
            setToggleAlign={setToggleAlign}
          />
        </div>
      )}
    </div>
  );
}
