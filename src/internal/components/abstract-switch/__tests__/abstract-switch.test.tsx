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

  describe('aria-labelledby', () => {
    test('should not have a labelId if a label is not provided', () => {
      const wrapper = renderAbstractSwitch({
        controlClassName: '',
        outlineClassName: '',
        styledControl: <div />,
        controlId: 'custom-id',
        description: 'Description goes here',
        nativeControl: nativeControlProps => <input {...nativeControlProps} className="switch-element" type="radio" />,
        onClick: noop,
      });

      const nativeControl = wrapper.find('.switch-element')!.getElement();
      expect(nativeControl).not.toHaveAttribute('aria-labelledby');
      expect(wrapper.find('#custom-id-label')).toBeNull();
    });

    test('should be set to labelId if a label is provided', () => {
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

      expect(nativeControl).toHaveAttribute('aria-labelledby', 'custom-id-label');
      expect(nativeControl).toHaveAttribute('aria-describedby', 'custom-id-description');

      expect(wrapper.find('#custom-id-label')?.getElement()).toHaveTextContent('Label goes here');
      expect(wrapper.find('#custom-id-description')?.getElement()).toHaveTextContent('Description goes here');
    });

    test('should include labelId if an ariaLabelledBy id is provided', () => {
      const wrapper = renderAbstractSwitch({
        controlClassName: '',
        outlineClassName: '',
        styledControl: <div />,
        controlId: 'custom-id',
        ariaLabelledby: 'some-custom-label',
        ariaDescribedby: 'some-custom-description',
        label: 'label',
        description: 'description',
        nativeControl: nativeControlProps => <input {...nativeControlProps} className="switch-element" type="radio" />,
        onClick: noop,
      });

      const nativeControl = wrapper.find('.switch-element')!.getElement();
      expect(nativeControl).toHaveAttribute('aria-labelledby', 'custom-id-label some-custom-label');
      expect(nativeControl).toHaveAttribute('aria-describedby', 'some-custom-description custom-id-description');

      expect(wrapper.find('#custom-id-label')).not.toBe(null);
      expect(wrapper.find('#custom-id-description')).not.toBe(null);
    });
  });
});
