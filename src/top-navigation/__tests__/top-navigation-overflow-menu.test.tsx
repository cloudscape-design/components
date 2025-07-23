// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import { UtilityMenuItem } from '../../../lib/components/top-navigation/parts/overflow-menu/menu-item';
import SubmenuView from '../../../lib/components/top-navigation/parts/overflow-menu/views/submenu';
import UtilitiesView from '../../../lib/components/top-navigation/parts/overflow-menu/views/utilities';
import { linkRelExpectations, linkTargetExpectations } from '../../__tests__/target-rel-test-helper';

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
    expect(onFollow).toHaveBeenCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onFollow).toHaveBeenCalledTimes(1);
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
    expect(onFollow).toHaveBeenCalledTimes(0);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onFollow).toHaveBeenCalledTimes(0);
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
    expect(onClick).toHaveBeenCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onClick).toHaveBeenCalledTimes(2);
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
    expect(onClick).toHaveBeenCalledTimes(1);

    act(() => wrapper.click({ ctrlKey: true }));
    expect(onClick).toHaveBeenCalledTimes(2);
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
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders menu items with role `button` if no href provided', () => {
    const wrapper = createWrapper(
      render(
        <SubmenuView
          definition={{
            type: 'menu-dropdown',
            items: [{ id: 'one', text: 'One' }],
          }}
        />
      ).container
    ).find('a')!;
    const element = wrapper.getElement() as HTMLAnchorElement;
    expect(element.getAttribute('role')).toEqual('button');
    expect(element.tabIndex).toEqual(0);
  });
});

describe('UtilityMenuItem', () => {
  test.each(linkTargetExpectations)('"target" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find(`a, button`)!;

    if (expectation) {
      expect(linkWrapper.getElement()).toHaveAttribute('target', expectation);
    } else {
      expect(linkWrapper.getElement()).not.toHaveAttribute('target');
    }
  });

  test.each(linkRelExpectations)('"rel" property %s', (props, expectation) => {
    const { container } = render(<UtilityMenuItem type="button" index={0} {...props} />);
    const linkWrapper = createWrapper(container).find('a, button')!;

    if (expectation) {
      expect(linkWrapper.getElement()).toHaveAttribute('rel', expectation);
    } else {
      expect(linkWrapper.getElement()).not.toHaveAttribute('rel');
    }
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

      expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ detail: {} }));
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
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => wrapper.find('a')!.click());
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
