// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/side-navigation/styles.css.js';
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

    it('renders collapsed section with children mounted and no divider', () => {
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
      expect(wrapper.findAll('hr')).toHaveLength(0);
      expect(wrapper.findLinkByHref('#/compute')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/storage')).not.toBeNull();
    });

    it('does not render a section divider when the section has no icon-bearing children', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Top', '#/top'), { type: 'section', text: 'Empty', items: [plainLink('A', '#/a')] }],
      });
      expect(wrapper.findAll('hr')).toHaveLength(0);
    });

    it('keeps the section expanded when collapsed so children are not height-collapsed', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section',
            text: 'Resources',
            items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage')],
          },
        ],
      });
      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it.each([true, false])(
      'applies the collapsed class to the section-group title only when collapsed=%s',
      collapsed => {
        const wrapper = renderSideNavigation({
          collapsed,
          items: [{ type: 'section-group', title: 'My Group', items: [iconLink('Item A', '#/a')] }],
        });
        const titleEl = wrapper.findItemByIndex(1)?.findSectionGroupTitle()?.getElement();
        expect(titleEl).not.toBeNull();
        expect(titleEl!.classList.contains(styles['section-group-title--collapsed'])).toBe(collapsed);
      }
    );
  });

  describe('expandable link groups', () => {
    it.each([
      { label: 'icon-bearing', items: [iconLink('Alarms', '#/alarms'), iconLink('Logs', '#/logs')] },
      { label: 'icon-less', items: [plainLink('VPC', '#/vpc'), plainLink('Route 53', '#/r53')] },
    ])('keeps $label children mounted so the collapse animation has content to transition', ({ items }) => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'expandable-link-group',
            text: 'Monitoring',
            href: '#/monitoring',
            icon: <Icon name="bug" />,
            items,
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/monitoring')).not.toBeNull();
      items.forEach(item => expect(wrapper.findLinkByHref(item.href)).not.toBeNull());
    });

    it('inerts the expandable-link-group content when collapsed', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'expandable-link-group',
            text: 'Monitoring',
            href: '#/monitoring',
            icon: <Icon name="bug" />,
            items: [iconLink('Alarms', '#/alarms')],
          },
        ],
      });
      const elg = wrapper.findItemByIndex(1)?.findExpandableLinkGroup();
      const contentInner = elg?.findContent().getElement().firstElementChild as HTMLElement;
      expect(contentInner.inert).toBe(true);
    });
  });

  describe('link groups', () => {
    it.each([
      { label: 'icon-bearing', items: [iconLink('Child 1', '#/c1'), iconLink('Child 2', '#/c2')] },
      { label: 'icon-less', items: [plainLink('Lambda', '#/lambda'), plainLink('S3', '#/s3')] },
    ])('keeps $label children mounted but inert when collapsed', ({ items }) => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[{ type: 'link-group', text: 'Group', href: '#/group', icon: <Icon name="folder" />, items }]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/group')).not.toBeNull();
      items.forEach(item => expect(wrapper.findLinkByHref(item.href)).not.toBeNull());
      const firstChildLink = wrapper.findLinkByHref(items[0].href)!.getElement();
      expect(firstChildLink.closest('ul')!.parentElement!.inert).toBe(true);
    });

    it('children are not inert when not collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={false}
          items={[
            {
              type: 'link-group',
              text: 'Group',
              href: '#/group',
              icon: <Icon name="folder" />,
              items: [iconLink('Child 1', '#/c1')],
            },
          ]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      const childLink = wrapper.findLinkByHref('#/c1')!.getElement();
      expect(childLink.closest('ul')!.parentElement!.inert).toBe(false);
    });

    it('applies the collapsed class to the children container for the grid animation', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Group',
              href: '#/group',
              icon: <Icon name="folder" />,
              items: [iconLink('Child 1', '#/c1')],
            },
          ]}
        />
      );
      const childrenContainer = container.querySelector(`.${CSS.escape(styles['link-group-children'])}`);
      expect(childrenContainer!.classList.contains(styles['link-group-children--collapsed'])).toBe(true);
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

  describe('collapsed CSS classes on root list', () => {
    it.each([true, false])('applies the collapsed class to the root list only when collapsed=%s', collapsed => {
      const { container } = render(
        <SideNavigation collapsed={collapsed} items={[iconLink('Dashboard', '#/dashboard')]} />
      );
      const rootUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-root'])}`);
      expect(rootUl!.classList.contains(styles['list-variant-root--collapsed'])).toBe(collapsed);
    });

    it('applies the collapsed class to a section list when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[{ type: 'section', text: 'Resources', items: [iconLink('Compute', '#/compute')] }]}
        />
      );
      const sectionUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-section'])}`);
      expect(sectionUl!.classList.contains(styles['list-variant-section--collapsed'])).toBe(true);
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

    it('shows only one tooltip when one item is focused and another is hovered', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Dashboard', '#/dashboard'), iconLink('Settings', '#/settings')],
      });
      const first = wrapper.findLinkByHref('#/dashboard')!.getElement();
      const second = wrapper.findLinkByHref('#/settings')!.getElement();

      // Keyboard-focus the first item, then move the pointer onto the second.
      fireEvent.focus(first);
      fireEvent.mouseEnter(second);

      // Only the hovered item's tooltip should be visible.
      expect(createWrapper().findAllTooltips().length).toBe(1);
      expect(createWrapper().findTooltip()!.getElement()).toHaveTextContent('Settings');
    });

    it('keeps the newer tooltip when the previously focused item blurs', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Dashboard', '#/dashboard'), iconLink('Settings', '#/settings')],
      });
      const first = wrapper.findLinkByHref('#/dashboard')!.getElement();
      const second = wrapper.findLinkByHref('#/settings')!.getElement();

      fireEvent.focus(first);
      fireEvent.mouseEnter(second);
      // The first item losing focus must not clear the second item's tooltip.
      fireEvent.blur(first);

      expect(createWrapper().findAllTooltips().length).toBe(1);
      expect(createWrapper().findTooltip()!.getElement()).toHaveTextContent('Settings');
    });
  });

  describe('accessibility in collapsed mode', () => {
    describe('hidden items are non-focusable (inert)', () => {
      it.each([true, false])('makes the section header wrapper inert only when collapsed=%s', collapsed => {
        const { container } = render(
          <SideNavigation
            collapsed={collapsed}
            items={[{ type: 'section', text: 'Resources', items: [iconLink('Compute', '#/compute')] }]}
          />
        );
        const headerWrapper = container.querySelector(`.${CSS.escape(styles.section)}`)!.firstElementChild;
        expect((headerWrapper as HTMLElement).inert).toBe(collapsed);
      });

      it.each([
        { label: 'link-group', type: 'link-group' as const },
        { label: 'expandable-link-group', type: 'expandable-link-group' as const },
      ])('makes an icon-less $label parent link inert only when collapsed', ({ type }) => {
        const items = [{ type, text: 'Tools', href: '#/tools', items: [iconLink('Build', '#/build')] }];
        const expanded = renderSideNavigation({ collapsed: false, items });
        const collapsed = renderSideNavigation({ collapsed: true, items });
        expect(expanded.findLinkByHref('#/tools')!.getElement().inert).toBe(false);
        expect(collapsed.findLinkByHref('#/tools')!.getElement().inert).toBe(true);
      });

      it('does not make an icon-bearing link-group parent link inert when collapsed', () => {
        const wrapper = renderSideNavigation({
          collapsed: true,
          items: [
            {
              type: 'link-group',
              text: 'Tools',
              href: '#/tools',
              icon: <Icon name="folder" />,
              items: [iconLink('Build', '#/build')],
            },
          ],
        });
        expect(wrapper.findLinkByHref('#/tools')!.getElement().inert).toBe(false);
      });
    });

    describe('group aria-label preserved and children mounted when collapsed', () => {
      it.each([
        {
          label: 'section',
          items: [
            {
              type: 'section' as const,
              text: 'Resources',
              items: [iconLink('Compute', '#/compute'), plainLink('No icon', '#/none')],
            } as SideNavigationProps.Item,
          ],
          listClass: 'list-variant-section',
          expectedLabel: 'Resources',
          iconHrefs: ['#/compute'],
          hiddenHref: '#/none',
        },
        {
          label: 'section-group',
          items: [
            {
              type: 'section-group' as const,
              title: 'My Group',
              items: [iconLink('Item A', '#/a'), plainLink('No icon', '#/none')],
            } as SideNavigationProps.Item,
          ],
          listClass: 'list-variant-section-group',
          expectedLabel: 'My Group',
          iconHrefs: ['#/a'],
          hiddenHref: '#/none',
        },
        {
          label: 'link-group',
          items: [
            {
              type: 'link-group' as const,
              text: 'Tools',
              href: '#/tools',
              icon: <Icon name="folder" />,
              items: [iconLink('Build', '#/build')],
            } as SideNavigationProps.Item,
          ],
          listClass: 'list-variant-link-group',
          expectedLabel: 'Tools',
          iconHrefs: ['#/build'],
          // link-group children stay mounted even without icons — they're needed for
          // the collapse animation — so there's no hiddenHref case to assert here.
          hiddenHref: undefined,
        },
      ])(
        'adds aria-label to the $label list and keeps icon-bearing children mounted when collapsed',
        ({ items, listClass, expectedLabel, iconHrefs, hiddenHref }) => {
          const expanded = render(<SideNavigation collapsed={false} items={items} />).container;
          const collapsed = renderSideNavigation({ collapsed: true, items });
          expect(expanded.querySelector(`ul.${CSS.escape(styles[listClass])}`)!.getAttribute('aria-label')).toBeNull();
          expect(collapsed.getElement().querySelector(`ul[aria-label="${expectedLabel}"]`)).not.toBeNull();
          // Icon-bearing children remain mounted and visible.
          iconHrefs.forEach(href => expect(collapsed.findLinkByHref(href)).not.toBeNull());
          // Children without icons are hidden, except for link-group/expandable-link-group
          // variants which keep them mounted for the collapse animation (see hiddenHref).
          if (hiddenHref) {
            expect(collapsed.findLinkByHref(hiddenHref)).toBeNull();
          }
        }
      );
    });

    describe('ELG caret hidden from AT when collapsed', () => {
      it.each([true, false])('shows the expand button only when not collapsed (collapsed=%s)', collapsed => {
        const wrapper = renderSideNavigation({
          collapsed,
          items: [
            {
              type: 'expandable-link-group',
              text: 'Monitoring',
              href: '#/monitoring',
              icon: <Icon name="bug" />,
              items: [iconLink('Alarms', '#/alarms')],
            },
          ],
        });
        const expandButton = wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandButton();
        expect(expandButton !== null).toBe(!collapsed);
      });
    });
  });

  describe('icon-less parent link vertical collapse', () => {
    it.each([
      { label: 'link-group', type: 'link-group' as const },
      { label: 'expandable-link-group', type: 'expandable-link-group' as const },
    ])('collapses an icon-less $label parent link to zero size while the list item stays laid out', ({ type }) => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [{ type, text: 'Tools', href: '#/tools', items: [iconLink('Build', '#/build')] }],
      });
      const parentLink = wrapper.findLinkByHref('#/tools')!.getElement();
      expect(parentLink.classList.contains(styles['link--collapsed'])).toBe(true);
      expect(wrapper.findItemByIndex(1)!.getElement().classList.contains(styles['list-item--collapsed'])).toBe(true);
    });
  });

  describe('inter-group spacing identifier class', () => {
    it.each([
      { label: 'plain link', item: iconLink('Dashboard', '#/dashboard'), expectGroupClass: false },
      { label: 'divider', item: { type: 'divider' as const }, expectGroupClass: true },
      {
        label: 'section',
        item: { type: 'section' as const, text: 'Resources', items: [iconLink('Compute', '#/compute')] },
        expectGroupClass: true,
      },
      {
        label: 'section-group',
        item: { type: 'section-group' as const, title: 'My Group', items: [iconLink('Item A', '#/a')] },
        expectGroupClass: true,
      },
      {
        label: 'link-group',
        item: {
          type: 'link-group' as const,
          text: 'Tools',
          href: '#/tools',
          icon: <Icon name="folder" />,
          items: [iconLink('Build', '#/build')],
        },
        expectGroupClass: true,
      },
      {
        label: 'expandable-link-group',
        item: {
          type: 'expandable-link-group' as const,
          text: 'Monitoring',
          href: '#/monitoring',
          icon: <Icon name="bug" />,
          items: [iconLink('Alarms', '#/alarms')],
        },
        expectGroupClass: true,
      },
    ])('applies the group spacing class to $label items only when collapsed', ({ item, expectGroupClass }) => {
      // A divider needs icon-bearing neighbors on both sides to survive collapsed filtering.
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Before', '#/before'), item, iconLink('After', '#/after')],
      });
      expect(wrapper.findItemByIndex(2)!.getElement().classList.contains(styles['list-item--group'])).toBe(
        expectGroupClass
      );
    });

    it('does not apply the group spacing class to any item when not collapsed', () => {
      const wrapper = renderSideNavigation({
        collapsed: false,
        items: [
          iconLink('Dashboard', '#/dashboard'),
          { type: 'section', text: 'Resources', items: [iconLink('Compute', '#/compute')] },
        ],
      });
      expect(wrapper.findAll(`.${styles['list-item--group']}`)).toHaveLength(0);
    });
  });

  describe('nested section hiding', () => {
    it.each([
      { label: 'section', type: 'section' as const },
      { label: 'section-group', type: 'section-group' as const },
    ])('promotes children through a nested $label without making it inert', ({ type }) => {
      const nested: SideNavigationProps.Item =
        type === 'section'
          ? { type: 'section', text: 'Nested', items: [iconLink('Nested Child', '#/nested-child')] }
          : { type: 'section-group', title: 'Nested', items: [iconLink('Nested Child', '#/nested-child')] };
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section',
            text: 'Top Section',
            items: [iconLink('Top Child', '#/top-child'), nested],
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/top-child')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/nested-child')).not.toBeNull();
      const nestedItem = wrapper.findItemByIndex(1)!.findItemByIndex(2)!;
      const nestedGroup = type === 'section' ? nestedItem.findSection() : nestedItem.findSectionGroup();
      expect(nestedGroup!.getElement().inert).toBe(false);
    });

    it('recursively promotes children through a section nested inside a section-group', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section-group',
            title: 'Top Group',
            items: [{ type: 'section', text: 'Nested Section', items: [iconLink('Deep Child', '#/deep-child')] }],
          },
        ],
      });
      expect(wrapper.findLinkByHref('#/deep-child')).not.toBeNull();
      const sectionGroup = wrapper.findItemByIndex(1)!.findSectionGroup()!.getElement();
      expect(sectionGroup.inert).toBe(false);
    });
  });

  describe('dev warning for icon-less collapsed-rail items', () => {
    let consoleSpy: jest.SpyInstance;
    // Import clearMessageCache to reset warnOnce's deduplication between tests.
    const { clearMessageCache } = jest.requireActual('@cloudscape-design/component-toolkit/internal') as {
      clearMessageCache: () => void;
    };
    beforeEach(() => {
      clearMessageCache();
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('warns about root-level link without icon when collapsed', () => {
      render(<SideNavigation collapsed={true} items={[plainLink('No Icon', '#/no-icon')]} />);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('A root-level "link" ("No Icon") has no icon'));
    });

    it('warns about link-group without icon when collapsed', () => {
      render(
        <SideNavigation
          collapsed={true}
          items={[{ type: 'link-group', text: 'Tools', href: '#/tools', items: [iconLink('Build', '#/build')] }]}
        />
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('A "link-group" ("Tools") has no icon'));
    });

    it('warns about expandable-link-group without icon when collapsed', () => {
      render(
        <SideNavigation
          collapsed={true}
          items={[{ type: 'expandable-link-group', text: 'ELG', href: '#/elg', items: [iconLink('Child', '#/child')] }]}
        />
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('An "expandable-link-group" ("ELG") has no icon')
      );
    });

    it('warns about icon-less link inside a section when collapsed', () => {
      render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Resources',
              items: [plainLink('No Icon Child', '#/no-icon-child')],
            },
          ]}
        />
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('A "link" ("No Icon Child") inside section "Resources" has no icon')
      );
    });

    it('does not warn when items have icons', () => {
      render(<SideNavigation collapsed={true} items={[iconLink('Has Icon', '#/has-icon')]} />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('does not warn when not collapsed', () => {
      render(<SideNavigation collapsed={false} items={[plainLink('No Icon', '#/no-icon')]} />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
