// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import Button from '../../../lib/components/button';
import ButtonDropdown from '../../../lib/components/button-dropdown';
import Checkbox from '../../../lib/components/checkbox';
import Link from '../../../lib/components/link';
import NavigableGroup, { NavigableGroupProps } from '../../../lib/components/navigable-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import ToggleButton from '../../../lib/components/toggle-button';

function renderNavigableGroup(props: Partial<NavigableGroupProps> = {}) {
  const ref = React.createRef<NavigableGroupProps.Ref>();
  const blurRef = React.createRef<HTMLButtonElement>();
  const children = (
    <>
      <Button id="button1">Button 1</Button>
      <Button id="button2">Button 2</Button>
      <Button id="button3">Button 3</Button>
    </>
  );

  const renderResult = render(
    <>
      <button ref={blurRef}>other focusable</button>
      <NavigableGroup getItemKey={element => element.id} ref={ref} {...props}>
        {props.children ?? children}
      </NavigableGroup>
    </>
  );

  return { ...renderResult, ref, blurRef, wrapper: createWrapper(renderResult.container).findNavigableGroup()! };
}

function renderNavigableGroupWithDisabledElements(allDisabled = false, ref?: React.Ref<NavigableGroupProps.Ref>) {
  const children = (
    <>
      <Button id="button1" disabled={allDisabled}>
        Button 1
      </Button>
      <Button id="button2" disabled={true}>
        Button 2
      </Button>
      <Button id="button3" disabled={allDisabled}>
        Button 3
      </Button>
    </>
  );

  const renderResult = render(
    <NavigableGroup getItemKey={element => element.id} ref={ref}>
      {children}
    </NavigableGroup>
  );

  return { ...renderResult, wrapper: createWrapper(renderResult.container).findNavigableGroup()! };
}

function renderNavigableGroupWithMixedElements(props: Partial<NavigableGroupProps> = {}) {
  const children = (
    <>
      <Button id="button1">Save</Button>
      <ButtonDropdown id="dropdown1" items={[{ id: 'item1', text: 'Item 1' }]}>
        Actions
      </ButtonDropdown>
      <Checkbox id="checkbox1" checked={false}>
        Check me
      </Checkbox>
      <ToggleButton pressed={false} id="toggle">
        Toggle
      </ToggleButton>
      <Link id="link1" href="#">
        Link
      </Link>
    </>
  );

  const renderResult = render(
    <NavigableGroup getItemKey={element => element.id} {...props}>
      {children}
    </NavigableGroup>
  );

  return { ...renderResult, wrapper: createWrapper(renderResult.container).findNavigableGroup()! };
}

