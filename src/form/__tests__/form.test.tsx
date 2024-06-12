// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Form, { FormProps } from '../../../lib/components/form';
import alertStyles from '../../../lib/components/alert/styles.selectors.js';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.selectors.js';

function renderForm(props: FormProps = {}) {
  const { container } = render(<Form {...props} errorIconAriaLabel="Error icon" />);
  return createWrapper(container).findForm()!;
}

describe('Form Component', () => {
  describe('structure', () => {
    it('has no header container when no header is set', () => {
      const wrapper = renderForm();
      expect(wrapper.findHeader()).toBeNull();
    });

    it('displays header - custom html', () => {
      const wrapper = renderForm({ header: <h1>Form header</h1> });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Form header');
    });

    it('has no content container when no content is set', () => {
      const wrapper = renderForm();
      expect(wrapper.findContent()).toBeNull();
    });

    it('displays content - custom html', () => {
      const wrapper = renderForm({ children: <span>Form content</span> });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Form content');
    });

    it('form contains no error by default', () => {
      const wrapper = renderForm();
      expect(wrapper.findError()).toBeNull();
    });

    it('form displays the error when set, removes when unset', () => {
      let wrapper = renderForm({ errorText: 'Some error' });
      expect(wrapper.findError()!.getElement()).toHaveTextContent('Some error');

      wrapper = renderForm({ errorText: '' });
      expect(wrapper.findError()).toBeNull();
    });

    it('form error includes alert and live region', () => {
      const wrapper = renderForm({ errorText: 'Some error' });

      expect(wrapper.findByClassName(alertStyles.root)!.getElement()).toHaveTextContent('Some error');
      expect(wrapper.findByClassName(liveRegionStyles.root)!.getElement()).toHaveTextContent('Error icon, Some error');
    });

    it('has no actions container when no actions are set', () => {
      const wrapper = renderForm();
      expect(wrapper.findActions()).toBeNull();
    });

    it('displays action button', () => {
      const wrapper = renderForm({ actions: <button>Click me!</button> });
      expect(wrapper.findActions()!.find('button')!.getElement()).toHaveTextContent('Click me!');
    });
  });
});
