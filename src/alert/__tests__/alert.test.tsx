// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Alert, { AlertProps } from '../../../lib/components/alert';
import Button from '../../../lib/components/button';
import { DATA_ATTR_ANALYTICS_ALERT } from '../../../lib/components/internal/analytics/selectors';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/alert/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

function renderAlert(props: AlertProps = {}) {
  const { container } = render(<Alert {...props} />);
  return { wrapper: createWrapper(container).findAlert()!, container };
}

beforeEach(() => {
  jest.mocked(useVisualRefresh).mockReset();
});

describe('Alert Component', () => {
  describe('structure', () => {
    it('has no header container when no header is set', () => {
      const { wrapper } = renderAlert();
      expect(wrapper.findHeader()).toBeNull();
    });
    it('displays header - string', () => {
      const { wrapper } = renderAlert({ header: 'Hello' });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Hello');
    });
    it('displays header - custom html', () => {
      const header = <b>Title</b>;
      const { wrapper } = renderAlert({ header });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Title');
    });
    it('displays body', () => {
      const content = <b>Some text</b>;
      const { wrapper } = renderAlert({ children: content });
      expect(wrapper.findContent().getElement()).toHaveTextContent('Some text');
    });
    it('shows a dismiss icon', () => {
      const { wrapper } = renderAlert({ dismissible: true });
      expect(wrapper.findDismissButton()).not.toBe(null);
    });
    it("doesn't show a dismiss icon when dissmisible is not set", () => {
      const { wrapper } = renderAlert();
      expect(wrapper.findDismissButton()).toBe(null);
    });
    it('shows an action button', () => {
      const { wrapper } = renderAlert({ buttonText: 'Button text' });
      expect(wrapper.findActionButton()).not.toBe(null);
    });
    it("doesn't show an action button when buttonText is not set", () => {
      const { wrapper } = renderAlert();
      expect(wrapper.findActionButton()).toBe(null);
    });
    it('correct button text', () => {
      const { wrapper } = renderAlert({ buttonText: 'Button text' });
      expect(wrapper.findActionButton()!.findTextRegion()!.getElement()).toHaveTextContent('Button text');
    });
    it('dismiss button has no default label', () => {
      const { wrapper } = renderAlert({ dismissible: true });
      expect(wrapper.findDismissButton()!.getElement()).not.toHaveAttribute('aria-label');
    });
    it('dismiss button can have specified label', () => {
      const { wrapper } = renderAlert({ dismissible: true, dismissAriaLabel: 'close' });
      expect(wrapper.findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'close');
    });
    it('status icon does not have a label by default', () => {
      const { wrapper } = renderAlert({});
      expect(wrapper.find('[role="img"]')!.getElement()).not.toHaveAttribute('aria-label');
    });
    it('status icon can have a label', () => {
      const { wrapper } = renderAlert({ statusIconAriaLabel: 'Info' });
      expect(wrapper.find('[role="img"]')!.getElement()).toHaveAttribute('aria-label', 'Info');
    });
  });
  describe('visibility', () => {
    it('shows the alert by default', () => {
      const { wrapper } = renderAlert();
      expect(wrapper.getElement()).toBeVisible();
    });
    it('hides the alert when visible is false', () => {
      const { wrapper } = renderAlert({ visible: false });
      expect(wrapper.getElement()).toHaveClass(styles.hidden);
    });
    it('shows the alert when visible is true', () => {
      const { wrapper } = renderAlert({ visible: true });
      expect(wrapper.getElement()).toBeVisible();
    });
    it('displays correct type', () => {
      (['error', 'warning', 'info', 'success'] as AlertProps.Type[]).forEach(alertType => {
        const { wrapper } = renderAlert({ type: alertType });
        expect(wrapper.findRootElement().getElement()).toHaveClass(styles[`type-${alertType}`]);
      });
    });
  });

  describe('functionality', () => {
    it('action button callback gets called', () => {
      const onButtonClickSpy = jest.fn();
      const { wrapper } = renderAlert({ buttonText: 'Button', onButtonClick: onButtonClickSpy });
      wrapper.findActionButton()!.click();
      expect(onButtonClickSpy).toHaveBeenCalled();
    });
    it('fires dismiss callback', () => {
      const onDismissSpy = jest.fn();
      const { wrapper } = renderAlert({ dismissible: true, onDismiss: onDismissSpy });
      wrapper.findDismissButton()!.click();
      expect(onDismissSpy).toHaveBeenCalled();
    });
    it('can be focused through the API', () => {
      let ref: AlertProps.Ref | null = null;
      render(<Alert header="Important" ref={element => (ref = element)} />);
      ref!.focus();
      expect(document.activeElement).toHaveClass(styles['alert-focus-wrapper']);
    });
  });

  it('renders `action` content', () => {
    const { wrapper } = renderAlert({ children: 'Message body', action: <Button>Click</Button> });
    expect(wrapper.findActionSlot()!.findButton()!.getElement()).toHaveTextContent('Click');
  });

  it('when both `buttonText` and `action` provided, prefers the latter', () => {
    const { wrapper } = renderAlert({
      children: 'Message body',
      buttonText: 'buttonText',
      action: <Button>Action</Button>,
    });

    expect(wrapper.findActionButton()).toBeNull();
    expect(wrapper.findActionSlot()!.findButton()!.getElement()).toHaveTextContent('Action');
  });

  test('a11y', async () => {
    const { container } = renderAlert({
      dismissible: true,
      header: 'Header',
      dismissAriaLabel: 'Dismiss',
      statusIconAriaLabel: 'Icon',
      action: <button type="button">Action</button>,
    });
    await expect(container).toValidateA11y();
  });

  describe('analytics', () => {
    test(`adds ${DATA_ATTR_ANALYTICS_ALERT} attribute with the alert type`, () => {
      const { container } = renderAlert({
        type: 'success',
        children: 'Message body',
      });

      const wrapper = createWrapper(container).findAlert()!;
      expect(wrapper.getElement()).toHaveAttribute(DATA_ATTR_ANALYTICS_ALERT, 'success');
    });
  });

  describe('icon size', () => {
    test('classic - big if has header and content', () => {
      const { wrapper } = renderAlert({ header: 'Header', children: ['Content'] });
      expect(wrapper.findByClassName(styles['icon-size-normal'])).toBeFalsy();
      expect(wrapper.findByClassName(styles['icon-size-big'])).toBeTruthy();
    });
    test('classic - normal if only header', () => {
      const { wrapper } = renderAlert({ header: 'Header' });
      expect(wrapper.findByClassName(styles['icon-size-big'])).toBeFalsy();
      expect(wrapper.findByClassName(styles['icon-size-normal'])).toBeTruthy();
    });
    test('classic - normal if only content', () => {
      const { wrapper } = renderAlert({ children: ['Content'] });
      expect(wrapper.findByClassName(styles['icon-size-big'])).toBeFalsy();
      expect(wrapper.findByClassName(styles['icon-size-normal'])).toBeTruthy();
    });
    test('visual refresh - always normal', () => {
      jest.mocked(useVisualRefresh).mockReturnValue(true);
      const { wrapper } = renderAlert({ header: 'Header', children: ['Content'] });
      expect(wrapper.findByClassName(styles['icon-size-big'])).toBeFalsy();
      expect(wrapper.findByClassName(styles['icon-size-normal'])).toBeTruthy();
    });
  });
});