describe('NavigableGroup', () => {
  describe('Basic rendering', () => {
    test('renders children', () => {
      const { wrapper } = renderNavigableGroup();

      expect(wrapper.findContent().findAllButtons().length).toBe(3);
    });
  });

  describe('Keyboard navigation', () => {
    describe('Horizontal direction (default)', () => {
      test('navigates right with ArrowRight key', () => {
        const { wrapper } = renderNavigableGroup();

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button2 = wrapper.findContent().findAllButtons()[1];

        button1.focus();
        button1.keydown(KeyCode.right);

        expect(button2.getElement()).toHaveFocus();
      });

      test('navigates left with ArrowLeft key', () => {
        const { wrapper } = renderNavigableGroup();

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button2 = wrapper.findContent().findAllButtons()[1];

        button2.focus();
        button2.keydown(KeyCode.left);

        expect(button1.getElement()).toHaveFocus();
      });

      test('does not navigate with ArrowUp/ArrowDown keys in horizontal mode', () => {
        const { wrapper } = renderNavigableGroup();

        const button2 = wrapper.findContent().findAllButtons()[1];

        button2.focus();
        button2.keydown(KeyCode.down);
        expect(button2.getElement()).toHaveFocus();
        button2.keydown(KeyCode.up);
        expect(button2.getElement()).toHaveFocus();
      });
    });

    describe('Vertical direction', () => {
      test('navigates down with ArrowDown key', () => {
        const { wrapper } = renderNavigableGroup({ navigationDirection: 'vertical' });

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button2 = wrapper.findContent().findAllButtons()[1];

        button1.focus();
        button1.keydown(KeyCode.down);

        expect(button2.getElement()).toHaveFocus();
      });

      test('navigates up with ArrowUp key', () => {
        const { wrapper } = renderNavigableGroup({ navigationDirection: 'vertical' });

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button2 = wrapper.findContent().findAllButtons()[1];

        button2.focus();
        button2.keydown(KeyCode.up);

        expect(button1.getElement()).toHaveFocus();
      });

      test('does not navigate with ArrowLeft/ArrowRight keys in vertical mode', () => {
        const { wrapper } = renderNavigableGroup({ navigationDirection: 'vertical' });

        const button2 = wrapper.findContent().findAllButtons()[1];

        button2.focus();
        button2.keydown(KeyCode.left);
        expect(button2.getElement()).toHaveFocus();
        button2.keydown(KeyCode.right);
        expect(button2.getElement()).toHaveFocus();
      });
    });

    describe('Both directions', () => {
      test('navigates with all arrow keys when direction is "both"', () => {
        const { wrapper } = renderNavigableGroup({ navigationDirection: 'both' });

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button2 = wrapper.findContent().findAllButtons()[1];
        const button3 = wrapper.findContent().findAllButtons()[2];

        button2.focus();
        button2.keydown(KeyCode.up);
        expect(button1.getElement()).toHaveFocus();
        button1.keydown(KeyCode.down);
        expect(button2.getElement()).toHaveFocus();
        button2.keydown(KeyCode.right);
        expect(button3.getElement()).toHaveFocus();
        button3.keydown(KeyCode.left);
        expect(button2.getElement()).toHaveFocus();
      });
    });

    describe('Home and End keys', () => {
      test('navigates to last item with end key', () => {
        const { wrapper } = renderNavigableGroup();

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button3 = wrapper.findContent().findAllButtons()[2];

        button1.focus();
        button1.keydown(KeyCode.end);
        expect(button3.getElement()).toHaveFocus();
      });

      test('navigates to first item with home key', () => {
        const { wrapper } = renderNavigableGroup();

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button3 = wrapper.findContent().findAllButtons()[2];

        button3.focus();
        button3.keydown(KeyCode.home);
        expect(button1.getElement()).toHaveFocus();
      });
    });

    test('loops focus', () => {
      const { wrapper } = renderNavigableGroup();

      const button1 = wrapper.findContent().findAllButtons()[0];
      const button3 = wrapper.findContent().findAllButtons()[2];

      button3.focus();
      button3.keydown(KeyCode.right);
      expect(button1.getElement()).toHaveFocus();
      button1.keydown(KeyCode.left);
      expect(button3.getElement()).toHaveFocus();
    });

    test('works with custom getItemKey function', () => {
      const { container } = render(
        <NavigableGroup getItemKey={element => element.getAttribute('data-custom-id')!}>
          <Button data-custom-id="custom1">Button 1</Button>
          <Button data-custom-id="custom2">Button 2</Button>
        </NavigableGroup>
      );
      const wrapper = createWrapper(container).findNavigableGroup()!;

      const button1 = wrapper.findContent().findAllButtons()[0];
      const button2 = wrapper.findContent().findAllButtons()[1];

      button1.focus();
      button1.keydown(KeyCode.right);

      expect(button2.getElement()).toHaveFocus();
    });

    describe('Focus management', () => {
      test('focuses first element when focus() is called on ref', () => {
        const { wrapper, ref } = renderNavigableGroup();

        const button1 = wrapper.findContent().findAllButtons()[0];
        ref.current!.focus();

        expect(button1.getElement()).toHaveFocus();
      });

      test('focuses previously focused element when focus() is called', () => {
        const { wrapper, ref, blurRef } = renderNavigableGroup();

        const button3 = wrapper.findContent().findAllButtons()[2];

        button3.focus();
        blurRef.current!.focus();
        expect(button3.getElement()).not.toHaveFocus();
        ref.current!.focus();
        expect(button3.getElement()).toHaveFocus();
      });
    });

    describe('Disabled elements', () => {
      test('skips disabled buttons during navigation', () => {
        const { wrapper } = renderNavigableGroupWithDisabledElements();

        const button1 = wrapper.findContent().findAllButtons()[0];
        const button3 = wrapper.findContent().findAllButtons()[2];

        button1.focus();
        button1.keydown(KeyCode.right);

        expect(button3.getElement()).toHaveFocus();
      });
      test('skips entirely if all elements disabled', () => {
        const ref: { current: NavigableGroupProps.Ref | null } = { current: null };
        renderNavigableGroupWithDisabledElements(true, ref);
        ref.current!.focus();
        expect(document.body).toHaveFocus();
      });
    });

    describe('non-supported children', () => {
      it('handles plain buttons without errors', () => {
        const { container } = renderNavigableGroup({
          children: [
            <button key="1" id="one">
              Button 1
            </button>,
          ],
        });
        const button = container.querySelector('#one')! as HTMLButtonElement;
        button.focus();
        fireEvent.keyDown(button, { keyCode: KeyCode.right });
        expect(button).toHaveFocus();
      });
    });

    describe('Mixed element types', () => {
      test('navigates between different types of focusable elements', () => {
        const { wrapper } = renderNavigableGroupWithMixedElements();

        const saveButton = wrapper.findContent().findButton()!;
        const actionsDropdown = wrapper.findContent().findButtonDropdown()!.findTriggerButton()!;
        const checkbox = wrapper.findContent().findCheckbox()!.findNativeInput();
        const toggle = wrapper.findContent().findToggleButton('#toggle')!;
        const link = wrapper.findContent().findLink()!;

        saveButton.focus();
        saveButton.keydown(KeyCode.right);
        expect(actionsDropdown.getElement()).toHaveFocus();

        actionsDropdown.keydown(KeyCode.right);
        expect(checkbox.getElement()).toHaveFocus();

        checkbox.keydown(KeyCode.right);
        expect(toggle.getElement()).toHaveFocus();

        toggle.keydown(KeyCode.right);
        expect(link.getElement()).toHaveFocus();
      });
    });
  });
});
