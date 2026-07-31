// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';

import expandableSectionStyles from '../../../lib/components/expandable-section/styles.css.js';
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
        items: [
          {
            type: 'section' as const,
            text: 'Resources',
            items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage'), plainLink('No icon', '#/none')],
          },
        ],
        iconHrefs: ['#/compute', '#/storage'],
        hiddenHref: '#/none',
        headerText: 'Resources',
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
        headerText: 'My Group',
      },
    ])(
      'keeps $label mounted with icon-bearing children visible and header text aria-hidden',
      ({ items, iconHrefs, hiddenHref, headerText }) => {
        const { container } = render(<SideNavigation collapsed={true} items={items} />);
        const wrapper = createWrapper(container).findSideNavigation()!;
        // Icon-bearing children remain mounted and visible.
        iconHrefs.forEach(href => expect(wrapper.findLinkByHref(href)).not.toBeNull());
        // Children without icons are still hidden (filtered out by the link-level collapsed logic).
        expect(wrapper.findLinkByHref(hiddenHref)).toBeNull();
        // The header text is rendered but aria-hidden for accessibility.
        const ariaHiddenEls = container.querySelectorAll('[aria-hidden="true"]');
        const headerEl = Array.from(ariaHiddenEls).find(el => el.textContent === headerText);
        expect(headerEl).toBeDefined();
      }
    );

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
      // Section children with icons are mounted.
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

    it('forces section expanded when collapsed so children are not height-collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Resources',
              items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage')],
            },
          ]}
        />
      );
      // The section's expandable trigger should not have aria-expanded="false"
      // (which would indicate children are collapsed to zero height via grid).
      const triggers = container.querySelectorAll('[aria-expanded]');
      triggers.forEach(trigger => {
        expect(trigger.getAttribute('aria-expanded')).not.toBe('false');
      });
    });

    it('section-group title collapses to zero height when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section-group',
              title: 'My Group',
              items: [iconLink('Item A', '#/a')],
            },
          ]}
        />
      );
      // The section-group-title element should have the collapsed class.
      const titleEl = container.querySelector('[class*="section-group-title"]');
      expect(titleEl).not.toBeNull();
      expect(titleEl!.className).toMatch(/section-group-title--collapsed/);
    });

    it('section-group title has both base and collapsed class for specificity override', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section-group',
              title: 'My Group',
              items: [iconLink('Item A', '#/a')],
            },
          ]}
        />
      );
      // The title element must have both the base class and the --collapsed modifier
      // (compound selector .section-group-title.section-group-title--collapsed overrides
      // InternalBox's .box.h3-variant padding).
      const titleEl = container.querySelector(`.${CSS.escape(styles['section-group-title'])}`);
      expect(titleEl).not.toBeNull();
      expect(titleEl!.classList.contains(styles['section-group-title--collapsed'])).toBe(true);
    });

    it('section-group title does not have collapsed class when not collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={false}
          items={[
            {
              type: 'section-group',
              title: 'My Group',
              items: [iconLink('Item A', '#/a')],
            },
          ]}
        />
      );
      const titleEl = container.querySelector(`.${CSS.escape(styles['section-group-title'])}`);
      expect(titleEl).not.toBeNull();
      expect(titleEl!.classList.contains(styles['section-group-title--collapsed'])).toBe(false);
    });
  });

  describe('expandable link groups', () => {
    it('keeps children mounted with faded text in collapsed mode', () => {
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
      // The ELG header link is still rendered.
      expect(wrapper.findLinkByHref('#/monitoring')).not.toBeNull();
      // Children with icons are mounted (not unmounted).
      expect(wrapper.findLinkByHref('#/alarms')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/logs')).not.toBeNull();
    });

    it('forces ELG children collapsed (aria-expanded=false) when nav is collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'expandable-link-group',
              text: 'Monitoring',
              href: '#/monitoring',
              icon: <Icon name="bug" />,
              items: [iconLink('Alarms', '#/alarms')],
            },
          ]}
        />
      );
      // When collapsed, the ELG expand icon is hidden from AT (no interactive button).
      // The children content is collapsed via the inert attribute on the content-inner div.
      const elgRoot = container.querySelector(`.${CSS.escape(styles['expandable-link-group--collapsed'])}`);
      expect(elgRoot).not.toBeNull();
      // No interactive expand button should be present.
      expect(elgRoot!.querySelector('button[aria-expanded]')).toBeNull();
      // The content-inner should be inerted (children non-focusable).
      // Find the content wrapper by its role="group" attribute (rendered by InternalExpandableSection).
      const groupDiv = elgRoot!.querySelector('[role="group"]');
      expect(groupDiv).not.toBeNull();
      const contentInner = groupDiv!.firstElementChild as HTMLElement | null;
      expect(contentInner).not.toBeNull();
      expect(contentInner!.inert).toBe(true);
    });

    it('keeps ELG without icon mounted with header and children in collapsed mode', () => {
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
      // Both the ELG header and children are mounted.
      expect(wrapper.findLinkByHref('#/child')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/elg')).not.toBeNull();
    });

    it('keeps icon-less ELG children mounted and inert in collapsed mode for animation', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'expandable-link-group',
              text: 'Networking',
              href: '#/networking',
              icon: <Icon name="settings" />,
              items: [plainLink('VPC', '#/vpc'), plainLink('Route 53', '#/r53')],
            },
          ]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      // Icon-less children inside an ELG must stay mounted (not filtered)
      // so the grid-template-rows collapse animation has content to transition.
      expect(wrapper.findLinkByHref('#/vpc')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/r53')).not.toBeNull();
      // The ELG content is inerted when collapsed.
      const elgRoot = container.querySelector(`.${CSS.escape(styles['expandable-link-group--collapsed'])}`);
      expect(elgRoot).not.toBeNull();
      const groupDiv = elgRoot!.querySelector('[role="group"]');
      expect(groupDiv).not.toBeNull();
      const contentInner = groupDiv!.firstElementChild as HTMLElement | null;
      expect(contentInner).not.toBeNull();
      expect(contentInner!.inert).toBe(true);
    });
  });

  describe('link groups', () => {
    it('keeps children mounted but inert in collapsed mode', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Group',
              href: '#/group',
              icon: <Icon name="folder" />,
              items: [iconLink('Child 1', '#/c1'), iconLink('Child 2', '#/c2')],
            },
          ]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      // The header link is still rendered.
      expect(wrapper.findLinkByHref('#/group')).not.toBeNull();
      // Children are mounted in the DOM.
      expect(wrapper.findLinkByHref('#/c1')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/c2')).not.toBeNull();
      // Children container is inert (non-focusable, hidden from AT).
      const childrenInner = container.querySelector(`.${CSS.escape(styles['link-group-children-inner'])}`);
      expect(childrenInner).not.toBeNull();
      expect((childrenInner as HTMLElement).inert).toBe(true);
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
              items: [iconLink('Child 1', '#/c1'), iconLink('Child 2', '#/c2')],
            },
          ]}
        />
      );
      const childrenInner = container.querySelector(`.${CSS.escape(styles['link-group-children-inner'])}`);
      expect(childrenInner).not.toBeNull();
      expect((childrenInner as HTMLElement).inert).toBe(false);
    });

    it('applies collapsed class to children container for grid animation', () => {
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
      expect(childrenContainer).not.toBeNull();
      expect(childrenContainer!.classList.contains(styles['link-group-children--collapsed'])).toBe(true);
    });

    it('keeps icon-less children mounted and inert in collapsed mode for animation', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Services',
              href: '#/services',
              icon: <Icon name="folder" />,
              items: [plainLink('Lambda', '#/lambda'), plainLink('S3', '#/s3')],
            },
          ]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      // Icon-less children inside a link-group must stay mounted (not filtered)
      // so the grid-template-rows collapse animation has content to transition.
      expect(wrapper.findLinkByHref('#/lambda')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/s3')).not.toBeNull();
      // The children container must be inert (non-focusable, hidden from AT).
      const childrenInner = container.querySelector(`.${CSS.escape(styles['link-group-children-inner'])}`);
      expect(childrenInner).not.toBeNull();
      expect((childrenInner as HTMLElement).inert).toBe(true);
      // The children wrapper has the collapsed class for the 0fr animation target.
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
    it('applies list-variant-root--collapsed class to the root <ul> when collapsed is true', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            iconLink('Dashboard', '#/dashboard'),
            iconLink('Settings', '#/settings'),
            { type: 'divider' },
            {
              type: 'section',
              text: 'Resources',
              items: [iconLink('Compute', '#/compute')],
            },
            {
              type: 'link-group',
              text: 'Tools',
              href: '#/tools',
              icon: <Icon name="folder" />,
              items: [iconLink('Build', '#/build')],
            },
          ]}
        />
      );
      // Query the root <ul> — the first <ul> inside the list-container that has list-variant-root class
      const rootUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-root'])}`);
      expect(rootUl).not.toBeNull();
      expect(rootUl!.classList.contains(styles['list-variant-root--collapsed'])).toBe(true);
    });

    it('does NOT apply list-variant-root--collapsed class when collapsed is false', () => {
      const { container } = render(<SideNavigation collapsed={false} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const rootUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-root'])}`);
      expect(rootUl).not.toBeNull();
      expect(rootUl!.classList.contains(styles['list-variant-root--collapsed'])).toBe(false);
    });

    it('applies list-variant-section--collapsed class to section <ul> when collapsed is true', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Resources',
              items: [iconLink('Compute', '#/compute')],
            },
          ]}
        />
      );
      const sectionUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-section'])}`);
      expect(sectionUl).not.toBeNull();
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
      it('makes section header wrapper inert when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'section',
                text: 'Resources',
                items: [iconLink('Compute', '#/compute')],
              },
            ]}
          />
        );
        // The section root's first child is the header wrapper.
        const sectionRoot = container.querySelector(`.${CSS.escape(styles.section)}`);
        expect(sectionRoot).not.toBeNull();
        const headerWrapper = sectionRoot!.firstElementChild as HTMLElement;
        expect(headerWrapper.inert).toBe(true);
      });

      it('does not make section header wrapper inert when not collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={false}
            items={[
              {
                type: 'section',
                text: 'Resources',
                items: [iconLink('Compute', '#/compute')],
              },
            ]}
          />
        );
        const sectionRoot = container.querySelector(`.${CSS.escape(styles.section)}`);
        expect(sectionRoot).not.toBeNull();
        const headerWrapper = sectionRoot!.firstElementChild as HTMLElement;
        expect(headerWrapper.inert).toBe(false);
      });

      it('makes icon-less link-group parent link inert when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'link-group',
                text: 'Tools',
                href: '#/tools',
                items: [iconLink('Build', '#/build')],
              },
            ]}
          />
        );
        // The link-group parent is an <a> without an icon — it collapses to 0×0
        // and must be inert so it's removed from the tab order.
        const parentLink = container.querySelector('a[href="#/tools"]') as HTMLElement | null;
        expect(parentLink).not.toBeNull();
        expect(parentLink!.inert).toBe(true);
      });

      it('does not make icon-bearing link-group parent link inert when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'link-group',
                text: 'Tools',
                href: '#/tools',
                icon: <Icon name="folder" />,
                items: [iconLink('Build', '#/build')],
              },
            ]}
          />
        );
        const parentLink = container.querySelector('a[href="#/tools"]') as HTMLElement | null;
        expect(parentLink).not.toBeNull();
        expect(parentLink!.inert).toBe(false);
      });

      it('does not make icon-less link-group parent link inert when not collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={false}
            items={[
              {
                type: 'link-group',
                text: 'Tools',
                href: '#/tools',
                items: [iconLink('Build', '#/build')],
              },
            ]}
          />
        );
        const parentLink = container.querySelector('a[href="#/tools"]') as HTMLElement | null;
        expect(parentLink).not.toBeNull();
        expect(parentLink!.inert).toBe(false);
      });

      it('makes icon-less ELG header link inert when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'expandable-link-group',
                text: 'No Icon ELG',
                href: '#/elg',
                items: [iconLink('Child', '#/child')],
              },
            ]}
          />
        );
        const elgHeaderLink = container.querySelector('a[href="#/elg"]') as HTMLElement | null;
        expect(elgHeaderLink).not.toBeNull();
        expect(elgHeaderLink!.inert).toBe(true);
      });
    });

    describe('group aria-label preserved when collapsed', () => {
      it('adds aria-label to section-group list when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'section-group',
                title: 'My Group',
                items: [iconLink('Item A', '#/a')],
              },
            ]}
          />
        );
        const sectionGroupUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-section-group'])}`);
        expect(sectionGroupUl).not.toBeNull();
        expect(sectionGroupUl!.getAttribute('aria-label')).toBe('My Group');
      });

      it('does not add aria-label to section-group list when not collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={false}
            items={[
              {
                type: 'section-group',
                title: 'My Group',
                items: [iconLink('Item A', '#/a')],
              },
            ]}
          />
        );
        const sectionGroupUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-section-group'])}`);
        expect(sectionGroupUl).not.toBeNull();
        expect(sectionGroupUl!.getAttribute('aria-label')).toBeNull();
      });

      it('adds aria-label to link-group list when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'link-group',
                text: 'Tools',
                href: '#/tools',
                icon: <Icon name="folder" />,
                items: [iconLink('Build', '#/build')],
              },
            ]}
          />
        );
        const linkGroupUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-link-group'])}`);
        expect(linkGroupUl).not.toBeNull();
        expect(linkGroupUl!.getAttribute('aria-label')).toBe('Tools');
      });

      it('does not add aria-label to link-group list when not collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={false}
            items={[
              {
                type: 'link-group',
                text: 'Tools',
                href: '#/tools',
                icon: <Icon name="folder" />,
                items: [iconLink('Build', '#/build')],
              },
            ]}
          />
        );
        const linkGroupUl = container.querySelector(`ul.${CSS.escape(styles['list-variant-link-group'])}`);
        expect(linkGroupUl).not.toBeNull();
        expect(linkGroupUl!.getAttribute('aria-label')).toBeNull();
      });
    });

    describe('ELG caret hidden from AT when collapsed', () => {
      it('hides expand icon button from assistive technology when collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={true}
            items={[
              {
                type: 'expandable-link-group',
                text: 'Monitoring',
                href: '#/monitoring',
                icon: <Icon name="bug" />,
                items: [iconLink('Alarms', '#/alarms')],
              },
            ]}
          />
        );
        // With hideExpandIcon, the caret is completely omitted from the DOM —
        // no button, no span, no icon element for the expand indicator.
        const elgRoot = container.querySelector(`.${CSS.escape(styles['expandable-link-group--collapsed'])}`);
        expect(elgRoot).not.toBeNull();
        // The expand button should NOT be present.
        const expandButton = elgRoot!.querySelector('button[aria-expanded]');
        expect(expandButton).toBeNull();
        // The caret element (previously an aria-hidden span) should also be absent.
        const caretIcon = elgRoot!.querySelector(`.${CSS.escape(expandableSectionStyles['icon-container'])}`);
        expect(caretIcon).toBeNull();
      });

      it('keeps expand icon button accessible when not collapsed', () => {
        const { container } = render(
          <SideNavigation
            collapsed={false}
            items={[
              {
                type: 'expandable-link-group',
                text: 'Monitoring',
                href: '#/monitoring',
                icon: <Icon name="bug" />,
                items: [iconLink('Alarms', '#/alarms')],
              },
            ]}
          />
        );
        const elgRoot = container.querySelector(`.${CSS.escape(styles['expandable-link-group'])}`);
        expect(elgRoot).not.toBeNull();
        const expandButton = elgRoot!.querySelector('button[aria-expanded]');
        expect(expandButton).not.toBeNull();
      });
    });
  });

  describe('icon-less parent link vertical collapse', () => {
    it('collapses icon-less link-group parent link to zero vertical space with children mounted but inert', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Tools',
              href: '#/tools',
              items: [iconLink('Build', '#/build'), iconLink('Deploy', '#/deploy')],
            },
          ]}
        />
      );
      // The parent link (icon-less) should have the collapsed class that zeroes its size.
      const parentLink = container.querySelector('a[href="#/tools"]') as HTMLElement;
      expect(parentLink).not.toBeNull();
      expect(parentLink.classList.contains(styles['link--collapsed'])).toBe(true);
      // The parent link should NOT have an item-icon descendant (confirming it's icon-less).
      expect(parentLink.querySelector(`.${CSS.escape(styles['item-icon'])}`)).toBeNull();

      // The <li> wrapping the group is NOT hidden — it stays at normal collapsed layout.
      const listItem = container.querySelector(`[data-itemid="item-1"]`) as HTMLElement;
      expect(listItem).not.toBeNull();
      expect(listItem.classList.contains(styles['list-item--collapsed'])).toBe(true);

      // Icon-bearing children are still mounted but are inert (opaque group hides children).
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/build')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/deploy')).not.toBeNull();
      const childrenInner = container.querySelector(`.${CSS.escape(styles['link-group-children-inner'])}`);
      expect(childrenInner).not.toBeNull();
      expect((childrenInner as HTMLElement).inert).toBe(true);
    });

    it('collapses icon-less ELG parent link to zero vertical space while children stay visible', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'expandable-link-group',
              text: 'No Icon ELG',
              href: '#/elg',
              items: [iconLink('Child A', '#/child-a'), iconLink('Child B', '#/child-b')],
            },
          ]}
        />
      );
      // The parent link (icon-less) is collapsed.
      const parentLink = container.querySelector('a[href="#/elg"]') as HTMLElement;
      expect(parentLink).not.toBeNull();
      expect(parentLink.classList.contains(styles['link--collapsed'])).toBe(true);
      expect(parentLink.querySelector(`.${CSS.escape(styles['item-icon'])}`)).toBeNull();

      // The <li> is not collapsed/hidden at the item level.
      const listItem = container.querySelector(`[data-itemid="item-1"]`) as HTMLElement;
      expect(listItem).not.toBeNull();
      expect(listItem.classList.contains(styles['list-item--collapsed'])).toBe(true);

      // Icon-bearing children are still rendered.
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/child-a')).not.toBeNull();
      expect(wrapper.findLinkByHref('#/child-b')).not.toBeNull();
    });
  });

  describe('content-settled class for wrap-jank prevention', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it('applies settled class on link-text-wrapper-content when expanded and transition completes', () => {
      const { container } = render(<SideNavigation collapsed={false} items={[iconLink('Dashboard', '#/dashboard')]} />);
      // Initially settled=true on mount when not collapsed (no transition needed).
      const contentEl = container.querySelector(`.${CSS.escape(styles['link-text-wrapper-content'])}`);
      expect(contentEl).not.toBeNull();
      expect(contentEl!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(true);
    });

    it('does not apply settled class when collapsed', () => {
      const { container } = render(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const contentEl = container.querySelector(`.${CSS.escape(styles['link-text-wrapper-content'])}`);
      expect(contentEl).not.toBeNull();
      expect(contentEl!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(false);
    });

    it('removes settled class immediately on collapse and applies it after expand transition', () => {
      const { container, rerender } = render(
        <SideNavigation collapsed={false} items={[iconLink('Dashboard', '#/dashboard')]} />
      );
      const getContentEl = () => container.querySelector(`.${CSS.escape(styles['link-text-wrapper-content'])}`);

      // Start: settled (expanded at rest).
      expect(getContentEl()!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(true);

      // Collapse: settled removed immediately.
      rerender(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      expect(getContentEl()!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(false);

      // Expand: settled is false during transition.
      rerender(<SideNavigation collapsed={false} items={[iconLink('Dashboard', '#/dashboard')]} />);
      expect(getContentEl()!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(false);

      // At 320ms (within transition tail), settled is STILL false — no premature wrap.
      act(() => {
        jest.advanceTimersByTime(320);
      });
      expect(getContentEl()!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(false);

      // After the fallback timer (500ms total), settled becomes true.
      // In a real browser, transitionend fires at ~300ms; in jsdom without CSS
      // transitions, the 500ms fallback guarantees settlement.
      act(() => {
        jest.advanceTimersByTime(180);
      });
      expect(getContentEl()!.classList.contains(styles['link-text-wrapper-content--settled'])).toBe(true);
    });

    it('applies settled class on label-text when expanded and settled', () => {
      const { container } = render(
        <SideNavigation
          collapsed={false}
          items={[{ type: 'section', text: 'Resources', items: [iconLink('Compute', '#/compute')] }]}
        />
      );
      const labelEl = container.querySelector(`.${CSS.escape(styles['label-text'])}`);
      expect(labelEl).not.toBeNull();
      expect(labelEl!.classList.contains(styles['label-text--settled'])).toBe(true);
    });

    it('does not apply label-text--settled when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[{ type: 'section', text: 'Resources', items: [iconLink('Compute', '#/compute')] }]}
        />
      );
      const labelEl = container.querySelector(`.${CSS.escape(styles['label-text'])}`);
      expect(labelEl).not.toBeNull();
      expect(labelEl!.classList.contains(styles['label-text--settled'])).toBe(false);
    });
  });

  describe('inter-group spacing identifier class', () => {
    it('applies list-item--group class to section, section-group, expandable-link-group, and link-group items when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            iconLink('Dashboard', '#/dashboard'),
            {
              type: 'section',
              text: 'Resources',
              items: [iconLink('Compute', '#/compute')],
            },
            {
              type: 'section-group',
              title: 'My Group',
              items: [iconLink('Item A', '#/a')],
            },
            {
              type: 'link-group',
              text: 'Tools',
              href: '#/tools',
              icon: <Icon name="folder" />,
              items: [iconLink('Build', '#/build')],
            },
            {
              type: 'expandable-link-group',
              text: 'Monitoring',
              href: '#/monitoring',
              icon: <Icon name="bug" />,
              items: [iconLink('Alarms', '#/alarms')],
            },
          ]}
        />
      );
      // Plain link (item-1) should NOT have the group class.
      const plainLinkItem = container.querySelector('[data-itemid="item-1"]') as HTMLElement;
      expect(plainLinkItem).not.toBeNull();
      expect(plainLinkItem.classList.contains(styles['list-item--group'])).toBe(false);

      // Section (item-2) should have the group class.
      const sectionItem = container.querySelector('[data-itemid="item-2"]') as HTMLElement;
      expect(sectionItem).not.toBeNull();
      expect(sectionItem.classList.contains(styles['list-item--group'])).toBe(true);

      // Section-group (item-3) should have the group class.
      const sectionGroupItem = container.querySelector('[data-itemid="item-3"]') as HTMLElement;
      expect(sectionGroupItem).not.toBeNull();
      expect(sectionGroupItem.classList.contains(styles['list-item--group'])).toBe(true);

      // Link-group (item-4) should have the group class.
      const linkGroupItem = container.querySelector('[data-itemid="item-4"]') as HTMLElement;
      expect(linkGroupItem).not.toBeNull();
      expect(linkGroupItem.classList.contains(styles['list-item--group'])).toBe(true);

      // Expandable-link-group (item-5) should have the group class.
      const elgItem = container.querySelector('[data-itemid="item-5"]') as HTMLElement;
      expect(elgItem).not.toBeNull();
      expect(elgItem.classList.contains(styles['list-item--group'])).toBe(true);
    });

    it('applies list-item--group class to divider wrapper when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[iconLink('Link 1', '#/1'), { type: 'divider' }, iconLink('Link 2', '#/2')]}
        />
      );
      // Divider wrapper (item-2) should have the group class.
      const dividerWrapper = container.querySelector('[data-itemid="item-2"]') as HTMLElement;
      expect(dividerWrapper).not.toBeNull();
      expect(dividerWrapper.classList.contains(styles['list-item--group'])).toBe(true);
    });

    it('does NOT apply list-item--group class to any items when not collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={false}
          items={[
            iconLink('Dashboard', '#/dashboard'),
            {
              type: 'section',
              text: 'Resources',
              items: [iconLink('Compute', '#/compute')],
            },
            {
              type: 'link-group',
              text: 'Tools',
              href: '#/tools',
              icon: <Icon name="folder" />,
              items: [iconLink('Build', '#/build')],
            },
          ]}
        />
      );
      const groupElements = container.querySelectorAll(`.${CSS.escape(styles['list-item--group'])}`);
      expect(groupElements).toHaveLength(0);
    });

    it('does NOT apply list-item--group class to plain link items when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[iconLink('Link A', '#/a'), iconLink('Link B', '#/b'), iconLink('Link C', '#/c')]}
        />
      );
      // All items are plain links — none should have the group class.
      const allListItems = container.querySelectorAll(`.${CSS.escape(styles['list-item--collapsed'])}`);
      allListItems.forEach(item => {
        expect(item.classList.contains(styles['list-item--group'])).toBe(false);
      });
    });
  });

  describe('nested section hiding', () => {
    it('promotes nested section children (section inside section is transparent) when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Top Section',
              items: [
                iconLink('Top Child', '#/top-child'),
                {
                  type: 'section',
                  text: 'Nested Section',
                  items: [iconLink('Nested Child', '#/nested-child')],
                },
              ],
            },
          ]}
        />
      );
      // The top section is transparent — its direct icon-bearing children are visible.
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/top-child')).not.toBeNull();
      // The nested section is also transparent — it promotes its children.
      expect(wrapper.findLinkByHref('#/nested-child')).not.toBeNull();
      // The nested section is NOT inert (its children are accessible).
      const sectionEls = container.querySelectorAll(`.${CSS.escape(styles.section)}`);
      // There should be at least 2 sections (top + nested)
      expect(sectionEls.length).toBeGreaterThanOrEqual(2);
      // None of them should be inert (sections are always transparent)
      sectionEls.forEach(el => {
        expect((el as HTMLElement).inert).toBe(false);
      });
    });

    it('root-level section is transparent (not inert, children promoted)', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Root Section',
              items: [iconLink('Child', '#/child')],
            },
          ]}
        />
      );
      const sectionEl = container.querySelector(`.${CSS.escape(styles.section)}`);
      expect(sectionEl).not.toBeNull();
      expect((sectionEl as HTMLElement).inert).toBe(false);
      // Children are promoted — icon-bearing link is visible
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/child')).not.toBeNull();
    });

    it('promotes nested section-group children (section-group is transparent) when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section',
              text: 'Top Section',
              items: [
                iconLink('Top Child', '#/top-child'),
                {
                  type: 'section-group',
                  title: 'Nested Group',
                  items: [iconLink('Group Child', '#/group-child')],
                },
              ],
            },
          ]}
        />
      );
      // Nested section-group is transparent — its children are promoted.
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/group-child')).not.toBeNull();
      // The section-group element is NOT inert
      const sectionGroupEl = container.querySelector(`.${CSS.escape(styles['section-group'])}`);
      expect(sectionGroupEl).not.toBeNull();
      expect((sectionGroupEl as HTMLElement).inert).toBe(false);
    });

    it('root-level section-group is transparent (not inert, children promoted)', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section-group',
              title: 'Root Group',
              items: [iconLink('Child', '#/child')],
            },
          ]}
        />
      );
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/child')).not.toBeNull();
      const sectionGroupEl = container.querySelector(`.${CSS.escape(styles['section-group'])}`);
      expect(sectionGroupEl).not.toBeNull();
      expect((sectionGroupEl as HTMLElement).inert).toBe(false);
    });

    it('recursively promotes children through nested section inside section-group', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section-group',
              title: 'Top Group',
              items: [
                {
                  type: 'section',
                  text: 'Nested Section',
                  items: [iconLink('Deep Child', '#/deep-child')],
                },
              ],
            },
          ]}
        />
      );
      // The section inside section-group is transparent — its children reach the collapsed rail.
      const wrapper = createWrapper(container).findSideNavigation()!;
      expect(wrapper.findLinkByHref('#/deep-child')).not.toBeNull();
      // Neither container is inert
      const sectionGroupEl = container.querySelector(`.${CSS.escape(styles['section-group'])}`);
      expect((sectionGroupEl as HTMLElement).inert).toBe(false);
      const sectionEl = container.querySelector(`.${CSS.escape(styles.section)}`);
      expect((sectionEl as HTMLElement).inert).toBe(false);
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
