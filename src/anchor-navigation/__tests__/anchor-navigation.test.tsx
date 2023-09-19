// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import AnchorNavigation, { AnchorNavigationProps } from '../../../lib/components/anchor-navigation';
import { AnchorNavigationWrapper } from '../../../lib/components/test-utils/dom';

function renderAnchorNavigation(props: AnchorNavigationProps) {
  const { container } = render(<AnchorNavigation {...props} />);
  return new AnchorNavigationWrapper(container);
}

describe('AnchorNavigation', () => {
  it('renders the anchor navigation list', () => {
    const wrapper = renderAnchorNavigation({ anchors: [] });
    expect(wrapper.findAnchorNavigation()).toBeTruthy();
    expect(wrapper.findAnchorNavigationList()).toBeTruthy();
  });

  it('finds multiple anchors', () => {
    const wrapper = renderAnchorNavigation({
      anchors: [
        { text: 'Section 1', href: '#section1', level: 1 },
        { text: 'Section 2', href: '#section2', level: 1 },
      ],
    });
    const anchors = wrapper.findAnchors();
    expect(anchors.length).toEqual(2);
  });

  it('finds anchor by index', () => {
    const wrapper = renderAnchorNavigation({
      anchors: [
        { text: 'Section 1', href: '#section1', level: 1 },
        { text: 'Section 2', href: '#section2', level: 1 },
      ],
    });
    expect(wrapper.findAnchorByIndex(0)!.findText()!.getElement()).toHaveTextContent('Section 1');
  });

  it('finds anchor by href', () => {
    const wrapper = renderAnchorNavigation({
      anchors: [
        { text: 'Section 1', href: '#section1', level: 1 },
        { text: 'Section 2', href: '#section2', level: 1 },
      ],
    });
    const anchor = wrapper.findAnchorLinkByHref('#section2');
    expect(anchor!.getElement()).toHaveAttribute('href', '#section2');
  });

  it('finds anchor info', () => {
    const wrapper = renderAnchorNavigation({
      anchors: [
        { text: 'Section 1', href: '#section1', level: 1, info: 'New' },
        { text: 'Section 2', href: '#section2', level: 1, info: 'Updated' },
      ],
    });
    expect(wrapper.findAnchorByIndex(0)!.findInfo()!.getElement()).toHaveTextContent('New');
  });

  it('applies aria-labelledby correctly', () => {
    const wrapper = renderAnchorNavigation({
      anchors: [],
      ariaLabelledby: 'some-id',
    });

    expect(wrapper.findAnchorNavigation()!.getElement()).toHaveAttribute('aria-labelledby', 'some-id');
  });

  it('calls onFollow when an anchor is clicked', () => {
    const onFollow = jest.fn();

    const wrapper = renderAnchorNavigation({
      anchors: [{ text: 'Section 1', href: '#section1', level: 1 }],
      onFollow,
    });
    wrapper.findAnchorLinkByHref('#section1')?.getElement().click();
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow).toHaveBeenCalledWith({
      cancelBubble: false,
      cancelable: true,
      defaultPrevented: false,
      detail: { text: 'Section 1', href: '#section1', level: 1 },
    });
  });
});
