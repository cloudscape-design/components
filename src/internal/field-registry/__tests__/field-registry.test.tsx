// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import '../../../__a11y__/to-validate-a11y';
import Checkbox from '../../../../lib/components/checkbox';
import ExpandableSection from '../../../../lib/components/expandable-section';
import FormField from '../../../../lib/components/form-field';
import Input from '../../../../lib/components/input';
import type { FieldDescriptor } from '../../../../lib/components/internal/field-registry';
import awsuiPlugins from '../../../../lib/components/internal/plugins';
import Multiselect, { MultiselectProps } from '../../../../lib/components/multiselect';
import RadioGroup from '../../../../lib/components/radio-group';
import Select, { SelectProps } from '../../../../lib/components/select';
import Table from '../../../../lib/components/table';
import createWrapper from '../../../../lib/components/test-utils/dom';
import Textarea from '../../../../lib/components/textarea';
import Toggle from '../../../../lib/components/toggle';

jest.mock('../../../../lib/components/internal/metrics', () => ({ metrics: { sendPanoramaMetric: () => {} } }));

const ARCH = [
  { label: 'x86_64', value: 'x86_64' },
  { label: 'arm64 (Graviton)', value: 'arm64' },
];

const SUBNETS = [
  { label: 'subnet-a (us-east-1a)', value: 'subnet-a' },
  { label: 'subnet-b (us-east-1b)', value: 'subnet-b' },
  { label: 'subnet-c (us-east-1c)', value: 'subnet-c' },
];

const scrollIntoView = jest.fn();
let stopListening: (() => void) | null = null;
let fields: ReadonlyArray<FieldDescriptor> = [];

function listen() {
  stopListening = awsuiPlugins.fieldRegistry.registerListener(latest => {
    fields = latest;
  });
}

const flush = () => act(() => new Promise<void>(resolve => setTimeout(resolve)));
const field = (label: string) => fields.find(descriptor => descriptor.label === label)!;
const labels = () => fields.map(descriptor => descriptor.label);

async function setValue(label: string, value: unknown) {
  let written: Promise<FieldDescriptor> | undefined;
  act(() => {
    written = awsuiPlugins.fieldRegistry.setValue(field(label).id, value);
    written.catch(() => {});
  });
  await flush();
  return written!;
}

const write = (label: string, value: unknown) =>
  setValue(label, value).then(
    () => true,
    () => false
  );

beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoView;
});

beforeEach(() => {
  scrollIntoView.mockClear();
  fields = [];
  listen();
});

afterEach(() => {
  stopListening?.();
  stopListening = null;
});

function Form() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [arch, setArch] = useState<SelectProps.Option | null>(null);
  const [radio, setRadio] = useState<string | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [subnets, setSubnets] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  return (
    <>
      <FormField label="Name">
        <Input value={name} onChange={e => setName(e.detail.value)} />
      </FormField>
      <FormField label="Notes">
        <Textarea value={notes} onChange={e => setNotes(e.detail.value)} />
      </FormField>
      <FormField label="Architecture (select)">
        <Select selectedOption={arch} options={ARCH} onChange={e => setArch(e.detail.selectedOption)} />
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
      <FormField label="Subnets">
        <Multiselect
          selectedOptions={subnets}
          options={SUBNETS}
          deselectAriaLabel={option => `Remove ${option?.label ?? ''}`}
          onChange={e => setSubnets(e.detail.selectedOptions)}
        />
      </FormField>
    </>
  );
}

function SelectField({ options, disabled }: { options: SelectProps.Options; disabled?: boolean }) {
  const [selected, setSelected] = useState<SelectProps.Option | null>(null);
  return (
    <FormField label="Size">
      <Select
        selectedOption={selected}
        options={options}
        disabled={disabled}
        onChange={e => setSelected(e.detail.selectedOption)}
      />
    </FormField>
  );
}

