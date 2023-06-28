// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TopNavigationProps } from '../../../lib/components/top-navigation/interfaces';
import { transformUtility } from '../../../lib/components/top-navigation/1.0-beta/parts/overflow-menu';
import { UtilityMenuItem } from '../../../lib/components/top-navigation/parts/overflow-menu/menu-item';
import UtilitiesView from '../../../lib/components/top-navigation/parts/overflow-menu/views/utilities';
import SubmenuView from '../../../lib/components/top-navigation/parts/overflow-menu/views/submenu';
import createWrapper from '../../../lib/components/test-utils/dom';
import { act, render } from '@testing-library/react';
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

describe('Submenu', () => {
  test('onFollow event is fired when an href is set', () => {
    const onFollow = jest.fn();
    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            onItemFollow: onFollow,
            items: [{ id: 'one', text: 'One', href: 'https://example.com' }],
          }}
        />
      ).container
    ).find('a')!;

    act(() => wrapper.click());
    expect(onFollow).toBeCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onFollow).toBeCalledTimes(1);
  });

  test('onFollow event is not fired when an href is not set', () => {
    const onFollow = jest.fn();
    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            onItemFollow: onFollow,
            items: [{ id: 'one', text: 'One' }],
          }}
        />
      ).container
    ).find('a')!;

    act(() => wrapper.click());
    expect(onFollow).toBeCalledTimes(0);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onFollow).toBeCalledTimes(0);
  });

  test('onClick is fired on every click when an href is set', () => {
    const onClick = jest.fn();

    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            onItemClick: onClick,
            items: [{ id: 'one', text: 'One', href: 'https://example.com' }],
          }}
        />
      ).container
    ).find('a')!;

    act(() => wrapper.click());
    expect(onClick).toBeCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onClick).toBeCalledTimes(2);
  });

  test('onClick is fired on every click when an href is not set', () => {
    const onClick = jest.fn();

    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            onItemClick: onClick,
            items: [{ id: 'one', text: 'One' }],
          }}
        />
      ).container
    ).find('a')!;

    act(() => wrapper.click());
    expect(onClick).toBeCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onClick).toBeCalledTimes(2);
  });

  test('onClose is fired when clicking on submenuItem', () => {
    const onClose = jest.fn();

    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            items: [{ id: 'one', text: 'One', href: '#' }],
          }}
          onClose={onClose}
        />
      ).container
    ).find('a')!;

    act(() => wrapper.click());
    expect(onClose).toBeCalledTimes(1);
  });
});

describe('UtilityMenuItem', () => {
  test.each(linkTargetExpectations)('"target" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find(`a, button`)!;

    expectation
      ? expect(linkWrapper.getElement()).toHaveAttribute('target', expectation)
      : expect(linkWrapper.getElement()).not.toHaveAttribute('target');
  });

  test.each(linkRelExpectations)('"rel" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find('a, button')!;

    expectation
      ? expect(linkWrapper.getElement()).toHaveAttribute('rel', expectation)
      : expect(linkWrapper.getElement()).not.toHaveAttribute('rel');
  });

  test.each([undefined, 'link', 'primary-button'] as const)(
    'fires onClick with empty detail for variant %s',
    variant => {
      const onClick = jest.fn();
      const { container } = render(
        <UtilityMenuItem type="button" index={0} href="#" variant={variant} onClick={onClick} />
      );
      const linkWrapper = createWrapper(container).find('a')!;
      linkWrapper.click();

      expect(onClick).toBeCalledWith(expect.objectContaining({ detail: {} }));
    }
  );

  test('onClose is fired when clicking on utilityMenuItem', () => {
    const onClose = jest.fn();

    const wrapper = createWrapper(
      render(
        <UtilitiesView
          items={[
            {
              type: 'button',
              variant: 'primary-button',
              text: 'New Thing',
            },
            {
              type: 'button',
              href: '#',
            },
          ]}
          onClose={onClose}
        />
      ).container
    );

    act(() => wrapper.find('button')!.click());
    expect(onClose).toBeCalledTimes(1);

    act(() => wrapper.find('a')!.click());
    expect(onClose).toBeCalledTimes(2);
  });
});
