// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import ContentLayout from '~components/content-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Icon from '~components/icon';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Toggle from '~components/toggle';

// ─── State controls panel ─────────────────────────────────────────────────────

interface StateControlsProps {
  disabled: boolean;
  setDisabled: (v: boolean) => void;
  readOnly: boolean;
  setReadOnly: (v: boolean) => void;
  invalid: boolean;
  setInvalid: (v: boolean) => void;
  warning: boolean;
  setWarning: (v: boolean) => void;
  compact: boolean;
  setCompact: (v: boolean) => void;
  rtl: boolean;
  setRtl: (v: boolean) => void;
}

function StateControls({
  disabled,
  setDisabled,
  readOnly,
  setReadOnly,
  invalid,
  setInvalid,
  warning,
  setWarning,
  compact,
  setCompact,
  rtl,
  setRtl,
}: StateControlsProps) {
  return (
    <Container header={<Header variant="h2">State controls</Header>}>
      <ColumnLayout columns={3} borders="vertical">
        <SpaceBetween size="s">
          <Toggle checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            Disabled
          </Toggle>
          <Toggle checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
            Read-only
          </Toggle>
        </SpaceBetween>
        <SpaceBetween size="s">
          <Toggle checked={invalid} onChange={({ detail }) => setInvalid(detail.checked)}>
            Invalid
          </Toggle>
          <Toggle checked={warning} onChange={({ detail }) => setWarning(detail.checked)}>
            Warning
          </Toggle>
        </SpaceBetween>
        <SpaceBetween size="s">
          <Toggle checked={compact} onChange={({ detail }) => setCompact(detail.checked)}>
            Compact density
          </Toggle>
          <Toggle checked={rtl} onChange={({ detail }) => setRtl(detail.checked)}>
            RTL layout
          </Toggle>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}

// ─── Format hint examples — string adornments ─────────────────────────────────

interface StateProps {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  warning: boolean;
}

function FormatHintExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [currency, setCurrency] = useState('');
  const [percent, setPercent] = useState('');
  const [compound, setCompound] = useState('');
  const [both, setBoth] = useState('');
  const [ms, setMs] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="String adornments. Purely visual. Not submitted with the form value. Screen readers do not announce the adornment — the FormField label carries the unit."
        >
          Format hint adornments — string
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="blue">Decorative</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField
            label="Spending limit (USD)"
            errorText={invalid ? 'Enter a valid amount.' : undefined}
            warningText={warning && !invalid ? 'Value may exceed your budget.' : undefined}
          >
            <Input
              value={currency}
              onChange={e => setCurrency(e.detail.value)}
              prefix="$"
              inputMode="decimal"
              placeholder="0.00"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="CPU utilization (percent)"
            errorText={invalid ? 'Enter a value between 0 and 100.' : undefined}
            warningText={warning && !invalid ? 'Utilization is high.' : undefined}
          >
            <Input
              value={percent}
              onChange={e => setPercent(e.detail.value)}
              suffix="%"
              inputMode="numeric"
              placeholder="0"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField label="Data transfer limit" errorText={invalid ? 'Enter a valid limit.' : undefined}>
            <Input
              value={compound}
              onChange={e => setCompound(e.detail.value)}
              suffix="TB/mo"
              inputMode="numeric"
              placeholder="0"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField label="Response time threshold" errorText={invalid ? 'Enter a valid threshold.' : undefined}>
            <Input
              value={ms}
              onChange={e => setMs(e.detail.value)}
              suffix="ms"
              inputMode="numeric"
              placeholder="0"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="Error rate threshold"
            description="Alert when error rate exceeds this value."
            errorText={invalid ? 'Enter a valid threshold.' : undefined}
          >
            <Input
              value={both}
              onChange={e => setBoth(e.detail.value)}
              prefix="<"
              suffix="%"
              inputMode="decimal"
              placeholder="0.5"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── ReactNode adornments — icons ─────────────────────────────────────────────

function ReactNodeIconExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [amount, setAmount] = useState('');
  const [locked, setLocked] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="ReactNode adornments using Icon components. Icons should be aria-hidden when the FormField label already conveys the meaning."
        >
          ReactNode adornments — Icons
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="green">ReactNode</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField label="Search resources" errorText={invalid ? 'Enter a search term.' : undefined}>
            <Input
              value={search}
              onChange={e => setSearch(e.detail.value)}
              prefix={<Icon name="search" aria-hidden="true" />}
              placeholder="Filter by name or tag"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField label="Email address" errorText={invalid ? 'Enter a valid email.' : undefined}>
            <Input
              value={email}
              onChange={e => setEmail(e.detail.value)}
              prefix={<Icon name="envelope" aria-hidden="true" />}
              type="email"
              placeholder="user@example.com"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="Webhook URL"
            constraintText="Must be a valid HTTPS endpoint."
            errorText={invalid ? 'Enter a valid URL.' : undefined}
          >
            <Input
              value={url}
              onChange={e => setUrl(e.detail.value)}
              prefix={<Icon name="external" aria-hidden="true" />}
              type="url"
              placeholder="https://example.com/hook"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField label="Payment amount (USD)" errorText={invalid ? 'Enter a valid amount.' : undefined}>
            <Input
              value={amount}
              onChange={e => setAmount(e.detail.value)}
              prefix={<Icon name="ticket" aria-hidden="true" />}
              suffix="USD"
              inputMode="decimal"
              placeholder="0.00"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="API secret key"
            description="Stored encrypted. Visible only at creation."
            errorText={invalid ? 'Enter a valid key.' : undefined}
          >
            <Input
              value={locked}
              onChange={e => setLocked(e.detail.value)}
              prefix={<Icon name="lock-private" aria-hidden="true" />}
              type="password"
              placeholder="sk-••••••••"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── ReactNode adornments — Badges ────────────────────────────────────────────

function ReactNodeBadgeExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [beta, setBeta] = useState('');
  const [required, setRequired] = useState('');
  const [new_, setNew_] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="ReactNode adornments using Badge components to signal field status, tier, or requirement."
        >
          ReactNode adornments — Badges
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="green">ReactNode</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField
            label="Feature flag name"
            description="This field is in beta."
            errorText={invalid ? 'Enter a flag name.' : undefined}
          >
            <Input
              value={beta}
              onChange={e => setBeta(e.detail.value)}
              suffix={<Badge color="blue">Beta</Badge>}
              placeholder="my-feature-flag"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="Account ID"
            description="12-digit AWS account identifier."
            errorText={invalid ? 'Enter a valid account ID.' : undefined}
          >
            <Input
              value={required}
              onChange={e => setRequired(e.detail.value)}
              suffix={<Badge color="red">Required</Badge>}
              inputMode="numeric"
              placeholder="123456789012"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="AI model endpoint"
            description="Newly added model endpoint."
            errorText={invalid ? 'Enter a valid endpoint.' : undefined}
          >
            <Input
              value={new_}
              onChange={e => setNew_(e.detail.value)}
              suffix={<Badge color="green">New</Badge>}
              placeholder="arn:aws:bedrock:..."
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── ReactNode adornments — StatusIndicator ───────────────────────────────────

function ReactNodeStatusExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [endpoint, setEndpoint] = useState('');
  const [pending, setPending] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="ReactNode adornments using StatusIndicator to convey live connectivity or validation state alongside the field."
        >
          ReactNode adornments — StatusIndicator
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="green">ReactNode</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField
            label="Database endpoint"
            description="Shows the live connection status."
            errorText={invalid ? 'Enter a valid endpoint.' : undefined}
          >
            <Input
              value={endpoint}
              onChange={e => setEndpoint(e.detail.value)}
              suffix={<StatusIndicator type="success">Connected</StatusIndicator>}
              placeholder="db.example.com:5432"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField
            label="Async job ID"
            description="Submitted for processing."
            errorText={invalid ? 'Enter a job ID.' : undefined}
          >
            <Input
              value={pending}
              onChange={e => setPending(e.detail.value)}
              suffix={<StatusIndicator type="pending">Queued</StatusIndicator>}
              placeholder="job-abc123"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── ReactNode adornments — icon + text combination ───────────────────────────

function ReactNodeCompositeExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [rate, setRate] = useState('');
  const [storage, setStorage] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Composite ReactNode adornments combining an icon with a text label. Use sparingly — prefer a plain string when text alone is sufficient."
        >
          ReactNode adornments — Icon + text composite
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="green">ReactNode</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField label="Request rate limit (req/s)" errorText={invalid ? 'Enter a valid rate.' : undefined}>
            <Input
              value={rate}
              onChange={e => setRate(e.detail.value)}
              suffix={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="status-positive" aria-hidden="true" />
                  req/s
                </span>
              }
              inputMode="numeric"
              placeholder="1000"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>

          <FormField label="Storage capacity (GB)" errorText={invalid ? 'Enter a valid capacity.' : undefined}>
            <Input
              value={storage}
              onChange={e => setStorage(e.detail.value)}
              prefix={<Icon name="settings" aria-hidden="true" />}
              suffix={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="upload-download" aria-hidden="true" />
                  GB
                </span>
              }
              inputMode="numeric"
              placeholder="512"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              warning={warning}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── Required prefix/suffix (userland concatenation) ──────────────────────────

function RequiredAffixExamples({ disabled, readOnly, invalid, warning }: StateProps) {
  const [url, setUrl] = useState('');
  const [bucket, setBucket] = useState('');
  const [host, setHost] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="The fixed segment is decorative. The builder concatenates it into the submitted value. The component does not do this automatically."
        >
          Required prefix/suffix
          <Box display="inline-block" margin={{ left: 'xs' }}>
            <Badge color="grey">Builder concatenates</Badge>
          </Box>
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField
            label="Webhook endpoint URL"
            constraintText="The https:// scheme is added automatically."
            errorText={invalid ? 'Enter a valid URL.' : undefined}
          >
            <SpaceBetween size="xs">
              <Input
                value={url}
                onChange={e => setUrl(e.detail.value)}
                prefix="https://"
                type="url"
                placeholder="example.com/webhook"
                disabled={disabled}
                readOnly={readOnly}
                invalid={invalid}
                warning={warning}
              />
              {url && (
                <Box variant="small" color="text-body-secondary">
                  Submitted value:{' '}
                  <Box variant="code" display="inline">
                    https://{url}
                  </Box>
                </Box>
              )}
            </SpaceBetween>
          </FormField>

          <FormField
            label="S3 bucket name"
            constraintText="The amazon-braket- prefix is required and included in the resource name."
            errorText={invalid ? 'Enter a valid bucket name.' : undefined}
          >
            <SpaceBetween size="xs">
              <Input
                value={bucket}
                onChange={e => setBucket(e.detail.value)}
                prefix="amazon-braket-"
                placeholder="my-bucket"
                disabled={disabled}
                readOnly={readOnly}
                invalid={invalid}
                warning={warning}
              />
              {bucket && (
                <Box variant="small" color="text-body-secondary">
                  Submitted value:{' '}
                  <Box variant="code" display="inline">
                    amazon-braket-{bucket}
                  </Box>
                </Box>
              )}
            </SpaceBetween>
          </FormField>

          <FormField
            label="Private DNS hostname"
            constraintText="The .ec2.internal domain suffix is appended automatically."
            errorText={invalid ? 'Enter a valid hostname.' : undefined}
          >
            <SpaceBetween size="xs">
              <Input
                value={host}
                onChange={e => setHost(e.detail.value)}
                suffix=".ec2.internal"
                placeholder="my-host"
                disabled={disabled}
                readOnly={readOnly}
                invalid={invalid}
                warning={warning}
              />
              {host && (
                <Box variant="small" color="text-body-secondary">
                  Submitted value:{' '}
                  <Box variant="code" display="inline">
                    {host}.ec2.internal
                  </Box>
                </Box>
              )}
            </SpaceBetween>
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

// ─── Baseline comparison ──────────────────────────────────────────────────────

function BaselineComparison({ disabled, readOnly, invalid, warning }: StateProps) {
  const [value, setValue] = useState('');
  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Standard Cloudscape Input with no adornment. Use as a visual reference to confirm the adorned variant matches baseline styling."
        >
          Baseline: plain Input
        </Header>
      }
    >
      <FormField label="Plain input (no adornment)">
        <Input
          value={value}
          onChange={e => setValue(e.detail.value)}
          placeholder="Enter a value"
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          warning={warning}
        />
      </FormField>
    </Container>
  );
}