describe('registration', () => {
  test('controls in a FormField register with their type and the FormField label', async () => {
    render(<Form />);
    await flush();
    expect(fields.map(({ label, type }) => ({ label, type }))).toEqual([
      { label: 'Name', type: 'input' },
      { label: 'Notes', type: 'textarea' },
      { label: 'Architecture (select)', type: 'select' },
      { label: 'Architecture (radio)', type: 'radio' },
      { label: 'Monitoring', type: 'checkbox' },
      { label: 'Feature', type: 'toggle' },
      { label: 'Subnets', type: 'multiselect' },
    ]);
  });

  test('a listener attached after render receives the current fields at once', async () => {
    render(<Form />);
    await flush();
    let received: string[] = [];
    const stop = awsuiPlugins.fieldRegistry.registerListener(latest => {
      received = latest.map(descriptor => descriptor.label);
    });
    expect(received).toHaveLength(7);
    stop();
  });

  test('controls outside a FormField use their accessible name', async () => {
    render(
      <>
        <Checkbox checked={false} onChange={() => {}}>
          I acknowledge the terms
        </Checkbox>
        <Toggle checked={false} onChange={() => {}}>
          Enable logging
        </Toggle>
        <Input value="" onChange={() => {}} ariaLabel="Search" />
        <Select selectedOption={null} options={ARCH} onChange={() => {}} inlineLabelText="Architecture" />
      </>
    );
    await flush();
    expect(labels()).toEqual(['I acknowledge the terms', 'Enable logging', 'Search', 'Architecture']);
  });

  test('a control without a plain-text label does not register', async () => {
    render(
      <>
        <Checkbox checked={false} onChange={() => {}} />
        <FormField label={<span>Rich label</span>}>
          <Input value="" onChange={() => {}} />
        </FormField>
      </>
    );
    await flush();
    expect(fields).toHaveLength(0);
  });

  test('password inputs do not register', async () => {
    render(
      <FormField label="Password">
        <Input type="password" value="secret" onChange={() => {}} />
      </FormField>
    );
    await flush();
    expect(fields).toHaveLength(0);
  });

  test('controls that Cloudscape uses inside other components do not register', async () => {
    render(
      <Table
        items={[{ id: 'i-1' }, { id: 'i-2' }]}
        trackBy="id"
        selectionType="multi"
        selectedItems={[]}
        columnDefinitions={[{ id: 'id', header: 'Instance', cell: item => item.id }]}
        ariaLabels={{
          selectionGroupLabel: 'Instance selection',
          allItemsSelectionLabel: () => 'Select all instances',
          itemSelectionLabel: (_, item) => `Select instance ${item.id}`,
        }}
      />
    );
    await flush();
    expect(fields).toHaveLength(0);
  });

  test('unmounting removes the fields', async () => {
    const { unmount } = render(<Form />);
    await flush();
    unmount();
    await flush();
    expect(fields).toHaveLength(0);
  });
});

describe('updates', () => {
  function RerenderingForm() {
    const [renders, setRenders] = useState(0);
    const [name, setName] = useState('');
    return (
      <>
        <button onClick={() => setRenders(renders + 1)}>Re-render</button>
        <FormField label="Name">
          <Input value={name} onChange={e => setName(e.detail.value)} />
        </FormField>
      </>
    );
  }

  test('a re-render that changes nothing about a field does not notify listeners', async () => {
    const { getByText } = render(<RerenderingForm />);
    await flush();
    let notifications = 0;
    const stop = awsuiPlugins.fieldRegistry.registerListener(() => {
      notifications++;
    });
    act(() => {
      getByText('Re-render').click();
    });
    await flush();
    expect(notifications).toBe(1);
    await write('Name', 'web-1');
    expect(notifications).toBe(2);
    stop();
  });

  test('a write calls onBlur once the field has re-rendered, so it sees the new value', async () => {
    const calls: string[] = [];
    function Field() {
      const [name, setName] = useState('');
      return (
        <FormField label="Name">
          <Input
            value={name}
            onChange={e => {
              calls.push(`change:${e.detail.value}`);
              setName(e.detail.value);
            }}
            onBlur={() => calls.push(`blur:${name}`)}
          />
        </FormField>
      );
    }
    render(<Field />);
    await flush();
    await write('Name', 'web-1');
    expect(calls).toEqual(['change:web-1', 'blur:web-1']);
  });

  test('fields are plain data', async () => {
    render(<Form />);
    await flush();
    expect(JSON.parse(JSON.stringify(fields))).toEqual(fields);
  });

  test('fields leave the registry when the page is hidden, and return when it is restored from the back/forward cache', async () => {
    render(<Form />);
    await flush();
    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });
    await flush();
    expect(fields).toHaveLength(0);
    const restored = new Event('pageshow');
    Object.defineProperty(restored, 'persisted', { value: true });
    act(() => {
      window.dispatchEvent(restored);
    });
    await flush();
    expect(fields).toHaveLength(7);
  });
});

