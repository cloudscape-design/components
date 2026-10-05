// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import CopyToClipboard from '~components/copy-to-clipboard';
import ExpandableSection from '~components/expandable-section';
import Icon, { IconProps } from '~components/icon';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Token, { TokenProps } from '~components/token';
import { colorChartsPaletteCategorical2 } from '~design-tokens';

import styles from './styles.scss';

// A color dot is a custom icon passed through the existing icon slot. Colors are consumer-owned;
// a real console would use its own design tokens.
const RED = '#d13212';
const ORANGE = '#ec7211';
const YELLOW = '#f2c811';
const GREEN = '#1d8102';
const BLUE = '#0972d3';
const PURPLE = '#7d4bcb';

function Dot({ color }: { color: string }) {
  return (
    <Icon
      svg={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
          <circle cx="8" cy="8" r="4" fill={color} className="no-stroke" />
        </svg>
      }
    />
  );
}

function QueryAction({ icon, label }: { icon: IconProps.Name; label: string }) {
  return (
    <div className={styles['query-action']}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        <Icon name={icon} />
        <span>{label}</span>
      </SpaceBetween>
      <Icon name="angle-right" />
    </div>
  );
}

function SectionLabel({ text, counter }: { text: string; counter?: string }) {
  return (
    <span className={styles['section-label']}>
      <span>{text}</span>
      {counter && <span>{counter}</span>}
    </span>
  );
}

// Mirrors the CloudWatch Log Analytics field-details popover: field name + copy + category
// token header, coverage bar in the category color, then log groups and query actions.
function FieldDetails({ field, category, color }: { field: string; category: string; color: string }) {
  return (
    <div className={styles['field-details']}>
      <div className={styles['field-details-header']}>
        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <Box fontWeight="bold">{field}</Box>
          <CopyToClipboard
            variant="icon"
            textToCopy={field}
            copyButtonAriaLabel={`Copy ${field}`}
            copySuccessText={`${field} copied`}
            copyErrorText={`Failed to copy ${field}`}
          />
        </SpaceBetween>
        <Token variant="inline" label={category} icon={<Dot color={color} />} />
      </div>
      <div className={styles['coverage-row']}>
        <span>Coverage</span>
        <span>100%</span>
      </div>
      <div className={styles['coverage-bar']} style={{ backgroundColor: color }} />
      <ExpandableSection variant="footer" headerText={<SectionLabel text="Log groups" counter="1/1" />}>
        <div className={styles['log-group-row']} style={{ backgroundColor: `${color}22` }}>
          <span className={styles['log-group-name']}>/aws/cognito/userpools/ap-south-1_34n4shGQf 882640845406</span>
          <span>100%</span>
        </div>
      </ExpandableSection>
      <ExpandableSection variant="footer" headerText={<SectionLabel text="Query actions" />} defaultExpanded={true}>
        <QueryAction icon="filter" label="Filter" />
        <QueryAction icon="view-vertical" label="Aggregate & Sort" />
        <QueryAction icon="convert-code" label="Transform" />
      </ExpandableSection>
    </div>
  );
}

interface Spec {
  name: string;
  color?: string;
  icon?: IconProps.Name;
  count?: string;
  category?: string;
}

const FIELDS: Spec[] = [
  { name: '@log', color: RED, count: '100%', category: 'System' },
  { name: '@message', color: RED, count: '100%', category: 'System' },
  { name: 'ResourceType', color: PURPLE, count: '42%', category: 'Indexed' },
  { name: 'statusCode', color: PURPLE, count: '88%', category: 'Indexed' },
];
const SEVERITY: Spec[] = [
  { name: 'Critical', color: RED },
  { name: 'High', color: ORANGE },
  { name: 'Medium', color: YELLOW },
  { name: 'Low', color: GREEN },
  { name: 'Info', color: BLUE },
];
const ENVIRONMENTS: Spec[] = [
  { name: 'Production', color: RED },
  { name: 'Staging', color: ORANGE },
  { name: 'Development', color: GREEN },
];
const META: Spec[] = [
  { name: '@log', count: '100%' },
  { name: '@aws.account', count: '17%' },
  { name: '@aws.region', count: '6%' },
];
const META_FULL: Spec[] = [
  { name: 'Critical', color: RED, icon: 'status-negative', count: '3' },
  { name: 'Warning', color: ORANGE, icon: 'status-warning', count: '12' },
  { name: 'Info', color: BLUE, icon: 'status-info', count: '847' },
];

type Kind = 'static' | 'popover';

