// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';

import testStyles from '../../../lib/components/side-navigation/test-classes/styles.css.js';

function renderSideNavigation(props: SideNavigationProps = {}) {
  const { container } = render(<SideNavigation {...props} />);
  return createWrapper(container).findSideNavigation()!;
}

const iconLink = (text: string, href: string): SideNavigationProps.Link => ({
  type: 'link',
  text,
  href,
  icon: <Icon name="settings" />,
});

const plainLink = (text: string, href: string): SideNavigationProps.Link => ({
  type: 'link',
  text,
  href,
});

describe('SideNavigation collapsed mode', () => {
  describe('item filtering', () => {
    it('hides items without icons', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [plainLink('No icon', '#/no-icon'), iconLink('Has icon', '#/has-icon')],
      });
      expect(wrapper.findAll('a')).toHaveLength(1);
      expect(wrapper.findLinkByHref('#/has-icon')).not.toBeNull();
    });

    it('renders icon inside collapsed link', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'link',
            text: 'Has icon',
            href: '#/has-icon',
            icon: <span data-testid="custom-icon" />,
          },
        ],
      });
      const iconWrapper = wrapper.findItemByIndex(1)?.find(`.${testStyles['item-icon']}`);
      expect(iconWrapper).not.toBeNull();
      expect(iconWrapper?.getElement().querySelector('[data-testid="custom-icon"]')).not.toBeNull();
    });

    it('does not hide dividers', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Link 1', '#/1'), { type: 'divider' }, iconLink('Link 2', '#/2')],
      });
      expect(wrapper.findAll('a')).toHaveLength(2);
      expect(wrapper.findItemByIndex(2)?.findDivider()).not.toBeNull();
    });

    it('removes consecutive dividers when collapsed segments are empty', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          iconLink('Link 1', '#/1'),
          { type: 'divider' },
          plainLink('No icon 1', '#/no1'),
          { type: 'divider' },
          iconLink('Link 2', '#/2'),
        ],
      });
      // Only one divider survives — the middle segment is empty so one is deduplicated.
      expect(wrapper.findItemByIndex(2)?.findDivider()).not.toBeNull();
      expect(wrapper.findAll('hr')).toHaveLength(1);
    });

    it('removes trailing dividers', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Link 1', '#/1'), { type: 'divider' }],
      });
      expect(wrapper.findAll('hr')).toHaveLength(0);
    });
  });

  describe('sections and section groups', () => {
    it.each([
      {
        label: 'section',
        items: [
          {
            type: 'section' as const,
            text: 'Resources',
            items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage'), plainLink('No icon', '#/none')],
          },
        ],
        iconHrefs: ['#/compute', '#/storage'],
        hiddenHref: '#/none',
        ariaLabel: 'Resources',
      },
      {
        label: 'section-group',
        items: [
          {
            type: 'section-group' as const,
            title: 'My Group',
            items: [iconLink('Item A', '#/a'), iconLink('Item B', '#/b'), plainLink('No icon', '#/none')],
          },
        ],
        iconHrefs: ['#/a', '#/b'],
        hiddenHref: '#/none',
        ariaLabel: 'My Group',
      },
    ])('flattens $label children with icons and applies aria-label', ({ items, iconHrefs, hiddenHref, ariaLabel }) => {
      const wrapper = renderSideNavigation({ collapsed: true, items });
      iconHrefs.forEach(href => expect(wrapper.findLinkByHref(href)).not.toBeNull());
      expect(wrapper.findLinkByHref(hiddenHref)).toBeNull();
      expect(wrapper.find(`ul[aria-label="${ariaLabel}"]`)).not.toBeNull();
    });

    it.each([
      {
        label: 'section',
        items: [{ type: 'section' as const, text: 'Empty', items: [plainLink('A', '#/a'), plainLink('B', '#/b')] }],
      },
      {
        label: 'section-group',
        items: [{ type: 'section-group' as const, title: 'Empty', items: [plainLink('A', '#/a')] }],
      },
    ])('does not render $label if no children have icons', ({ items }) => {
      const wrapper = renderSideNavigation({ collapsed: true, items });
      expect(wrapper.findAll('a')).toHaveLength(0);
    });

    it('renders a divider in place of the section title when collapsed', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          iconLink('Top', '#/top'),
          {
            type: 'section',
            text: 'Resources',
            items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage')],
          },
        ],
      });
      expect(wrapper.findAll('hr')).toHaveLength(1);
      expect(wrapper.find('ul[aria-label="Resources"]')).not.toBeNull();
    });

    it('does not render a section divider when the section has no icon-bearing children', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Top', '#/top'), { type: 'section', text: 'Empty', items: [plainLink('A', '#/a')] }],
      });
      expect(wrapper.findAll('hr')).toHaveLength(0);
    });
  });

  describe('expandable link groups', () => {
    it('renders as a single link in collapsed mode', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'expandable-link-group',
            text: 'Monitoring',
            href: '#/monitoring',
            icon: <Icon name="bug" />,
            items: [iconLink('Alarms', '#/alarms'), iconLink('Logs', '#/logs')],
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/monitoring')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/alarms')).toBeNull();
    });

    it('flattens children with icons when ELG itself has no icon', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'expandable-link-group',
            text: 'No Icon ELG',
            href: '#/elg',
            items: [iconLink('Child', '#/child')],
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/child')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/elg')).toBeNull();
    });
  });

  describe('link groups', () => {
    it('renders as a single link without children in collapsed mode', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'link-group',
            text: 'Group',
            href: '#/group',
            icon: <Icon name="folder" />,
            items: [iconLink('Child 1', '#/c1'), iconLink('Child 2', '#/c2')],
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/group')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/c1')).toBeNull();
    });
  });

  describe('header', () => {
    it('does not render header when collapsed without logo', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        header: { href: '#/', text: 'Service name' },
        items: [iconLink('Page', '#/page')],
      });
      expect(wrapper.findHeaderLink()).toBeNull();
    });
  });

  describe('active state', () => {
    it('marks active link in collapsed mode', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        activeHref: '#/has-icon',
        items: [iconLink('Has icon', '#/has-icon')],
      });
      expect(wrapper.findActiveLink()?.getElement()).toHaveAttribute('href', '#/has-icon');
    });
  });

  describe('defaults', () => {
    it('is not collapsed by default', () => {
      const wrapper = renderSideNavigation({ items: [plainLink('Visible text', '#/link')] });
      expect(wrapper.findLinkByHref('#/link')?.getElement().textContent).toContain('Visible text');
    });

    it('hides itemsControl when collapsed', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Page', '#/page')],
        itemsControl: <input data-testid="control" />,
      });
      expect(wrapper.findItemsControl()).toBeNull();
    });

    it('shows itemsControl when not collapsed', () => {
      const wrapper = renderSideNavigation({
        items: [plainLink('Page', '#/page')],
        itemsControl: <input data-testid="control" />,
      });
      expect(wrapper.findItemsControl()).not.toBeNull();
    });
  });

  describe('header logo', () => {
    it('hides header with img logo when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          header={{ href: '#/', text: 'Service', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[iconLink('Page', '#/page')]}
        />
      );
      expect(container.querySelector('img')).toBeNull();
    });

    it('hides header with SVG logo when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          header={{ href: '#/', text: 'Service', logo: { svg: <svg data-testid="svg-logo" /> } }}
          items={[iconLink('Page', '#/page')]}
        />
      );
      expect(container.querySelector('[data-testid="svg-logo"]')).toBeNull();
    });

    it('stretches SVG logo when no text is provided', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', logo: { svg: <svg data-testid="svg-logo" /> } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      expect(container.querySelector('[data-testid="svg-logo"]')!.parentElement!.className).toContain(
        'header-logo--stretched'
      );
    });

    it('stretches img logo when no text is provided', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      expect(container.querySelector('img')!.className).toContain('header-logo--stretched');
    });

    it('does not stretch logo when text is provided and not collapsed', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', text: 'Service', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      expect(container.querySelector('img')!.className).not.toContain('header-logo--stretched');
    });
  });

  describe('tooltip on collapsed items', () => {
    it('shows and hides tooltip on focus/blur of a collapsed link', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Dashboard', '#/dashboard')],
      });
      const link = wrapper.findLinkByHref('#/dashboard')!.getElement();
      expect(createWrapper().findTooltip()).toBeNull();
      fireEvent.focus(link);
      expect(createWrapper().findTooltip()).not.toBeNull();
      fireEvent.blur(link);
      expect(createWrapper().findTooltip()).toBeNull();
    });

    it('shows and hides tooltip on mouseenter/mouseleave of a collapsed link', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Dashboard', '#/dashboard')],
      });
      const link = wrapper.findLinkByHref('#/dashboard')!.getElement();
      expect(createWrapper().findTooltip()).toBeNull();
      fireEvent.mouseEnter(link);
      expect(createWrapper().findTooltip()).not.toBeNull();
      fireEvent.mouseLeave(link);
      expect(createWrapper().findTooltip()).toBeNull();
    });
  });
});