describe('writes', () => {
  test('each control receives the shape its onChange emits', async () => {
    render(<Form />);
    await flush();
    expect(await write('Name', 'my-instance')).toBe(true);
    expect(await write('Notes', 'some notes')).toBe(true);
    expect(await write('Architecture (select)', 'arm64 (Graviton)')).toBe(true);
    expect(await write('Architecture (radio)', 'arm64')).toBe(true);
    expect(await write('Monitoring', true)).toBe(true);
    expect(await write('Feature', 'true')).toBe(true);
    expect(await write('Subnets', ['subnet-a (us-east-1a)', 'subnet-c'])).toBe(true);
    expect(fields.map(({ label, value }) => [label, value])).toEqual([
      ['Name', 'my-instance'],
      ['Notes', 'some notes'],
      ['Architecture (select)', 'arm64'],
      ['Architecture (radio)', 'arm64'],
      ['Monitoring', true],
      ['Feature', true],
      ['Subnets', ['subnet-a', 'subnet-c']],
    ]);
  });

  test('Checkbox and Toggle accept booleans, "true"/"false" and 1/0, and reject other values', async () => {
    render(<Form />);
    await flush();
    expect(await write('Monitoring', 1)).toBe(true);
    expect(field('Monitoring').value).toBe(true);
    expect(await write('Monitoring', 'false')).toBe(true);
    expect(field('Monitoring').value).toBe(false);
    expect(await write('Feature', 'maybe')).toBe(false);
    expect(field('Feature').value).toBe(false);
  });

  test('setValue rejects for an id that is not registered', async () => {
    await expect(awsuiPlugins.fieldRegistry.setValue('missing', 'web-1')).rejects.toThrow(
      'No field has the id "missing".'
    );
  });

  test('setValue rejects when the field unmounts before it re-renders', async () => {
    function Acknowledgement() {
      const [shown, setShown] = useState(true);
      return shown ? (
        <Checkbox checked={false} onChange={() => setShown(false)}>
          I acknowledge the terms
        </Checkbox>
      ) : null;
    }
    render(<Acknowledgement />);
    await flush();
    await expect(setValue('I acknowledge the terms', true)).rejects.toThrow('The field was removed.');
    expect(fields).toHaveLength(0);
  });

  test('disabled and read-only fields refuse writes', async () => {
    const onChange = jest.fn();
    render(
      <>
        <FormField label="Account">
          <Input value="123" readOnly={true} onChange={onChange} />
        </FormField>
        <FormField label="Engine">
          <Select selectedOption={null} options={ARCH} disabled={true} onChange={onChange} />
        </FormField>
      </>
    );
    await flush();
    expect(field('Account').readOnly).toBe(true);
    expect(field('Engine').disabled).toBe(true);
    expect(await write('Account', '999')).toBe(false);
    expect(await write('Engine', 'arm64')).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('option matching', () => {
  test('an exact value wins over a matching label', async () => {
    render(
      <SelectField
        options={[
          { label: '2', value: 'b' },
          { label: 'Two', value: '2' },
        ]}
      />
    );
    await flush();
    expect(await write('Size', '2')).toBe(true);
    expect(field('Size').value).toBe('2');
  });

  test('options inside groups can be set, and groups themselves cannot', async () => {
    render(<SelectField options={[{ label: 'Group A', options: [{ label: 'One', value: '1' }] }]} />);
    await flush();
    expect(await write('Size', 'Group A')).toBe(false);
    expect(await write('Size', '1')).toBe(true);
    expect(field('Size').value).toBe('1');
  });

  test('disabled options and options in disabled groups are refused', async () => {
    render(
      <SelectField
        options={[
          { label: 'Old', value: 'old', disabled: true },
          { label: 'Legacy', disabled: true, options: [{ label: 'One', value: '1' }] },
        ]}
      />
    );
    await flush();
    expect(await write('Size', 'old')).toBe(false);
    expect(await write('Size', '1')).toBe(false);
  });

  test('a label shared by two options is ambiguous and refused', async () => {
    render(
      <SelectField
        options={[
          { label: 'Default', value: 'a' },
          { label: 'Default', value: 'b' },
        ]}
      />
    );
    await flush();
    expect(await write('Size', 'Default')).toBe(false);
  });

  test('labels and values match ignoring case', async () => {
    render(<SelectField options={ARCH} />);
    await flush();
    expect(await write('Size', 'ARM64 (GRAVITON)')).toBe(true);
    expect(field('Size').value).toBe('arm64');
    expect(await write('Size', 'X86_64')).toBe(true);
    expect(field('Size').value).toBe('x86_64');
  });

  test('a Multiselect write is rejected as a whole when any item does not match', async () => {
    render(<Form />);
    await flush();
    expect(await write('Subnets', ['subnet-a', 'subnet-z'])).toBe(false);
    expect(field('Subnets').value).toEqual([]);
  });
});

describe('validation and state', () => {
  function BlurValidatedForm() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const validate = (value: string) => (!value ? 'Name is required' : value.length < 3 ? 'Name is too short' : '');
    return (
      <FormField label="Name" errorText={error}>
        <Input
          value={name}
          onChange={e => {
            setName(e.detail.value);
            if (error) {
              setError(validate(e.detail.value));
            }
          }}
          onBlur={() => setError(validate(name))}
        />
      </FormField>
    );
  }

  test('a write runs blur validation and resolves with the error', async () => {
    const { container } = render(<BlurValidatedForm />);
    await flush();
    await expect(setValue('Name', 'ab')).resolves.toMatchObject({
      value: 'ab',
      invalid: true,
      errorText: 'Name is too short',
    });
    expect(createWrapper(container).findFormField()!.findError()!.getElement()).toHaveTextContent('Name is too short');
    expect(field('Name')).toMatchObject({ invalid: true, errorText: 'Name is too short' });
  });

  test('a write that passes validation resolves without an error', async () => {
    const { container } = render(<BlurValidatedForm />);
    await flush();
    await expect(setValue('Name', 'web-1')).resolves.toMatchObject({ value: 'web-1', invalid: false });
    expect(createWrapper(container).findFormField()!.findError()).toBeNull();
  });

  test('the descriptor reports the FormField warning', async () => {
    render(
      <FormField label="Name" warningText="Name is long">
        <Input value="" onChange={() => {}} />
      </FormField>
    );
    await flush();
    expect(field('Name').warningText).toBe('Name is long');
  });

  test('Select and Multiselect report their statusType', async () => {
    render(
      <FormField label="Role">
        <Select selectedOption={null} options={[]} statusType="loading" onChange={() => {}} />
      </FormField>
    );
    await flush();
    expect(field('Role').statusType).toBe('loading');
  });
});

describe('showing the change', () => {
  test('a write scrolls the control into view', async () => {
    const { container } = render(<Form />);
    await flush();
    await write('Name', 'my-instance');
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(createWrapper(container).findInput()!.findNativeInput().getElement());
  });

  test('a refused write does not scroll', async () => {
    render(<Form />);
    await flush();
    await write('Feature', 'maybe');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test('a write opens the collapsed ExpandableSection around the field', async () => {
    const { container } = render(
      <ExpandableSection headerText="Advanced settings">
        <Form />
      </ExpandableSection>
    );
    await flush();
    expect(createWrapper(container).findExpandableSection()!.findExpandedContent()).toBeNull();
    await write('Name', 'my-instance');
    expect(createWrapper(container).findExpandableSection()!.findExpandedContent()).not.toBeNull();
  });

  test('a controlled ExpandableSection is asked to open through its onChange', async () => {
    const onChange = jest.fn();
    render(
      <ExpandableSection headerText="Advanced settings" expanded={false} onChange={e => onChange(e.detail)}>
        <Form />
      </ExpandableSection>
    );
    await flush();
    await write('Name', 'my-instance');
    expect(onChange).toHaveBeenCalledWith({ expanded: true });
  });
});

describe('accessibility', () => {
  test('registration renders no markup and does not affect accessibility', async () => {
    const { container } = render(<Form />);
    await flush();
    await expect(container).toValidateA11y();
  });

  test('a programmatic write leaves the form accessible', async () => {
    const { container } = render(<Form />);
    await flush();
    await write('Architecture (select)', 'arm64');
    await write('Subnets', ['subnet-a']);
    await expect(container).toValidateA11y();
  });
});
