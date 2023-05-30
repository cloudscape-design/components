// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import Modal, { ModalProps } from '../../../lib/components/modal';
import createWrapper, { ElementWrapper, ModalWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/modal/styles.css.js';
import { KeyCode } from '../../internal/keycode';

class ModalInternalWrapper extends ModalWrapper {
  findDialog(): ElementWrapper {
    return this.findByClassName(styles.dialog)!;
  }

  findFocusLock(): ElementWrapper {
    return this.findByClassName(styles['focus-lock'])!;
  }
}

function renderModal(props: Partial<ModalProps> = {}) {
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const { container } = render(<Modal visible={false} {...props} modalRoot={modalRoot} />, {
    container: modalRoot,
  });

  const element = createWrapper(container).findModal()!.getElement();
  return new ModalInternalWrapper(element);
}

describe('Modal component', () => {
  describe('structure', () => {
    it('displays header - string', () => {
      const wrapper = renderModal({ header: 'Some header text' });
      expect(wrapper.findHeader().getElement()).toHaveTextContent('Some header text');
    });
    it('displays header - custom html', () => {
      const header = <b>Some header text</b>;
      const wrapper = renderModal({ header });
      expect(wrapper.findHeader().getElement()).toHaveTextContent('Some header text');
    });
    it('displays body', () => {
      const content = <b>Some text</b>;
      const wrapper = renderModal({ children: content });
      expect(wrapper.findContent().getElement()).toHaveTextContent('Some text');
    });
    it('displays footer - string', () => {
      const wrapper = renderModal({ footer: 'Some footer text' });
      expect(wrapper.findFooter()!.getElement()).toHaveTextContent('Some footer text');
    });
    it('displays footer - custom html', () => {
      const footer = <b>Some footer text</b>;
      const wrapper = renderModal({ footer });
      expect(wrapper.findFooter()!.getElement()).toHaveTextContent('Some footer text');
    });
    it('renders no footer, if no footer is defined', () => {
      const wrapper = renderModal({ footer: null });
      expect(wrapper.findFooter()).toBe(null);
    });
    it('shows a dismiss icon', () => {
      const wrapper = renderModal({});
      expect(wrapper.findDismissButton()).not.toBe(null);
    });
  });

  describe('visibility', () => {
    it('hides the modal by default', () => {
      const wrapper = renderModal();
      expect(wrapper.isVisible()).toEqual(false);
    });
    it('hides the modal when visible is false', () => {
      const wrapper = renderModal({ visible: false });
      expect(wrapper.isVisible()).toEqual(false);
    });
    it('shows the modal when visible is true', () => {
      const wrapper = renderModal({ visible: true });
      expect(wrapper.getElement()).toBeVisible();
      expect(wrapper.isVisible()).toEqual(true);
    });
    it('calls onDismiss when the dismiss button is clicked', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ onDismiss: onDismissSpy });
      wrapper.findDismissButton().click();
      expect(onDismissSpy).toHaveBeenCalled();
    });
  });

  describe('no paddings', () => {
    it('renders content without paddings', () => {
      const wrapper = renderModal({ disableContentPaddings: true });
      expect(wrapper.findContent().getElement()).toHaveClass(styles['no-paddings']);
    });

    it('renders content paddings by default', () => {
      const wrapper = renderModal();
      expect(wrapper.findContent().getElement()).not.toHaveClass(styles['no-paddings']);
    });
  });

  describe('size property', () => {
    it('displays correct size', () => {
      (['small', 'medium', 'large', 'max'] as ModalProps.Size[]).forEach(size => {
        const wrapper = renderModal({ size });
        expect(wrapper.findDialog().getElement()).toHaveClass(styles[size]);
      });
    });
  });

  describe('dismiss on click', () => {
    it('closes the dialog when clicked on the overlay section of the container', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ onDismiss: onDismissSpy, visible: true });

      wrapper.findDismissButton().click();
      expect(onDismissSpy).toHaveBeenCalled();
    });

    it('stays open when the dialog is clicked', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ onDismiss: onDismissSpy, visible: true });

      wrapper.findDialog().click();
      expect(onDismissSpy).not.toHaveBeenCalled();
    });

    it('stays open when the click begins in the dialog but it is released outside', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ onDismiss: onDismissSpy, visible: true });

      expect(wrapper.getElement()).toBeVisible();
      fireEvent.mouseDown(wrapper.getElement());
      fireEvent.click(wrapper.findDialog().getElement());
      expect(onDismissSpy).not.toHaveBeenCalled();
    });
  });

  describe('focus behavior', () => {
    it('focuses first focusable element after render', () => {
      const wrapper = renderModal({ visible: true });
      expect(document.activeElement).toBe(wrapper.findDismissButton().getElement());
    });

    it('restores focus to previous element on unmount', async () => {
      const textfield = document.createElement('input');
      textfield.type = 'text';
      document.body.appendChild(textfield);

      textfield.focus();
      expect(document.activeElement).toBe(textfield);

      const { rerender } = render(<Modal onDismiss={() => null} visible={true} />);
      expect(document.activeElement).not.toBe(textfield);

      rerender(<></>);
      // react-focus-lock returns focus asyncronousy as Promise.resolve().then(() => element.focus())
      // so need to wait before checking the active element.
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(document.activeElement).toBe(textfield);
    });
  });

  describe('ESC key behavior', () => {
    it('dismisses modal when visible', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ visible: true, onDismiss: onDismissSpy });
      act(() => {
        wrapper.findDialog().keydown(KeyCode.escape);
      });
      expect(onDismissSpy).toHaveBeenCalled();
    });
    it('dismisses modal when focus is on child element', () => {
      let textFieldRef: HTMLInputElement | null = null;

      const onDismissSpy = jest.fn();

      const textfield = <input ref={input => (textFieldRef = input)} />;
      renderModal({ visible: true, onDismiss: onDismissSpy, children: textfield });

      act(() => {
        textFieldRef!.focus();
        createWrapper(textFieldRef!).keydown(KeyCode.escape);
      });

      expect(onDismissSpy).toHaveBeenCalled();
    });
  });

  describe('Dismiss event', () => {
    it('informs about dismiss by clicking overlay', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ visible: true, onDismiss: onDismissSpy });
      fireEvent.mouseDown(wrapper.getElement());
      fireEvent.click(wrapper.getElement());
      expect(onDismissSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'overlay' } }));
    });

    it('informs about dismiss by pressing ESC', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ visible: true, onDismiss: onDismissSpy });
      act(() => wrapper.findDialog().keydown(KeyCode.escape));
      expect(onDismissSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'keyboard' } }));
    });

    it('informs about dismiss by clicking close button', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderModal({ visible: true, onDismiss: onDismissSpy });
      wrapper.findDismissButton().click();
      expect(onDismissSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { reason: 'closeButton' } }));
    });
  });

  describe('Tab traps', () => {
    it('exists', () => {
      const wrapper = renderModal({ visible: true });
      expect(wrapper.findFocusLock()).not.toBeNull();
    });
  });

  describe('Scroll position on reopening', () => {
    it('resets scroll position on default modal', () => {
      // Phantomjs doesn't understand calc() value that we use, so there is a mock // FIXME is this still required?

      const content = <div style={{ height: 3000 }} />;

      const modalRoot = document.createElement('div');
      document.body.appendChild(modalRoot);
      const { container, rerender } = render(
        <Modal onDismiss={() => null} visible={true} modalRoot={modalRoot}>
          {content}
        </Modal>,
        {
          container: modalRoot,
        }
      );
      const wrapper = createWrapper(container).findModal()!;

      wrapper.getElement().style.maxHeight = '500px';
      wrapper.getElement().scrollTop = 100;

      rerender(
        <Modal onDismiss={() => null} visible={false} modalRoot={modalRoot}>
          {content}
        </Modal>
      );
      rerender(
        <Modal onDismiss={() => null} visible={true} modalRoot={modalRoot}>
          {content}
        </Modal>
      );

      expect(wrapper.getElement().scrollTop).toBe(0);
    });

    describe('Close label property', () => {
      it('does not pass the label to the close button if not defined', () => {
        const wrapper = renderModal({ visible: true });
        expect(wrapper.findDismissButton().getElement().getAttribute('aria-label')).toBe(null);
      });

      it('passes the label to the close button if defined', () => {
        const wrapper = renderModal({ visible: true, closeAriaLabel: 'Close' });
        expect(wrapper.findDismissButton().getElement().getAttribute('aria-label')).toBe('Close');
      });
    });
  });

  describe('disable body scroll behavior', () => {
    // const getBodyComputedStyle = () => window.getComputedStyle(document.body);

    it('disables body scroll when modal is initially visible', () => {
      renderModal({ visible: true });
      expect(document.body).toHaveClass(styles['modal-open']);
    });

    it('sets overflow:hidden on document body based on visible property', () => {
      const { rerender } = render(<Modal onDismiss={() => null} visible={false} />);
      expect(document.body).not.toHaveClass(styles['modal-open']);

      rerender(<Modal onDismiss={() => null} visible={true} />);
      expect(document.body).toHaveClass(styles['modal-open']);

      rerender(<Modal onDismiss={() => null} visible={false} />);
      expect(document.body).not.toHaveClass(styles['modal-open']);
    });

    it('adjusts body padding to avoid resizing due to removed scroll bar', () => {
      const tallElement = document.createElement('div');
      tallElement.style.height = '100000px';
      tallElement.innerText = 'some content text';
      document.body.appendChild(tallElement);

      const getBodyPaddingRightInPixels = () =>
        parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right') || '0', 10);
      const hasBodyScrollbar = () => 0 < document.body.clientWidth && document.body.clientWidth < window.innerWidth;

      const initialBodyPaddingRight = getBodyPaddingRightInPixels();

      // JsDOM does not appear to render elements in document body, so skip test in this case
      // This test passes in other browsers (e.g. Firefox, Chrome).  Screenshot tests may be a
      // better solution for testing scrollbar padding behavior.
      if (hasBodyScrollbar()) {
        const { rerender } = render(<Modal onDismiss={() => null} visible={true} />);

        expect(getBodyPaddingRightInPixels()).toBeGreaterThan(initialBodyPaddingRight);
        expect(document.body).toHaveClass(styles['modal-open']);

        rerender(<Modal onDismiss={() => null} visible={false} />);
        expect(getBodyPaddingRightInPixels()).toBe(initialBodyPaddingRight);
        expect(document.body).not.toHaveClass(styles['modal-open']);
      } else {
        console.info('[skipped] Verification of document.body padding-right adjustments for scrollbar');
      }

      document.body.removeChild(tallElement);
    });

    it('cleans up document body state at attach and detach lifecycle events', () => {
      const { unmount } = render(<Modal onDismiss={() => null} visible={true} />);
      expect(document.body).toHaveClass(styles['modal-open']);

      unmount();
      expect(document.body).not.toHaveClass(styles['modal-open']);
    });
  });
});
