// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Drawer, FormField, Input, Select, SpaceBetween, StatusIndicator, Table } from '~components';
import type { FieldDescriptor } from '~components/internal/field-registry';
import awsuiPlugins from '~components/internal/plugins';
import { SelectProps } from '~components/select';
import { mount, unmount } from '~mount';

import { BRIDGE_CHANNEL, EXAMPLE_VALUES, otherLoopbackOrigin } from './field-registry-bridge';

interface WriteResult {
  label: string;
  applied: boolean;
  message: string;
}

const ASSISTANT_PREFIX = 'assistant-';

const pageFields = (fields: ReadonlyArray<FieldDescriptor>) =>
  fields.filter(field => !field.name?.startsWith(ASSISTANT_PREFIX));

let latestFields: ReadonlyArray<FieldDescriptor> = [];

awsuiPlugins.fieldRegistry.registerListener(fields => {
  latestFields = pageFields(fields);
});

async function writeField(label: string, value: unknown): Promise<WriteResult> {
  const field = latestFields.find(descriptor => descriptor.label === label);
  if (!field) {
    return { label, applied: false, message: 'No field with this label' };
  }
  try {
    const written = await awsuiPlugins.fieldRegistry.setValue(field.id, value);
    return { label, applied: true, message: written.errorText ?? 'Set' };
  } catch (error) {
    return { label, applied: false, message: (error as Error).message };
  }
}

const exampleWrites = () => EXAMPLE_VALUES.filter(([label]) => latestFields.some(field => field.label === label));

const sameFields = (a: ReadonlyArray<FieldDescriptor>, b: ReadonlyArray<FieldDescriptor>) =>
  a.length === b.length && a.every((field, index) => field === b[index]);

function useFields() {
  const [fields, setFields] = useState(latestFields);
  useEffect(
    () =>
      awsuiPlugins.fieldRegistry.registerListener(all => {
        const next = pageFields(all);
        // The panel's own controls register too, so it keeps its state when only they change, or it would loop.
        setFields(previous => (sameFields(previous, next) ? previous : next));
      }),
    []
  );
  return fields;
}

function Results({ results }: { results: ReadonlyArray<WriteResult> }) {
  return (
    <SpaceBetween size="xxs">
      {results.map(result => (
        <StatusIndicator
          key={result.label}
          data-testid="write-result"
          type={!result.applied ? 'error' : result.message === 'Set' ? 'success' : 'warning'}
        >
          {result.label}: {result.message}
        </StatusIndicator>
      ))}
    </SpaceBetween>
  );
}

function AssistantPanel() {
  const fields = useFields();
  const [target, setTarget] = useState<SelectProps.Option | null>(null);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<ReadonlyArray<WriteResult>>([]);
  const [busy, setBusy] = useState(false);

  const run = async (writes: ReadonlyArray<[string, unknown]>) => {
    setBusy(true);
    const completed: WriteResult[] = [];
    for (const [label, next] of writes) {
      completed.push(await writeField(label, next));
      setResults([...completed]);
    }
    setBusy(false);
  };

  return (
    <SpaceBetween size="l">
      <Button data-testid="fill-example-values" variant="primary" loading={busy} onClick={() => run(exampleWrites())}>
        Fill example values
      </Button>
      <FormField label="Field" controlId="assistant-field">
        <Select
          controlId="assistant-field"
          selectedOption={target}
          options={fields.map(field => ({ label: field.label, value: field.label }))}
          onChange={({ detail }) => setTarget(detail.selectedOption)}
        />
      </FormField>
      <FormField label="Value" controlId="assistant-value">
        <Input controlId="assistant-value" value={value} onChange={({ detail }) => setValue(detail.value)} />
      </FormField>
      <Button disabled={!target?.value || busy} onClick={() => target?.value && run([[target.value, value]])}>
        Set value
      </Button>
      <Results results={results} />
      <Table
        variant="embedded"
        header={<Box variant="h4">Registered fields</Box>}
        items={[...fields]}
        trackBy="id"
        columnDefinitions={[
          { id: 'label', header: 'Label', cell: field => field.label },
          { id: 'type', header: 'Type', cell: field => field.type },
          { id: 'value', header: 'Value', cell: field => JSON.stringify(field.value) },
          { id: 'error', header: 'Error', cell: field => field.errorText ?? '-' },
        ]}
      />
    </SpaceBetween>
  );
}

function IsolatedAssistant() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      const frame = frameRef.current?.contentWindow;
      if (
        !frame ||
        event.source !== frame ||
        event.origin !== otherLoopbackOrigin() ||
        event.data?.channel !== BRIDGE_CHANNEL
      ) {
        return;
      }
      const result = event.data.type === 'write' ? await writeField(event.data.label, event.data.value) : latestFields;
      frame.postMessage({ channel: BRIDGE_CHANNEL, id: event.data.id, result }, otherLoopbackOrigin());
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      id="isolated-assistant"
      title="Isolated form assistant"
      src={`${otherLoopbackOrigin()}${window.location.pathname}#/light/field-registry/isolated-assistant?visualRefresh=${visualRefresh()}`}
      style={{ border: 0, inlineSize: '100%', blockSize: 480 }}
    />
  );
}

const pageParams = () => new URLSearchParams(window.location.hash.split('?')[1]);
const isolated = () => pageParams().get('isolatedAssistant') === 'true';
const visualRefresh = () => pageParams().get('visualRefresh') ?? 'false';

awsuiPlugins.appLayout.registerDrawer({
  id: 'field-registry-assistant',
  type: 'global',
  defaultActive: true,
  resizable: true,
  defaultSize: 420,
  ariaLabels: {
    closeButton: 'Close form assistant',
    content: 'Form assistant',
    triggerButton: 'Form assistant',
    resizeHandle: 'Resize form assistant',
  },
  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
<path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>`,
  },
  mountContent: container =>
    mount(
      <Drawer header={<Box variant="h3">Form assistant</Box>}>
        {isolated() ? <IsolatedAssistant /> : <AssistantPanel />}
      </Drawer>,
      container
    ),
  unmountContent: container => unmount(container),
});
