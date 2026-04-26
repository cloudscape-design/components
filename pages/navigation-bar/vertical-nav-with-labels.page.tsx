// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

const sections = [
  {
    items: [
      { icon: 'grid-view' as const, label: 'Dashboard', active: true },
      { icon: 'folder' as const, label: 'Projects', badge: '3' },
      { icon: 'share' as const, label: 'Deployments' },
      { icon: 'status-positive' as const, label: 'Health' },
      { icon: 'group-active' as const, label: 'Team' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { icon: 'search' as const, label: 'Explorer' },
      { icon: 'ticket' as const, label: 'Billing' },
      { icon: 'settings' as const, label: 'Settings' },
    ],
  },
];

function NavItem({
  icon,
  label,
  active,
  badge,
  expanded,
}: {
  icon: any;
  label: string;
  active?: boolean;
  badge?: string;
  expanded: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: expanded ? '8px 12px' : '8px',
        justifyContent: expanded ? 'flex-start' : 'center',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: active ? 'rgba(0, 115, 187, 0.1)' : hovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        fontWeight: active ? 600 : 400,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} variant={active ? 'link' : 'normal'} />
      {expanded && <span style={{ flex: 1 }}>{label}</span>}
      {expanded && badge && <Badge color="blue">{badge}</Badge>}
    </div>
  );
}

function SidebarContent({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        width: expanded ? 240 : 56,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 200ms',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: expanded ? '12px 16px' : '12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: expanded ? 'flex-start' : 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={onToggle}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <Box fontSize="heading-m" fontWeight="bold">
            <span style={{ fontStyle: 'italic' }}>aws</span>
          </Box>
        </div>
        {expanded && (
          <>
            <Box fontSize="heading-s" fontWeight="bold">
              CloudManager
            </Box>
            <div style={{ marginInlineStart: 'auto' }}>
              <Button iconName="angle-left" variant="icon" ariaLabel="Collapse sidebar" onClick={onToggle} />
            </div>
          </>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: expanded ? '0 8px' : '0 4px' }} tabIndex={0}>
        <SpaceBetween size="m" direction="vertical">
          {sections.map((section, si) => (
            <div key={si}>
              {expanded && section.title && (
                <Box
                  variant="small"
                  color="text-body-secondary"
                  padding={{ horizontal: 'xs', bottom: 'xxs' }}
                  fontWeight="bold"
                >
                  {section.title}
                </Box>
              )}
              <SpaceBetween size="xxs" direction="vertical">
                {section.items.map(item => (
                  <NavItem key={item.label} {...item} expanded={expanded} />
                ))}
              </SpaceBetween>
            </div>
          ))}
        </SpaceBetween>
      </div>
      <div
        style={{
          padding: expanded ? '12px 16px' : '12px 0',
          borderTop: '1px solid #e9ebed',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: expanded ? 'flex-start' : 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="user-profile" />
        {expanded && (
          <div>
            <Box fontWeight="bold" fontSize="body-s">
              Jane Doe
            </Box>
            <Box variant="small" color="text-body-secondary">
              jane@example.com
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerticalNavWithLabelsPage() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ display: 'flex', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      <NavigationBar
        placement="start"
        variant="secondary"
        ariaLabel="Side navigation"
        content={<SidebarContent expanded={expanded} onToggle={() => setExpanded(prev => !prev)} />}
      />
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }} tabIndex={0}>
        <SpaceBetween size="l">
          <Box variant="h1">Dashboard</Box>
          <Box>
            Click the <strong>aws</strong> logo or the collapse button to toggle the sidebar.
          </Box>
          {Array.from({ length: 30 }, (_, i) => (
            <Box key={i} padding={{ vertical: 'xxs' }}>
              Content line {i + 1}
            </Box>
          ))}
        </SpaceBetween>
      </div>
    </div>
  );
}
