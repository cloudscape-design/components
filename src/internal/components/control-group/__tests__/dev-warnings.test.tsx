// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Autosuggest from '../../../../../lib/components/autosuggest';
import Input from '../../../../../lib/components/input';
import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import Multiselect from '../../../../../lib/components/multiselect';
import Select from '../../../../../lib/components/select';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const options = [{ value: '1', label: 'One' }];
const noop = () => {};

describe('Grouped control dev warnings', () => {
  describe('invalid prop', () => {
    test.each([
      ['Input', <Input key="c" value="" onChange={noop} invalid={true} />],
      ['Autosuggest', <Autosuggest key="c" value="" onChange={noop} options={options} invalid={true} />],
      ['Select', <Select key="c" selectedOption={null} onChange={noop} options={options} invalid={true} />],
      ['Multiselect', <Multiselect key="c" selectedOptions={[]} onChange={noop} options={options} invalid={true} />],
    ])('warns for %s inside a control group', (componentName: string, control: React.ReactNode) => {
      render(<ControlGroup>{control}</ControlGroup>);
      expect(warnOnce).toHaveBeenCalledWith(
        componentName,
        'The `invalid` prop is ignored on controls inside a control group. Set the validation state on the control group instead.'
      );
    });

    test('does not warn for a standalone control', () => {
      render(<Input value="" onChange={noop} invalid={true} />);
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('warning prop', () => {
    test.each([
      ['Input', <Input key="c" value="" onChange={noop} warning={true} />],
      [
        'Autosuggest',
        <Autosuggest key="c" value="" onChange={noop} options={options} enteredTextLabel={() => ''} warning={true} />,
      ],
      ['Select', <Select key="c" selectedOption={null} onChange={noop} options={options} warning={true} />],
      ['Multiselect', <Multiselect key="c" selectedOptions={[]} onChange={noop} options={options} warning={true} />],
    ])('warns for %s inside a control group', (componentName: string, control: React.ReactNode) => {
      render(<ControlGroup>{control}</ControlGroup>);
      expect(warnOnce).toHaveBeenCalledWith(
        componentName,
        'The `warning` prop is ignored on controls inside a control group. Set the validation state on the control group instead.'
      );
    });

    test('does not warn for a standalone control', () => {
      render(<Input value="" onChange={noop} warning={true} />);
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('readOnly prop', () => {
    test.each([
      ['Input', <Input key="c" value="" onChange={noop} readOnly={true} />],
      ['Autosuggest', <Autosuggest key="c" value="" onChange={noop} options={options} readOnly={true} />],
      ['Select', <Select key="c" selectedOption={null} onChange={noop} options={options} readOnly={true} />],
      ['Multiselect', <Multiselect key="c" selectedOptions={[]} onChange={noop} options={options} readOnly={true} />],
    ])('warns for %s inside a control group', (componentName: string, control: React.ReactNode) => {
      render(<ControlGroup>{control}</ControlGroup>);
      expect(warnOnce).toHaveBeenCalledWith(
        componentName,
        'The `readOnly` prop is not supported on controls inside a control group.'
      );
    });

    test('does not warn for a standalone control', () => {
      render(<Input value="" onChange={noop} readOnly={true} />);
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('multiselect inlineTokens prop', () => {
    test('warns when inlineTokens is false inside a control group', () => {
      render(
        <ControlGroup>
          <Multiselect selectedOptions={[]} onChange={noop} options={options} inlineTokens={false} />
        </ControlGroup>
      );
      expect(warnOnce).toHaveBeenCalledWith(
        'Multiselect',
        'The `inlineTokens` prop is ignored inside a control group; tokens are always shown inline.'
      );
    });

    test('does not warn when inlineTokens is true inside a control group', () => {
      render(
        <ControlGroup>
          <Multiselect selectedOptions={[]} onChange={noop} options={options} inlineTokens={true} />
        </ControlGroup>
      );
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when inlineTokens is undefined inside a control group', () => {
      render(
        <ControlGroup>
          <Multiselect selectedOptions={[]} onChange={noop} options={options} />
        </ControlGroup>
      );
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when inlineTokens is false for a standalone multiselect', () => {
      render(<Multiselect selectedOptions={[]} onChange={noop} options={options} inlineTokens={false} />);
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('expandToViewport prop', () => {
    test.each([
      ['Autosuggest', <Autosuggest key="c" value="" onChange={noop} options={options} expandToViewport={false} />],
      ['Select', <Select key="c" selectedOption={null} onChange={noop} options={options} expandToViewport={false} />],
      [
        'Multiselect',
        <Multiselect key="c" selectedOptions={[]} onChange={noop} options={options} expandToViewport={false} />,
      ],
    ])(
      'warns for %s when expandToViewport is false inside a control group',
      (componentName: string, control: React.ReactNode) => {
        render(<ControlGroup>{control}</ControlGroup>);
        expect(warnOnce).toHaveBeenCalledWith(
          componentName,
          'The `expandToViewport` prop is ignored inside a control group; the dropdown is always expanded to the viewport.'
        );
      }
    );

    test('does not warn when expandToViewport is true inside a control group', () => {
      render(
        <ControlGroup>
          <Select selectedOption={null} onChange={noop} options={options} expandToViewport={true} />
        </ControlGroup>
      );
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when expandToViewport is undefined inside a control group', () => {
      render(
        <ControlGroup>
          <Select selectedOption={null} onChange={noop} options={options} />
        </ControlGroup>
      );
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when expandToViewport is false for a standalone control', () => {
      render(<Select selectedOption={null} onChange={noop} options={options} expandToViewport={false} />);
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });
});
