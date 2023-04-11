// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TopNavigationProps } from '../../../lib/components/top-navigation/interfaces';
import { transformUtility } from '../../../lib/components/top-navigation/1.0-beta/parts/overflow-menu';
import { UtilityMenuItem } from '../../../lib/components/top-navigation/parts/overflow-menu/menu-item';
import createWrapper from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { linkRelExpectations, linkTargetExpectations } from '../../__tests__/target-rel-test-helper';

const buttonUtility: TopNavigationProps.ButtonUtility = {
  type: 'button',
  variant: 'link',
  href: '#',
  iconName: 'calendar',
  text: 'Text',
};

const menuUtility: TopNavigationProps.MenuDropdownUtility = {
  type: 'menu-dropdown',
  iconName: 'calendar',
  text: 'Text',
  description: 'Description',
  items: [
    { id: '1', text: 'Option 1' },
    { id: '2', text: 'Option 2' },
  ],
};

describe('TopNavigation Overflow menu', () => {
  it('transforms link button', () => {
    expect(transformUtility(buttonUtility, 0)).toEqual({
      id: '0__',
      text: buttonUtility.text,
      iconName: buttonUtility.iconName,
      href: buttonUtility.href,
    });
  });

  it('transforms primary button', () => {
    expect(transformUtility({ ...buttonUtility, variant: 'primary-button' }, 1)).toEqual({
      id: '1__',
      text: buttonUtility.text,
      iconName: buttonUtility.iconName,
      href: buttonUtility.href,
    });
  });

  it('transforms menu dropdown', () => {
    expect(transformUtility(menuUtility, 2)).toEqual({
      id: '2__',
      text: menuUtility.text,
      iconName: menuUtility.iconName,
      description: menuUtility.description,
      items: [
        { id: '2__1', text: 'Option 1' },
        { id: '2__2', text: 'Option 2' },
      ],
    });
  });

  it('prefers title over text', () => {
    expect(transformUtility({ ...buttonUtility, title: 'Title' }, 0).text).toEqual('Title');
    expect(transformUtility({ ...buttonUtility, variant: 'primary-button', title: 'Title' }, 0).text).toEqual('Title');
    expect(transformUtility({ ...menuUtility, title: 'Title' }, 0).text).toEqual('Title');
  });

  it('falls back to using title as the text', () => {
    expect(transformUtility({ ...menuUtility, title: 'Title', text: undefined }, 3)).toEqual({
      id: '3__',
      text: 'Title',
      iconName: menuUtility.iconName,
      description: menuUtility.description,
      items: [
        { id: '3__1', text: 'Option 1' },
        { id: '3__2', text: 'Option 2' },
      ],
    });
  });
});

describe('UtilityMenuItem', () => {
  test.each(linkTargetExpectations)('"target" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find('a')!;

    expectation
      ? expect(linkWrapper.getElement()).toHaveAttribute('target', expectation)
      : expect(linkWrapper.getElement()).not.toHaveAttribute('target');
  });

  test.each(linkRelExpectations)('"rel" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find('a')!;

    expectation
      ? expect(linkWrapper.getElement()).toHaveAttribute('rel', expectation)
      : expect(linkWrapper.getElement()).not.toHaveAttribute('rel');
  });

  it('fires onClick with empty detail', () => {
    const onClick = jest.fn();
    const { container } = render(<UtilityMenuItem type="button" index={0} href="#" onClick={onClick} />);
    const linkWrapper = createWrapper(container).find('a')!;
    linkWrapper.click();

    expect(onClick).toBeCalledWith(expect.objectContaining({ detail: {} }));
  });
});
