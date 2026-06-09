// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';

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
      const links = wrapper.findAll('a');
      expect(links).toHaveLength(1);
      expect(links[0].getElement()).toHaveAttribute('href', '#/has-icon');
    });

    it('does not hide dividers', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [iconLink('Link 1', '#/1'), { type: 'divider' }, iconLink('Link 2', '#/2')],
      });
      const links = wrapper.findAll('a');
      expect(links).toHaveLength(2);
      expect(wrapper.findAll('hr')).toHaveLength(1);
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
      // The middle segment (plainLink without icon) is empty, so one of the
      // dividers should be deduplicated.
      expect(wrapper.findAll('hr')).toHaveLength(1);
    });
  });

  describe('sections', () => {
    it('flattens section children with icons into the list', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section',
            text: 'Resources',
            items: [iconLink('Compute', '#/compute'), iconLink('Storage', '#/storage'), plainLink('No icon', '#/none')],
          },
        ],
      });
      const links = wrapper.findAll('a');
      // Only icon-bearing children are rendered; plainLink is hidden
      expect(links).toHaveLength(2);
      expect(links[0].getElement()).toHaveAttribute('href', '#/compute');
      expect(links[1].getElement()).toHaveAttribute('href', '#/storage');
    });

    it('applies aria-label from section text to the inner list', () => {
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
      const innerList = container.querySelector('ul[aria-label="Resources"]');
      expect(innerList).toBeTruthy();
    });

    it('does not render section if no children have icons', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section',
            text: 'Empty Section',
            items: [plainLink('A', '#/a'), plainLink('B', '#/b')],
          },
        ],
      });
      expect(wrapper.findAll('a')).toHaveLength(0);
    });

    it('renders section icon in header when expanded', () => {
      const { container } = render(
        <SideNavigation
          items={[
            {
              type: 'section',
              text: 'Resources',
              icon: <Icon name="settings" />,
              items: [plainLink('Child', '#/child')],
            },
          ]}
        />
      );
      expect(container.querySelector('[class*="section-header-text"]')).toBeTruthy();
    });
  });

  describe('section groups', () => {
    it('flattens section-group children with icons into the list', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        items: [
          {
            type: 'section-group',
            title: 'My Group',
            items: [
              {
                type: 'section',
                text: 'Inner Section',
                items: [iconLink('Item A', '#/a'), plainLink('Item B', '#/b')],
              },
              iconLink('Direct Link', '#/direct'),
            ],
          },
        ],
      });
      const links = wrapper.findAll('a');
      // Inner section's icon-bearing child + the direct link
      expect(links).toHaveLength(2);
      expect(links[0].getElement()).toHaveAttribute('href', '#/a');
      expect(links[1].getElement()).toHaveAttribute('href', '#/direct');
    });

    it('applies aria-label from section-group title to the inner list', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'section-group',
              title: 'My Group',
              items: [iconLink('Item', '#/item')],
            },
          ]}
        />
      );
      const innerList = container.querySelector('ul[aria-label="My Group"]');
      expect(innerList).toBeTruthy();
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
      // In collapsed mode, ELG renders as a single link (no expansion)
      const links = wrapper.findAll('a');
      expect(links).toHaveLength(1);
      expect(links[0].getElement()).toHaveAttribute('href', '#/monitoring');
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
      // ELG without icon flattens its icon-bearing children (same as sections)
      const links = wrapper.findAll('a');
      expect(links).toHaveLength(1);
      expect(links[0].getElement()).toHaveAttribute('href', '#/child');
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
      // link-group renders only the parent link when collapsed, children hidden
      const links = wrapper.findAll('a');
      expect(links).toHaveLength(1);
      expect(links[0].getElement()).toHaveAttribute('href', '#/group');
    });
  });

  describe('header', () => {
    it('hides header text in collapsed mode', () => {
      const wrapper = renderSideNavigation({
        collapsed: true,
        header: { href: '#/', text: 'Service name' },
        items: [iconLink('Page', '#/page')],
      });
      const headerLink = wrapper.findHeaderLink()!.getElement();
      expect(headerLink).toHaveAttribute('aria-label', 'Service name');
      expect(headerLink.textContent).not.toContain('Service name');
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
      const { container } = render(<SideNavigation items={[plainLink('Visible text', '#/link')]} />);
      expect(container.textContent).toContain('Visible text');
    });

    it('hides itemsControl when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[iconLink('Page', '#/page')]}
          itemsControl={<input data-testid="control" />}
        />
      );
      expect(container.querySelector('[data-testid="control"]')).toBeNull();
    });

    it('shows itemsControl when not collapsed', () => {
      const { container } = render(
        <SideNavigation items={[plainLink('Page', '#/page')]} itemsControl={<input data-testid="control" />} />
      );
      expect(container.querySelector('[data-testid="control"]')).toBeTruthy();
    });
  });

  describe('header logo', () => {
    it('stretches img logo when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          header={{ href: '#/', text: 'Service', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[iconLink('Page', '#/page')]}
        />
      );
      const logo = container.querySelector('img')!;
      expect(logo.className).toContain('header-logo--stretched');
    });

    it('stretches SVG logo when collapsed', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          header={{ href: '#/', text: 'Service', logo: { svg: <svg data-testid="svg-logo" /> } }}
          items={[iconLink('Page', '#/page')]}
        />
      );
      const logoWrapper = container.querySelector('[data-testid="svg-logo"]')!.parentElement!;
      expect(logoWrapper.className).toContain('header-logo--stretched');
    });

    it('stretches SVG logo when no text is provided', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', logo: { svg: <svg data-testid="svg-logo" /> } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      const logoWrapper = container.querySelector('[data-testid="svg-logo"]')!.parentElement!;
      expect(logoWrapper.className).toContain('header-logo--stretched');
    });

    it('stretches img logo when no text is provided', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      const logo = container.querySelector('img')!;
      expect(logo.className).toContain('header-logo--stretched');
    });

    it('does not stretch logo when text is provided and not collapsed', () => {
      const { container } = render(
        <SideNavigation
          header={{ href: '#/', text: 'Service', logo: { src: 'logo.png', alt: 'logo' } }}
          items={[plainLink('Page', '#/page')]}
        />
      );
      const logo = container.querySelector('img')!;
      expect(logo.className).not.toContain('header-logo--stretched');
    });
  });

  describe('tooltip on collapsed items', () => {
    it('shows tooltip on focus of a collapsed link', () => {
      const { container } = render(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const link = container.querySelector('a')!;
      fireEvent.focus(link);
      expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    });

    it('hides tooltip on blur of a collapsed link', () => {
      const { container } = render(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const link = container.querySelector('a')!;
      fireEvent.focus(link);
      fireEvent.blur(link);
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
    });

    it('shows tooltip on mouseenter of a collapsed link', () => {
      const { container } = render(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const link = container.querySelector('a')!;
      fireEvent.mouseEnter(link);
      expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    });

    it('hides tooltip on mouseleave of a collapsed link', () => {
      const { container } = render(<SideNavigation collapsed={true} items={[iconLink('Dashboard', '#/dashboard')]} />);
      const link = container.querySelector('a')!;
      fireEvent.mouseEnter(link);
      fireEvent.mouseLeave(link);
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
    });
  });

  describe('collapsed sections with icons', () => {
    it('renders section icon in collapsed mode', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Group',
              href: '#/group',
              icon: <Icon name="folder" />,
              items: [
                {
                  type: 'section',
                  text: 'Nested',
                  icon: <Icon name="settings" />,
                  items: [iconLink('Child', '#/child')],
                },
              ],
            },
          ]}
        />
      );
      const icons = container.querySelectorAll('[class*="item-icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('renders section-group icon in collapsed mode', () => {
      const { container } = render(
        <SideNavigation
          collapsed={true}
          items={[
            {
              type: 'link-group',
              text: 'Group',
              href: '#/group',
              icon: <Icon name="folder" />,
              items: [
                {
                  type: 'section-group',
                  title: 'Nested Group',
                  icon: <Icon name="settings" />,
                  items: [iconLink('Child', '#/child')],
                },
              ],
            },
          ]}
        />
      );
      const icons = container.querySelectorAll('[class*="item-icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