function Tokens({
  items,
  kind = 'static',
  testIdPrefix,
  variant,
  dismissible,
}: {
  items: Spec[];
  kind?: Kind;
  testIdPrefix: string;
  variant?: TokenProps.Variant;
  dismissible?: boolean;
}) {
  const inline = variant === 'inline';

  return (
    <SpaceBetween size="s" direction="horizontal">
      {items.map(it => {
        const common = {
          'data-testid': `${testIdPrefix}-${it.name}`,
          label: it.name,
          variant,
          labelTag: it.count,
          icon: it.icon ? (
            <Icon name={it.icon} size={inline ? 'small' : 'normal'} />
          ) : it.color ? (
            <Dot color={it.color} />
          ) : undefined,
          ariaLabel: it.count ? `${it.name}, ${it.count}` : undefined,
        };
        const dismiss = dismissible ? { dismissLabel: `Remove ${it.name}`, onDismiss: () => {} } : {};

        if (kind === 'popover') {
          return (
            <Token
              key={it.name}
              {...common}
              ariaLabel={common.ariaLabel ?? it.name}
              label={
                <Popover
                  size="large"
                  triggerType={inline ? 'text-inline' : 'text'}
                  dismissButton={false}
                  content={<FieldDetails field={it.name} category={it.category ?? 'System'} color={it.color ?? RED} />}
                >
                  {it.name}
                </Popover>
              }
            />
          );
        }
        return <Token key={it.name} {...common} {...dismiss} />;
      })}
    </SpaceBetween>
  );
}

export default function TokenAdditionsPage() {
  return (
    <Box padding="xl">
      <h1>Token additions</h1>

      <SpaceBetween size="xxl" direction="vertical">
        <section>
          <h2>API proposal usage examples</h2>
          <p>Renders the exact code from the API proposal, for doc screenshots.</p>
          <h3>1. Field token with a color dot icon and label tag</h3>
          <Token
            label="@data_format"
            ariaLabel="@data_format, General field, 17% coverage"
            icon={<Dot color={colorChartsPaletteCategorical2} />}
            labelTag="17%"
            dismissLabel="Remove @data_format"
            onDismiss={() => {}}
          />
          <h3>2. Popover token - contextual actions</h3>
          <Token
            ariaLabel="@logStream, System field, 100% coverage"
            label={
              <Popover
                size="large"
                dismissButton={false}
                content={<FieldDetails field="@logStream" category="System" color={RED} />}
              >
                @logStream
              </Popover>
            }
            labelTag="100%"
            dismissLabel="Remove @logStream"
            onDismiss={() => {}}
          />
          <h3>3. Existing usage - unchanged</h3>
          <Token label="region = us-east-1" dismissLabel="Remove filter" onDismiss={() => {}} />
        </section>

        <section>
          <h2>Color dot icon</h2>
          <p>
            A color dot marks a category, passed as a custom icon through the icon slot. Always paired with a label,
            never color alone.
          </p>
          <h3>With dismiss</h3>
          <Tokens items={SEVERITY} dismissible={true} testIdPrefix="severity" />
          <h3>Not dismissible</h3>
          <Tokens items={ENVIRONMENTS} testIdPrefix="env" />
        </section>

        <section>
          <h2>Label tag</h2>
          <p>
            The existing labelTag prop, now also shown for the inline variant, for values such as coverage or a count.
          </p>
          <h3>With percentage</h3>
          <Tokens items={META} testIdPrefix="meta" />
          <h3>With icon and count</h3>
          <Tokens items={META_FULL} testIdPrefix="meta-full" />
        </section>

        <section>
          <h2>Popover</h2>
          <p>
            Clicking the label opens a popover with contextual actions. Composed by passing Popover in the label slot,
            no dedicated prop.
          </p>
          <h3>Field details with color dot icon and label tag</h3>
          <Tokens items={FIELDS} kind="popover" testIdPrefix="popover" />
        </section>

        <section>
          <h2>Inline</h2>
          <h3>With color dot icon and label tag</h3>
          <Tokens items={FIELDS} variant="inline" testIdPrefix="inline" kind="popover" />
        </section>

        <section>
          <h2>States</h2>
          <SpaceBetween size="s" direction="horizontal">
            <Token label="Default" />
            <Token label="Disabled" disabled={true} />
            <Token label="Read-only" readOnly={true} />
            <Token label="With dismiss" dismissLabel="Remove" onDismiss={() => {}} />
          </SpaceBetween>
        </section>
      </SpaceBetween>
    </Box>
  );
}
