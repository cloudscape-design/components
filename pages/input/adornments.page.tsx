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
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
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

// ─── Format hint examples ─────────────────────────────────────────────────────

interface FormatHintProps {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  warning: boolean;
}

function FormatHintExamples({ disabled, readOnly, invalid, warning }: FormatHintProps) {
  const [currency, setCurrency] = useState('');
  const [percent, setPercent] = useState('');
  const [compound, setCompound] = useState('');
  const [url, setUrl] = useState('');
  const [both, setBoth] = useState('');
  const [ms, setMs] = useState('');

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Purely visual. Not submitted with the form value. Screen readers do not announce the adornment — the FormField label carries the unit."
        >
          Format hint adornments
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

          <FormField label="Webhook endpoint URL" errorText={invalid ? 'Enter a valid URL.' : undefined}>
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

// ─── Baseline comparison ──────────────────────────────────────────────────────

function BaselineComparison({ disabled, readOnly, invalid, warning }: FormatHintProps) {
  const [value, setValue] = useState('');
  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Standard Cloudscape Input with no adornment. Use this as a visual reference to confirm the adorned variant matches the baseline styling."
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
        appears on the leading edge. The prop names are semantic (before/after the value), not directional.
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
            description="New prefix and suffix props on the Input component. Format hints are decorative and do not affect the submitted value. Mandatory prefixes are semantic and are included in the submitted value."
          >
            Input — prefix/suffix adornments
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
          <BaselineComparison {...stateProps} />
          <RtlSection />
        </SpaceBetween>
      </ContentLayout>
    </div>
  );
}
