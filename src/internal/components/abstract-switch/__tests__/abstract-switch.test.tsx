// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import AbstractSwitch, { AbstractSwitchProps } from '../../../../../lib/components/internal/components/abstract-switch';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import '../../../../__a11y__/to-validate-a11y';

function renderAbstractSwitch(props: AbstractSwitchProps) {
  const { container } = render(<AbstractSwitch {...props} />);
  return createWrapper(container);
}
const noop = () => {};

describe('Abstract switch', () => {
  test('renders inside a <label> with proper html semantics', () => {
    const { container } = render(
      <label>
        <AbstractSwitch
          controlClassName=""
          outlineClassName=""
          styledControl={<div />}
          controlId="custom-id"
          description="Description goes here"
          nativeControl={nativeControlProps => (
            <input {...nativeControlProps} className="switch-element" type="radio" />
          )}
          onClick={noop}
        />
      </label>
    );

    expect(container).toValidateA11y();
  });

  describe('labels and descriptions', () => {
    test('should be default use `label` and `description`', () => {
      const wrapper = renderAbstractSwitch({
        controlClassName: '',
        outlineClassName: '',
        styledControl: <div />,
        label: 'Label goes here',
        controlId: 'custom-id',
        description: 'Description goes here',
        nativeControl: nativeControlProps => <input {...nativeControlProps} className="switch-element" type="radio" />,
        onClick: noop,
      });

      const nativeControl = wrapper.find('.switch-element')!.getElement();

      expect(nativeControl).toHaveAccessibleName('Label goes here');
      expect(nativeControl).toHaveAccessibleDescription('Description goes here');
    });

    test('label can be overwritten by `ariaLabel`', () => {
      const wrapper = renderAbstractSwitch({
        controlClassName: '',
        outlineClassName: '',
        styledControl: <div />,
        label: 'Label goes here',
        controlId: 'custom-id',
        ariaLabel: 'Custom aria label',
        nativeControl: nativeControlProps => <input {...nativeControlProps} className="switch-element" type="radio" />,
        onClick: noop,
      });

      const nativeControl = wrapper.find('.switch-element')!.getElement();

      expect(nativeControl).toHaveAccessibleName('Custom aria label');
    });

    test('can add additional labelledby and describedby references', () => {
      const wrapper = renderAbstractSwitch({
        controlClassName: '',
        outlineClassName: '',
        styledControl: (
          <div>
            <span id="some-custom-label">Custom label</span>
            <span id="some-custom-description">Custom description</span>
          </div>
        ),
        controlId: 'custom-id',
        ariaLabelledby: 'some-custom-label',
        ariaDescribedby: 'some-custom-description',
        label: 'Default label',
        description: 'Default description',
        nativeControl: nativeControlProps => <input {...nativeControlProps} className="switch-element" type="radio" />,
        onClick: noop,
      });

      const nativeControl = wrapper.find('.switch-element')!.getElement();
      expect(nativeControl).toHaveAccessibleName('Default label Custom label');
      expect(nativeControl).toHaveAccessibleDescription('Custom description Default description');
    });
  });
});
