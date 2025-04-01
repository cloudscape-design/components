// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Alert, { AlertProps } from '../../../lib/components/alert';
import Button from '../../../lib/components/button';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { DATA_ATTR_ANALYTICS_ALERT } from '../../../lib/components/internal/analytics/selectors';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/alert/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

let mockElementOffsetLeft = 200;

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    configurable: true,
    enumerable: true,
    get() {
      return mockElementOffsetLeft;
    },
  },
});

function renderAlert(props: AlertProps = {}) {
  const { container } = render(<Alert {...props} />);
  return { wrapper: createWrapper(container).findAlert()!, container };
}

const i18nStrings: AlertProps.I18nStrings = {
  successIconAriaLabel: 'status: success',
  infoIconAriaLabel: 'status: info',
  warningIconAriaLabel: 'status: warning',
  errorIconAriaLabel: 'status: error',
  dismissAriaLabel: 'dismiss',
};

beforeEach(() => {
  jest.mocked(useVisualRefresh).mockReset();
  mockElementOffsetLeft = 200;
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
      const { wrapper } = renderAlert({ dismissible: true, i18nStrings });
      expect(wrapper.findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'dismiss');
    });
    it('status icon does not have a label by default', () => {
      const { wrapper } = renderAlert({});
      expect(wrapper.find('[role="img"]')).toBeNull();
    });
    it('status icon can have a label', () => {
      const { wrapper } = renderAlert({ i18nStrings });
      expect(wrapper.find('[role="img"]')!.getElement()).toHaveAttribute('aria-label', 'status: info');
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

  it('adds wrapped class to actions if they are displayed on a new line', () => {
    mockElementOffsetLeft = 10;
    const { container } = renderAlert({
      children: 'Message body',
      action: <Button>Click</Button>,
    });
    expect(container.querySelector(`.${styles['action-wrapped']}`)).toBeTruthy();
  });

  it('does not add wrapped class to actions if they are displayed on same line', () => {
    mockElementOffsetLeft = 200;
    const { container } = renderAlert({
      children: 'Message body',
      action: <Button>Click</Button>,
    });
    expect(container.querySelector(`.${styles['action-wrapped']}`)).toBeFalsy();
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
      i18nStrings,
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

  describe('i18n', () => {
    const alertTypes: AlertProps.Type[] = ['info', 'success', 'error', 'warning'];
    const i18nMessages = {
      alert: {
        'i18nStrings.successIconAriaLabel': 'success default label',
        'i18nStrings.infoIconAriaLabel': 'info default label',
        'i18nStrings.warningIconAriaLabel': 'warning default label',
        'i18nStrings.errorIconAriaLabel': 'error default label',
        'i18nStrings.dismissAriaLabel': 'dismiss default label',
      },
    };

    function renderAlertForI18n(props: AlertProps = {}) {
      const { container } = render(
        <TestI18nProvider messages={i18nMessages}>
          <Alert {...props} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container)!.findAlert()!;
      const statusIcon = wrapper.findByClassName(styles.icon)!.findIcon()!.getElement();
      const dismissButton = wrapper.findDismissButton()!.getElement();
      return { statusIcon, dismissButton };
    }

    describe.each(alertTypes)('alert type: %s', type => {
      it('assigns the specified aria labels via i18nStrings prop', () => {
        const { statusIcon, dismissButton } = renderAlertForI18n({ dismissible: true, type, i18nStrings });
        expect(statusIcon).toHaveAccessibleName(`status: ${type}`);
        expect(dismissButton).toHaveAccessibleName('dismiss');
      });

      it('assigns the labels from i18n provider, when not specified', () => {
        const { statusIcon, dismissButton } = renderAlertForI18n({ dismissible: true, type });
        expect(statusIcon).toHaveAccessibleName(`${type} default label`);
        expect(dismissButton).toHaveAccessibleName('dismiss default label');
      });
    });

    describe('deprecated aria labels', () => {
      it('ignores the deprecated values if i18nStrings is specified', () => {
        const { statusIcon, dismissButton } = renderAlertForI18n({
          dismissible: true,
          dismissAriaLabel: 'deprecated dismiss label',
          statusIconAriaLabel: 'deprecated status icon label',
          i18nStrings,
        });
        expect(statusIcon).toHaveAccessibleName('status: info');
        expect(dismissButton).toHaveAccessibleName('dismiss');
      });

      it('uses the deprecated values if i18nStrings is not specified', () => {
        const { statusIcon, dismissButton } = renderAlertForI18n({
          dismissible: true,
          dismissAriaLabel: 'deprecated dismiss label',
          statusIconAriaLabel: 'deprecated status icon label',
        });
        expect(statusIcon).toHaveAccessibleName('deprecated status icon label');
        expect(dismissButton).toHaveAccessibleName('deprecated dismiss label');
      });
    });
  });
});
