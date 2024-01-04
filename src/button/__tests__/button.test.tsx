// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import Button, { ButtonProps } from '../../../lib/components/button';
import InternalButton from '../../../lib/components/button/internal';
import createWrapper, { ButtonWrapper } from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/button/styles.css.js';
import { buttonRelExpectations, buttonTargetExpectations } from '../../__tests__/target-rel-test-helper';
import { renderWithGridNavigation } from '../../table/table-role/__tests__/utils';

function renderWrappedButton(props: ButtonProps = {}) {
  const onClickSpy = jest.fn();
  const renderResult = render(
    <div onClick={onClickSpy}>
      <Button {...props} />
    </div>
  );
  const wrapper = createWrapper(renderResult.container).findButton()!;
  return { onClickSpy, wrapper };
}

function renderButton(props: ButtonProps = {}) {
  const renderResult = render(<Button {...props} />);
  return createWrapper(renderResult.container).findButton()!;
}

function findIcons(wrapper: ButtonWrapper) {
  return wrapper.findAll(`.${styles.icon}`);
}

function expectToHaveClasses(element: HTMLElement, classesMap: Record<string, boolean>) {
  Object.keys(classesMap).forEach(className => {
    if (classesMap[className]) {
      expect(element).toHaveClass(className);
    } else {
      expect(element).not.toHaveClass(className);
    }
  });
}

