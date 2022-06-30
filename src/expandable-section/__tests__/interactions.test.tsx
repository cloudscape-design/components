// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';

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
      wrapper.findHeader().click();
      expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });
    test('toggles from false to true when header receives "Enter" keyboard input, change event fires', () => {
      wrapper.findHeader().keyup(KeyCode.enter);
      expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });
    test('toggles from false to true when header receives "Space" keyboard input, change event fires', () => {
      wrapper.findHeader().keyup(KeyCode.space);
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
        wrapper.findHeader().click();
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
      test('toggles from true to false when header receives "Enter" keyboard input, change event fires', () => {
        wrapper.findHeader().keyup(KeyCode.enter);
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
      test('toggles from true to false when header receives "Space" keyboard input, change event fires', () => {
        wrapper.findHeader().keyup(KeyCode.space);
        expect(onChangeSpy).toBeCalledWith(expect.objectContaining({ detail: { expanded: false } }));
      });
    });
  });
});
