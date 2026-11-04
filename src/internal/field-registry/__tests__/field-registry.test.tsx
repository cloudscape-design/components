// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Proves the field-registry design end to end across control types.
// Reads descriptors from the registry and drives each control via setValue,
// asserting the control's own onChange fires with the correct shape, the value
// round-trips, and the human label flows from the enclosing FormField.
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import '../../../__a11y__/to-validate-a11y';
import Checkbox from '../../../../lib/components/checkbox';
import FormField from '../../../../lib/components/form-field';
import Input from '../../../../lib/components/input';
import { FIELD_REGISTRY_KEY, FieldDescriptor, FieldRegistry } from '../../../../lib/components/internal/field-registry';
import Multiselect from '../../../../lib/components/multiselect';
import RadioGroup from '../../../../lib/components/radio-group';
import Select from '../../../../lib/components/select';
import Textarea from '../../../../lib/components/textarea';
import Toggle from '../../../../lib/components/toggle';

const ARCH = [
  { label: 'x86_64', value: 'x86_64' },
  { label: 'arm64 (Graviton)', value: 'arm64' },
];

const SUBNETS = [
  { label: 'subnet-a (us-east-1a)', value: 'subnet-a' },
  { label: 'subnet-b (us-east-1b)', value: 'subnet-b' },
  { label: 'subnet-c (us-east-1c)', value: 'subnet-c' },
];

function Harness() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [arch, setArch] = useState<{ label: string; value: string } | null>(null);
  const [radio, setRadio] = useState<string | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [subnets, setSubnets] = useState<ReadonlyArray<{ label: string; value: string }>>([]);
  return (
    <>
      <FormField label="Name" controlId="name">
        <Input controlId="name" value={name} onChange={e => setName(e.detail.value)} />
      </FormField>
      <FormField label="Description" controlId="desc">
        <Textarea controlId="desc" value={desc} onChange={e => setDesc(e.detail.value)} />
      </FormField>
      <FormField label="Architecture (select)" controlId="arch">
        <Select
          controlId="arch"
          selectedOption={arch}
          options={ARCH}
          onChange={e => setArch(e.detail.selectedOption as { label: string; value: string })}
        />
      </FormField>
      <FormField label="Architecture (radio)">
        <RadioGroup value={radio} items={ARCH} onChange={e => setRadio(e.detail.value)} />
      </FormField>
      <FormField label="Monitoring">
        <Checkbox checked={monitoring} onChange={e => setMonitoring(e.detail.checked)}>
          Enable monitoring
        </Checkbox>
      </FormField>
      <FormField label="Feature">
        <Toggle checked={enabled} onChange={e => setEnabled(e.detail.checked)}>
          Enabled
        </Toggle>
      </FormField>
      <FormField label="Subnets" controlId="subnets">
        <Multiselect
          controlId="subnets"
          selectedOptions={subnets}
          options={SUBNETS}
          deselectAriaLabel={option => `Remove ${option?.label ?? ''}`}
          onChange={e => setSubnets(e.detail.selectedOptions as ReadonlyArray<{ label: string; value: string }>)}
        />
      </FormField>
    </>
  );
}

function installRegistry() {
  const registry = new Map<string, FieldDescriptor>();
  const host: FieldRegistry = {
    register: (d: FieldDescriptor) => registry.set(d.name, d),
    unregister: (n: string) => registry.delete(n),
  };
  (window as unknown as Record<symbol, FieldRegistry | undefined>)[FIELD_REGISTRY_KEY] = host;
  return registry;
}

function renderWithRegistry() {
  const registry = installRegistry();
  const { container } = render(<Harness />);
  // Address fields the way a consumer does — by human label.
  const byLabel = (label: string) => [...registry.values()].find(d => d.label === label)!;
  return { registry, byLabel, container };
}

describe('field registry', () => {
  afterEach(() => {
    delete (window as unknown as Record<symbol, unknown>)[FIELD_REGISTRY_KEY];
  });

  test('every control self-registers with type + label sourced from FormField', () => {
    const { registry, byLabel } = renderWithRegistry();
    expect(registry.size).toBe(7);
    expect(byLabel('Name')).toMatchObject({ type: 'input', value: '' });
    expect(byLabel('Description')).toMatchObject({ type: 'textarea', value: '' });
    expect(byLabel('Architecture (select)')).toMatchObject({ type: 'select' });
    expect(byLabel('Architecture (radio)')).toMatchObject({ type: 'radio' });
    expect(byLabel('Monitoring')).toMatchObject({ type: 'checkbox', value: false });
    expect(byLabel('Feature')).toMatchObject({ type: 'toggle', value: false });
  });

  test('Input / Textarea write scalars via their own onChange', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Name').setValue('my-instance');
    });
    act(() => {
      byLabel('Description').setValue('some notes');
    });
    expect(byLabel('Name').value).toBe('my-instance');
    expect(byLabel('Description').value).toBe('some notes');
  });

  test('Select resolves a bare label to the option OBJECT shape', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Architecture (select)').setValue('arm64 (Graviton)');
    });
    expect(byLabel('Architecture (select)').value).toBe('arm64');
  });

  test('RadioGroup resolves label or value to its scalar', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Architecture (radio)').setValue('arm64 (Graviton)');
    });
    expect(byLabel('Architecture (radio)').value).toBe('arm64');
  });

  test('Checkbox / Toggle coerce booleans via their own onChange', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Monitoring').setValue(true);
    });
    act(() => {
      byLabel('Feature').setValue('true');
    });
    expect(byLabel('Monitoring').value).toBe(true);
    expect(byLabel('Feature').value).toBe(true);
  });

  test('Multiselect resolves an ARRAY of labels/values to option objects', () => {
    const { byLabel } = renderWithRegistry();
    // Mixed: one bare label, one bare value — both must resolve.
    act(() => {
      byLabel('Subnets').setValue(['subnet-a (us-east-1a)', 'subnet-c']);
    });
    expect(byLabel('Subnets').value).toEqual(['subnet-a', 'subnet-c']);
  });

  test('Multiselect accepts a single value and clears on empty array', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Subnets').setValue('subnet-b');
    });
    expect(byLabel('Subnets').value).toEqual(['subnet-b']);
    act(() => {
      byLabel('Subnets').setValue([]);
    });
    expect(byLabel('Subnets').value).toEqual([]);
  });

  test('setValue reports false for unresolvable values and changes nothing', () => {
    const { byLabel } = renderWithRegistry();
    act(() => {
      byLabel('Subnets').setValue(['subnet-a']);
    });
    // One valid, one bogus — must reject the whole write rather than partially apply.
    let applied: boolean | void = undefined;
    act(() => {
      applied = byLabel('Subnets').setValue(['subnet-a', 'subnet-does-not-exist']);
    });
    expect(applied).toBe(false);
    expect(byLabel('Subnets').value).toEqual(['subnet-a']);
  });

  test('no host registry → no registration (zero cost when absent)', () => {
    delete (window as unknown as Record<symbol, unknown>)[FIELD_REGISTRY_KEY];
    expect(() => render(<Harness />)).not.toThrow();
  });

  test('registration renders no markup and does not affect accessibility', async () => {
    installRegistry();
    const { container } = render(<Harness />);
    await expect(container).toValidateA11y();
  });

  test('a programmatic write leaves the form accessible', async () => {
    const { byLabel, container } = renderWithRegistry();
    act(() => {
      byLabel('Architecture (select)').setValue('arm64');
    });
    act(() => {
      byLabel('Subnets').setValue(['subnet-a']);
    });
    await expect(container).toValidateA11y();
  });
});