describe('Button Component', () => {
  test('wraps text by default', () => {
    const wrapper = renderButton();
    expect(wrapper.getElement()).not.toHaveClass(styles['button-no-wrap']);
  });

  test('sets "white-space: nowrap" when wrapText is false', () => {
    const wrapper = renderButton({ wrapText: false });
    expect(wrapper.getElement()).toHaveClass(styles['button-no-wrap']);
  });

  test('can be focused through the API', () => {
    let button: ButtonProps.Ref | null = null;
    const renderResult = render(<Button ref={el => (button = el)} />);
    const wrapper = createWrapper(renderResult.container);
    button!.focus();
    expect(document.activeElement).toBe(wrapper.findButton()!.getElement());
  });

  describe('disabled property', () => {
    test('renders button with normal styling by default', () => {
      const wrapper = renderButton();
      expect(wrapper.isDisabled()).toEqual(false);
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
      expect(wrapper.getElement()).not.toHaveClass(styles.disabled);
    });

    test('renders button with disabled styling when true', () => {
      const wrapper = renderButton({ disabled: true });
      expect(wrapper.isDisabled()).toEqual(true);
      expect(wrapper.getElement()).toHaveClass(styles.disabled);
      expect(wrapper.getElement()).toHaveAttribute('disabled');
      // In this case, aria-disabled would be redundant, so we don't set it
      expect(wrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(wrapper.isDisabled()).toBe(true);
    });

    test('does not add the disabled attribute on link buttons', () => {
      const wrapper = renderButton({ disabled: true, href: 'https://amazon.com' });
      expect(wrapper.isDisabled()).toEqual(true);
      expect(wrapper.getElement()).toHaveClass(styles.disabled);
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled');
      expect(wrapper.isDisabled()).toBe(true);
    });

    test('adds a tab index -1 when button with link is disabled', () => {
      const wrapper = renderButton({ disabled: true, href: 'https://amazon.com' });
      expect(wrapper.getElement()).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('iconName property', () => {
    test('does not render icon element when no icon provided', () => {
      const wrapper = renderButton();
      expect(findIcons(wrapper)).toHaveLength(0);
    });

    test('applies icon when value provided', () => {
      const wrapper = renderButton({ iconName: 'settings' });
      expect(findIcons(wrapper)).toHaveLength(1);
    });
  });

  describe('ariaExpanded property', () => {
    test('adds aria-expanded property to button', () => {
      const wrapper = renderButton({ ariaExpanded: true });
      expect(wrapper.getElement()).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('ariaDescribedby property', () => {
    test('adds aria-describedby property to button', () => {
      const wrapper = renderButton({ ariaDescribedby: 'my-element' });
      expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'my-element');
    });

    test("doesn't add an aria-describedby property if not provided", () => {
      const wrapper = renderButton();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('iconUrl property', () => {
    const iconUrl = 'data:image/png;base64,aaaa';
    const iconAlt = 'Custom icon';

    test('allows to render custom icon with alt text', () => {
      const wrapper = renderButton({ iconUrl, iconAlt });
      const icons = findIcons(wrapper);
      expect(icons).toHaveLength(1);
      const icon = icons[0];
      expect(icon.find('img')!.getElement()).toHaveAttribute('alt', iconAlt);
      expect(icon.find('img')!.getElement()).toHaveAttribute('src', iconUrl);
      expectToHaveClasses(icon.getElement(), {
        [styles['icon-left']]: true,
        [styles['icon-right']]: false,
      });
    });

    test('allows to render custom icon with alignment to the right', () => {
      const wrapper = renderButton({ iconUrl, iconAlt, iconAlign: 'right' });
      const icons = findIcons(wrapper);
      expect(icons).toHaveLength(1);
      expect(icons[0].find('img')).toBeTruthy();
      expectToHaveClasses(icons[0].getElement(), {
        [styles['icon-left']]: false,
        [styles['icon-right']]: true,
      });
    });
  });

  describe('iconSvg property', () => {
    const iconSvg = (
      <svg className="test-svg">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );

    test('allows to render custom icon', () => {
      const wrapper = renderButton({ iconSvg });
      const icons = findIcons(wrapper);
      expect(icons).toHaveLength(1);
      const icon = icons[0];
      expect(icon.findByClassName('test-svg')).toBeTruthy();
      expectToHaveClasses(icon.getElement(), {
        [styles['icon-left']]: true,
        [styles['icon-right']]: false,
      });
    });

    test('allows to render custom icon with alignment to the right', () => {
      const wrapper = renderButton({ iconSvg, iconAlign: 'right' });
      const icons = findIcons(wrapper);
      expect(icons).toHaveLength(1);
      expect(icons[0].findByClassName('test-svg')).toBeTruthy();
      expectToHaveClasses(icons[0].getElement(), {
        [styles['icon-left']]: false,
        [styles['icon-right']]: true,
      });
    });
  });

  describe('formAction property', () => {
    function renderButtonInForm(props: ButtonProps = {}) {
      const submitSpy = jest.fn();
      const renderResult = render(
        <form onSubmit={submitSpy}>
          <Button {...props} />
        </form>
      );
      const buttonWrapper = createWrapper(renderResult.container).findButton()!;
      return [buttonWrapper, submitSpy] as const;
    }

    beforeEach(() => {
      // JSDOM prints an error message to browser logs when form attempted to submit
      // https://github.com/jsdom/jsdom/issues/1937
      // We use it as an assertion
      jest.spyOn(console, 'error').mockImplementation(() => {
        /*do not print anything to browser logs*/
      });
    });

    afterEach(() => {
      expect(console.error).not.toHaveBeenCalled();
    });

    // this represents the behavior of native <button />
    test('should have "submit" by default', () => {
      const wrapper = renderButton();
      expect(wrapper.getElement()).toHaveAttribute('type', 'submit');
    });

    test('should add an attribute to the button element', () => {
      const wrapper = renderButton({ formAction: 'none' });
      expect(wrapper.getElement()).toHaveAttribute('type', 'button');
    });

    test('should not add anything if link variant is chosen', () => {
      const wrapper = renderButton({ formAction: 'none', href: 'some' });
      expect(wrapper.getElement()).not.toHaveAttribute('type');
    });

    test('should submit the form when clicking the submit button', () => {
      const [wrapper, submitSpy] = renderButtonInForm();
      wrapper.click();
      expect(submitSpy).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Error',
          message: 'Not implemented: HTMLFormElement.prototype.requestSubmit',
        })
      );
      (console.error as jest.Mock).mockClear();
    });

    test('cancelling click event prevents submission', () => {
      const [wrapper, submitSpy] = renderButtonInForm({ onClick: event => event.preventDefault() });
      wrapper.click();
      expect(submitSpy).not.toHaveBeenCalled();
    });

    test('should not submit the form if click the regular button', () => {
      const [wrapper, submitSpy] = renderButtonInForm({ formAction: 'none' });
      wrapper.click();
      expect(submitSpy).not.toHaveBeenCalled();
    });
  });

  describe('iconAlign property', () => {
    test('should have "left" by default', () => {
      const wrapper = renderButton({ iconName: 'settings' });
      expect(findIcons(wrapper)).toHaveLength(1);
      expectToHaveClasses(findIcons(wrapper)[0].getElement(), {
        [styles['icon-left']]: true,
        [styles['icon-right']]: false,
      });
    });

    test('should add an icon if value is "right"', () => {
      const wrapper = renderButton({ iconName: 'settings', iconAlign: 'right' });
      expect(findIcons(wrapper)).toHaveLength(1);
      expectToHaveClasses(findIcons(wrapper)[0].getElement(), {
        [styles['icon-left']]: false,
        [styles['icon-right']]: true,
      });
    });

    test('should not add a left icon if button is loading', () => {
      const wrapper = renderButton({ iconName: 'settings', loading: true });
      expect(findIcons(wrapper)).toHaveLength(1);
      expect(wrapper.findLoadingIndicator()).not.toBeNull();
    });

    test('should add a right icon if button is loading', () => {
      const wrapper = renderButton({ iconName: 'settings', iconAlign: 'right', loading: true });
      const icons = findIcons(wrapper);
      expect(icons).toHaveLength(2);
      expect(icons[0]).toEqual(wrapper.findLoadingIndicator());
      expectToHaveClasses(icons[0].getElement(), {
        [styles['icon-left']]: true,
        [styles['icon-right']]: false,
      });
      expectToHaveClasses(icons[1].getElement(), {
        [styles['icon-left']]: false,
        [styles['icon-right']]: true,
      });
    });

    (['icon', 'inline-icon'] as ButtonProps.Variant[]).forEach(variant => {
      test(`should ignore iconAlign property if button variant is ${variant}`, () => {
        const wrapper = renderButton({ iconName: 'settings', iconAlign: 'right', variant });
        expect(findIcons(wrapper)).toHaveLength(1);
        expectToHaveClasses(findIcons(wrapper)[0].getElement(), {
          [styles['icon-left']]: true,
          [styles['icon-right']]: false,
        });
      });

      test(`should not add text if button ${variant} is icon`, () => {
        const wrapper = renderButton({ iconName: 'settings', variant, children: 'text' });
        expect(wrapper.findTextRegion()).toBe(null);
      });
    });
  });

  describe('Loading property', () => {
    test("should disable the button with aria-disabled when in 'loading' status", () => {
      const onClickSpy = jest.fn();
      const wrapper = renderButton({ onClick: onClickSpy, loading: true });
      expect(wrapper.findLoadingIndicator()).not.toBeNull();
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled');
      expect(wrapper.isDisabled()).toBe(true);
      act(() => wrapper.click());
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('gives loading precedence over disabled', () => {
      const wrapper = renderButton({ loading: true, disabled: true });
      // Loading indicator is shown even when the button is also disabled.
      expect(wrapper.findLoadingIndicator()).not.toBeNull();
      // However, setting `disabled` does mean that the button can no longer be focused.
      expect(wrapper.getElement()).toHaveAttribute('disabled');
      expect(wrapper.getElement()).not.toHaveAttribute('aria-disabled');
      expect(wrapper.isDisabled()).toBe(true);
    });

    test('adds a tab index -1 to the link button', () => {
      const wrapper = renderButton({ loading: true, href: 'https://amazon.com' });
      expect(wrapper.getElement()).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('children property', () => {
    test('displays content within rendered button element when non-empty', () => {
      const wrapper = renderButton({ children: 'Button Label' });
      expect(wrapper.findTextRegion()!.getElement()).toHaveTextContent('Button Label');
    });

    test('contains no text when empty', () => {
      const wrapper = renderButton({ children: null });
      expect(wrapper.findTextRegion()).toBe(null);
    });

    test('contains no text when empty and icon specified', () => {
      const wrapper = renderButton({ iconName: 'settings' });
      expect(wrapper.findTextRegion()).toBe(null);
    });
  });

  describe('aria-label attribute and children content', () => {
    test('renders from ariaLabel property', () => {
      const wrapper = renderButton({ ariaLabel: 'Benjamin', children: 'Button' });
      expect(wrapper.getElement()).toHaveAccessibleName('Benjamin');
      expect(wrapper.findTextRegion()!.getElement()).toHaveTextContent('Button');
    });

    test('does not render if there is no label property', () => {
      const wrapper = renderButton({ children: 'Button' });
      expect(wrapper.getElement()).toHaveAccessibleName('Button');
    });

    test('adds ariaLabel as title attribute - icon-only', () => {
      const wrapper = renderButton({ ariaLabel: 'Benjamin', variant: 'icon', iconName: 'add-plus' });
      expect(wrapper.getElement()).toHaveAttribute('title', 'Benjamin');
    });

    test('adds ariaLabel as title attribute - standard', () => {
      const wrapper = renderButton({ ariaLabel: 'Remove item 1', children: 'Remove' });
      expect(wrapper.getElement()).toHaveAttribute('title', 'Remove item 1');
    });

    test('does not add title to buttons without ariaLabel', () => {
      const wrapper = renderButton({ variant: 'icon', iconName: 'add-plus' });
      expect(wrapper.getElement()).not.toHaveAttribute('title');
    });
  });

  describe('form property', () => {
    test('should have form property when set', () => {
      const formId = 'form-id';
      const wrapper = renderButton({ form: formId });
      expect(wrapper.getElement()).toHaveAttribute('form', formId);
    });
  });

  describe('button links', () => {
    test('uses an a element if an href is provided', () => {
      const wrapper = renderButton({ href: 'https://amazon.com' });
      expect(wrapper.getElement().tagName).toEqual('A');
    });

    test('mirrors the href property as href attribute', () => {
      const wrapper = renderButton({ href: 'https://amazon.com' });
      expect(wrapper.getElement()).toHaveAttribute('href', 'https://amazon.com');
    });

    test.each(buttonTargetExpectations)('"target" property %s', (props, expectation) => {
      const wrapper = renderButton({ ...props });
      expectation
        ? expect(wrapper.getElement()).toHaveAttribute('target', expectation)
        : expect(wrapper.getElement()).not.toHaveAttribute('target');
    });

    test.each(buttonRelExpectations)('"rel" property %s', (props, expectation) => {
      const wrapper = renderButton({ ...props });
      expectation
        ? expect(wrapper.getElement()).toHaveAttribute('rel', expectation)
        : expect(wrapper.getElement()).not.toHaveAttribute('rel');
    });

    test('can add a download attribute if it is a link', () => {
      let wrapper = renderButton({ download: 'fileName' });
      expect(wrapper.getElement()).not.toHaveAttribute('download');
      wrapper = renderButton({ href: 'https://amazon.com', download: 'fileName' });
      expect(wrapper.getElement()).toHaveAttribute('download', 'fileName');
      wrapper = renderButton({ href: 'https://amazon.com' });
      expect(wrapper.getElement()).not.toHaveAttribute('download');
    });
  });

  describe('Button clicks', () => {
    test('calls onClick when the button is clicked', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderButton({ onClick: onClickSpy });
      wrapper.click();
      expect(onClickSpy).toHaveBeenCalled();
    });

    test('does not call onClick on link buttons when button is disabled', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderButton({ onClick: onClickSpy, disabled: true, href: 'https://amazon.com' });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('does not call onClick on regular buttons when button is disabled', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderButton({ onClick: onClickSpy, disabled: true });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('allows event propagation by default', () => {
      const { onClickSpy, wrapper } = renderWrappedButton();
      wrapper.click();
      expect(onClickSpy).toHaveBeenCalled();
    });

    test('can prevent event propagation', () => {
      const { onClickSpy, wrapper } = renderWrappedButton({ onClick: event => event.stopPropagation() });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    describe('Button clicks with key pressed', () => {
      test('does not call onClick with metakey when the button is normally clicked', () => {
        const onClickSpy = jest.fn();
        const wrapper = renderButton({ onClick: onClickSpy });
        wrapper.click();

        expect(onClickSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { button: 0, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false },
          })
        );
      });

      test('calls onClick with modifiers when the button is clicked with modifiers', () => {
        const onClickSpy = jest.fn();
        const wrapper = renderButton({ onClick: onClickSpy });
        wrapper.click({ button: 0, ctrlKey: true, shiftKey: true, altKey: true, metaKey: true });

        expect(onClickSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { button: 0, ctrlKey: true, shiftKey: true, altKey: true, metaKey: true },
          })
        );
      });
    });

    describe('onFollow', () => {
      test('calls onFollow when button with `href` is clicked normally', () => {
        const onFollowSpy = jest.fn();
        const wrapper = renderButton({ onFollow: onFollowSpy, href: 'http://example.com' });
        wrapper.click();

        expect(onFollowSpy).toHaveBeenCalled();
      });

      test('does not call onFollow when button without `href` is clicked', () => {
        const onFollowSpy = jest.fn();
        const wrapper = renderButton({ onFollow: onFollowSpy });
        wrapper.click();

        expect(onFollowSpy).not.toHaveBeenCalled();
      });

      test('does not call onFollow when button is clicked with modifiers', () => {
        const onFollowSpy = jest.fn();
        const wrapper = renderButton({ onFollow: onFollowSpy, href: 'http://example.com' });
        wrapper.click({ button: 0, ctrlKey: true });

        expect(onFollowSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('URL sanitization', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy?.mockRestore();
      consoleErrorSpy?.mockRestore();
    });

    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderButton({ href: 'javascript:void(0)' });
      expect((element.getElement() as unknown as HTMLAnchorElement).href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() => renderButton({ href: "javascript:alert('Hello!')" })).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [Button] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello!')".`
      );
    });
  });

  test.each(['normal', 'primary', 'link'] as const)(
    'Assigns full-width class for buttons with content, variant=%s',
    variant => {
      const wrapper = renderButton({ fullWidth: true, variant, children: 'Content' });
      expectToHaveClasses(wrapper.getElement(), { [styles['full-width']]: true });
    }
  );

  test.each(['normal', 'primary', 'link'] as const)(
    'Does not assign full-width class buttons without content, variant=%s',
    variant => {
      const wrapper = renderButton({ fullWidth: true, variant, iconName: 'settings', iconAlign: 'left' });
      expectToHaveClasses(wrapper.getElement(), { [styles['full-width']]: false });
    }
  );

  test.each(['icon', 'inline-icon'] as const)(
    'Does not assign full-width class buttons without content, variant=%s',
    variant => {
      const wrapper = renderButton({ fullWidth: true, variant, iconName: 'settings', iconAlign: 'left' });
      expectToHaveClasses(wrapper.getElement(), { [styles['full-width']]: false });
    }
  );
});

describe('table grid navigation support', () => {
  test('does not override tab index when keyboard navigation is not active', () => {
    renderWithGridNavigation({ target: null }, <Button id="button" />);
    expect(document.querySelector('#button')).not.toHaveAttribute('tabIndex');
  });

  test('overrides tab index when keyboard navigation is active', () => {
    renderWithGridNavigation(
      { target: '#button1' },
      <div>
        <Button id="button1" />
        <Button id="button2" />
      </div>
    );
    expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '0');
    expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
  });

  test('does not override explicit tab index with 0', () => {
    renderWithGridNavigation(
      { target: '#button1' },
      <div>
        <InternalButton id="button1" __nativeAttributes={{ tabIndex: -2 }} />
        <InternalButton id="button2" __nativeAttributes={{ tabIndex: -2 }} />
      </div>
    );
    expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '-2');
    expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
  });
});