// ─── RTL section ──────────────────────────────────────────────────────────────

function RtlSection() {
  const [val, setVal] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');
  return (
    <Container header={<Header variant="h2">RTL layout</Header>}>
      <Box variant="p" color="text-body-secondary">
        In RTL locales,{' '}
        <Box variant="code" display="inline">
          prefix
        </Box>{' '}
        appears on the trailing edge and{' '}
        <Box variant="code" display="inline">
          suffix
        </Box>{' '}
        appears on the leading edge. The prop names are semantic (before/after the value), not directional. Icons flip
        correctly because the flex container inherits{' '}
        <Box variant="code" display="inline">
          dir
        </Box>
        .
      </Box>
      <Box margin={{ top: 'm' }}>
        <div dir="rtl">
          <ColumnLayout columns={2}>
            <FormField label="مبلغ (دولار أمريكي)">
              <Input
                value={val}
                onChange={e => setVal(e.detail.value)}
                prefix="$"
                inputMode="decimal"
                placeholder="0.00"
              />
            </FormField>
            <FormField label="نسبة الاستخدام (بالمئة)">
              <Input
                value={val2}
                onChange={e => setVal2(e.detail.value)}
                suffix="%"
                inputMode="numeric"
                placeholder="0"
              />
            </FormField>
            <FormField label="بريد إلكتروني">
              <Input
                value={val3}
                onChange={e => setVal3(e.detail.value)}
                prefix={<Icon name="envelope" aria-hidden="true" />}
                type="email"
                placeholder="user@example.com"
              />
            </FormField>
          </ColumnLayout>
        </div>
      </Box>
    </Container>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdornmentsPage() {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [warning, setWarning] = useState(false);
  const [compact, setCompact] = useState(false);
  const [rtl, setRtl] = useState(false);

  const stateProps = { disabled, readOnly, invalid, warning };

  return (
    <div className={compact ? 'awsui-compact-mode' : ''} dir={rtl ? 'rtl' : 'ltr'}>
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="prefix and suffix props on Input now accept any ReactNode — plain strings, icons, badges, status indicators, or composite elements. Both props are always decorative and never affect the submitted value."
          >
            Input: prefix/suffix adornments (ReactNode)
          </Header>
        }
      >
        <SpaceBetween size="l">
          <StateControls
            disabled={disabled}
            setDisabled={setDisabled}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
            invalid={invalid}
            setInvalid={setInvalid}
            warning={warning}
            setWarning={setWarning}
            compact={compact}
            setCompact={setCompact}
            rtl={rtl}
            setRtl={setRtl}
          />
          <FormatHintExamples {...stateProps} />
          <ReactNodeIconExamples {...stateProps} />
          <ReactNodeBadgeExamples {...stateProps} />
          <ReactNodeStatusExamples {...stateProps} />
          <ReactNodeCompositeExamples {...stateProps} />
          <RequiredAffixExamples {...stateProps} />
          <BaselineComparison {...stateProps} />
          <RtlSection />
        </SpaceBetween>
      </ContentLayout>
    </div>
  );
}
