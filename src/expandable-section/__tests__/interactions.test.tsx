// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import Button from '../../../lib/components/button';
import Link from '../../../lib/components/link';

function renderExpandableSection(props: ExpandableSectionProps = {}): ExpandableSectionWrapper {
  const { container } = render(<ExpandableSection {...props} />);
  return createWrapper(container).findExpandableSection()!;
}
describe('Expandable Section - Interactions', () => {
  describe('click and keyup event handler', () => {
    let wrapper: ExpandableSectionWrapper;
    let onChangeSpy: jest.Mock;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      wrapper = renderExpandableSection({ onChange: onChangeSpy });
    });
    test('toggles from false to true when header is clicked, change event fires', () => {
      wrapper.findExpandButton().click();
      expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });
    test('toggles from false to true when header receives "Enter" keyboard input, change event fires', () => {
      wrapper.findExpandButton().keyup(KeyCode.enter);
      expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });
    test('toggles from false to true when header receives "Space" keyboard input, change event fires', () => {
      wrapper.findExpandButton().keyup(KeyCode.space);
      expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });

    describe('when already expanded', () => {
      let wrapper: ExpandableSectionWrapper;
      let onChangeSpy: jest.Mock;

      beforeEach(() => {
        onChangeSpy = jest.fn();
        wrapper = renderExpandableSection({ expanded: true, onChange: onChangeSpy });
      });
      test('toggles from true to false when header is clicked, change event fires', () => {
        wrapper.findExpandButton().click();
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
      test('toggles from true to false when header receives "Enter" keyboard input, change event fires', () => {
        wrapper.findExpandButton().keyup(KeyCode.enter);
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
      test('toggles from true to false when header receives "Space" keyboard input, change event fires', () => {
        wrapper.findExpandButton().keyup(KeyCode.space);
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
    });
  });

  describe('Custom interactive elements in the header do not interfere with the expand/collapse functionality', () => {
    let wrapper: ExpandableSectionWrapper;
    let onChangeSpy: jest.Mock;
    let onLinkClickSpy: jest.Mock;
    let onButtonClickSpy: jest.Mock;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      onLinkClickSpy = jest.fn();
      onButtonClickSpy = jest.fn();
      wrapper = renderExpandableSection({
        expanded: true,
        onChange: onChangeSpy,
        headerText: 'Header text',
        headerInfo: <Link onFollow={onLinkClickSpy}>Info</Link>,
        headerActions: <Button onClick={onButtonClickSpy}>Action</Button>,
        variant: 'container',
      });
    });

    test('when clicking on an info link', () => {
      wrapper.findHeader().findLink()!.click();
      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onLinkClickSpy).toHaveBeenCalledTimes(1);
      expect(onButtonClickSpy).not.toHaveBeenCalled();
    });
    test('when clicking on an action button', () => {
      wrapper.findHeader().findButton()!.click();
      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onLinkClickSpy).not.toHaveBeenCalled();
      expect(onButtonClickSpy).toHaveBeenCalledTimes(1);
    });
    test('when typing "Enter" on an interactive element', () => {
      wrapper = renderExpandableSection({
        expanded: true,
        onChange: onChangeSpy,
        headerText: 'Header text',
        headerActions: <button onKeyUp={onButtonClickSpy}>Action</button>,
        variant: 'container',
      });
      wrapper.findHeader().find('button')!.keyup(KeyCode.enter);
      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onButtonClickSpy).toHaveBeenCalledTimes(1);
    });
    test('when typing "Space" on an interactive element', () => {
      wrapper = renderExpandableSection({
        expanded: true,
        onChange: onChangeSpy,
        headerText: 'Header text',
        headerActions: <button onKeyUp={onButtonClickSpy}>Action</button>,
        variant: 'container',
      });
      wrapper.findHeader().find('button')!.keyup(KeyCode.enter);
      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onButtonClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
