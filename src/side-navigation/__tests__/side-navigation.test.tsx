// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/side-navigation/styles.css.js';

function renderSideNavigation(props: SideNavigationProps = {}) {
  const { container } = render(<SideNavigation {...props} />);
  return createWrapper(container).findSideNavigation()!;
}

function renderUpdatableSideNavigation(props: SideNavigationProps = {}) {
  let currentProps = props;
  const { container, rerender } = render(<SideNavigation {...currentProps} />);
  return {
    wrapper: createWrapper(container).findSideNavigation()!,
    rerender: (props: SideNavigationProps = {}) => {
      currentProps = { ...currentProps, ...props };
      rerender(<SideNavigation {...currentProps} />);
    },
  };
}

describe('SideNavigation', () => {
  const ABSOLUTE_HREF = 'https://aws.amazon.com/';

  it('renders multiple links', () => {
    const wrapper = renderSideNavigation({
      items: [
        { type: 'link', text: 'Page 1', href: '#something' },
        { type: 'link', text: 'Page 2', href: '#something-else' },
      ],
    });

    expect(wrapper.findItemByIndex(2)?.findLink()?.getElement()).toHaveTextContent('Page 2');
  });

  it('renders dividers', () => {
    const wrapper = renderSideNavigation({
      items: [{ type: 'divider' }],
    });

    expect(wrapper.findItemByIndex(1)?.findDivider()).toBeTruthy();
  });

  it('re-renders different section types correctly', () => {
    const { wrapper, rerender } = renderUpdatableSideNavigation({
      items: [
        {
          text: 'Link group',
          type: 'expandable-link-group',
          href: '',
          items: [],
        },
      ],
    });

    expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()).toBeTruthy();

    rerender({
      items: [
        {
          type: 'section',
          text: 'Section 1',
          items: [],
        },
      ],
    });

    expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()).not.toBeTruthy();
  });

  // Regression test for AWSUI-7494
  // This order of items is the most minimally reproducible example.
  it('re-renders expandable groups correctly', () => {
    const { wrapper, rerender } = renderUpdatableSideNavigation({
      items: [
        { type: 'link', href: '#1', text: 'Plain link 1' },
        { type: 'link', href: '#2', text: 'Plain link 2' },
        { type: 'link', href: '#3', text: 'Plain link 3' },
        {
          type: 'expandable-link-group',
          href: '#g1',
          text: 'Link group 1',
          items: [],
        },
      ],
    });

    rerender({
      items: [
        { type: 'link', href: '#0', text: 'Plain link 1' },
        { type: 'link', href: '#1', text: 'Plain link 2' },
        {
          type: 'expandable-link-group',
          href: '#g1',
          text: 'Link group 1',
          items: [],
        },
      ],
    });

    rerender({
      items: [
        {
          type: 'expandable-link-group',
          href: '#g1',
          text: 'Link group 1',
          items: [],
        },
        {
          type: 'expandable-link-group',
          href: '#g2',
          text: 'Link group 2',
          items: [],
        },
      ],
    });

    expect(wrapper.findLinkByHref('#g2')).toBeTruthy();

    rerender({
      items: [
        { type: 'link', href: '#0', text: 'Plain link 1' },
        {
          type: 'expandable-link-group',
          href: '#g1',
          text: 'Link group 1',
          items: [],
        },
        {
          type: 'expandable-link-group',
          href: '#g2',
          text: 'Link group 2',
          items: [],
        },
      ],
    });

    expect(wrapper.findLinkByHref('#g2')).toBeTruthy();
  });

  it('throws a warning if multiple links have the same href', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      renderSideNavigation({
        items: [
          { type: 'link', text: 'Page 1', href: '/anything' },
          { type: 'link', text: 'Page 2', href: '/something' },
          {
            type: 'section',
            text: 'Page 1',
            items: [{ type: 'link', text: 'Page 1', href: '/anything' }],
          },
        ],
      });

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('duplicate href in "Page 1": /anything'));
    } finally {
      spy?.mockRestore();
    }
  });

  describe('Header', () => {
    it('has specified text', () => {
      const wrapper = renderSideNavigation({ header: { text: 'Console', href: '#something' } });
      expect(wrapper.findHeaderLink()!.getElement()).toHaveTextContent('Console');
    });
    it('renders the header in a <h2>', () => {
      const wrapper = renderSideNavigation({ header: { text: 'Console', href: '#something' } });
      expect(wrapper.findHeader()!.getElement()!.tagName).toBe('H2');
      expect(wrapper.find('h2')!.getElement()).toHaveTextContent('Console');
    });

    it('has specified href', () => {
      const wrapper = renderSideNavigation({ header: { text: 'Console', href: ABSOLUTE_HREF } });
      expect(wrapper.findHeaderLink()!.getElement()).toHaveAttribute('href', ABSOLUTE_HREF);
    });

    it('has aria-current attribute when active', () => {
      const wrapper = renderSideNavigation({
        header: { text: 'Console', href: ABSOLUTE_HREF },
        activeHref: ABSOLUTE_HREF,
      });
      expect(wrapper.findHeaderLink()!.getElement()).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Section Group', () => {
    it('has specified title', () => {
      const wrapper = renderSideNavigation({ items: [{ type: 'section-group', title: 'Section Group', items: [] }] });
      expect(wrapper.findItemByIndex(1)?.findSectionGroupTitle()!.getElement()).toHaveTextContent('Section Group');
    });

    it('renders the section group title in a <h3>', () => {
      const wrapper = renderSideNavigation({ items: [{ type: 'section-group', title: 'Section Group', items: [] }] });
      expect(wrapper.findItemByIndex(1)?.findSectionGroup()!.getElement()!.children[0]!.tagName).toBe('H3');
      expect(wrapper.find('h3')!.getElement()).toHaveTextContent('Section Group');
    });
  });

  describe('Link', () => {
    it('has specified text', () => {
      const wrapper = renderSideNavigation({ items: [{ type: 'link', text: 'Page 1', href: '#something' }] });
      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveTextContent('Page 1');
    });

    it('has specified href', () => {
      const wrapper = renderSideNavigation({ items: [{ type: 'link', text: 'Page 1', href: ABSOLUTE_HREF }] });
      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveAttribute('href', ABSOLUTE_HREF);
    });

    it('has active state when "activeHref" property points to the link', () => {
      const wrapper = renderSideNavigation({
        items: [{ type: 'link', text: 'Page 1', href: ABSOLUTE_HREF }],
        activeHref: ABSOLUTE_HREF,
      });
      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toBe(wrapper.findActiveLink()?.getElement());
    });

    it('has aria-current set to page when active', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          { type: 'link', text: 'Page 1', href: 'a' },
          { type: 'link', text: 'Page 2', href: 'b' },
        ],
        activeHref: 'a',
      });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveAttribute('aria-current', 'page');

      expect(wrapper.findItemByIndex(2)?.findLink()?.getElement()).not.toHaveAttribute('aria-current');

      rerender({ activeHref: 'b' });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).not.toHaveAttribute('aria-current');

      expect(wrapper.findItemByIndex(2)?.findLink()?.getElement()).toHaveAttribute('aria-current', 'page');
    });

    it('has icon next to it when "external" flag is set to "true"', () => {
      // v2.1 test case checked item props, but that's not possible in v3.0.
      // We can safely go by screenshot tests if this breaks, though.
      const wrapper = renderSideNavigation({
        items: [{ type: 'link', text: 'Page 1', href: '#something', external: true }],
      });
      expect(wrapper.findItemByIndex(1)?.findLink()?.findIcon()?.getElement()).toBeTruthy();
    });

    it('has proper attributes when "external" flag is set to "true"', () => {
      const wrapper = renderSideNavigation({
        items: [{ type: 'link', text: 'Page 1', href: '#something', external: true }],
      });
      const externalLink = wrapper.findItemByIndex(1)?.findLink()?.getElement();

      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('has proper aria label when "external" flag is set to "true" and "externalIconAriaLabel" is provided', () => {
      const wrapper = renderSideNavigation({
        items: [
          { type: 'link', text: 'Page 1', href: '#something', external: true, externalIconAriaLabel: 'External link' },
        ],
      });

      expect(createWrapper(wrapper.getElement()).find('[role="img"][aria-label="External link"]')).toBeTruthy();
    });

    it('has an additional info when "info" property is specified', () => {
      const wrapper = renderSideNavigation({
        items: [{ type: 'link', text: 'Page 1', href: '#something', info: <span>Additional info</span> }],
      });
      expect(wrapper.findItemByIndex(1)?.find('span')?.getElement()).toHaveTextContent('Additional info');
    });

    it('still renders the component if multiple links with info have the same href', () => {
      const wrapper = renderSideNavigation({
        items: [
          { type: 'link', text: 'Page 1', href: '/something', info: 'info1' },
          { type: 'link', text: 'Page 2', href: '/anything', info: 'info2' },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveTextContent('Page 1');
    });
  });

  describe('Section', () => {
    it('has specified text', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [{ type: 'link', text: 'Page 1', href: '/something' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findHeader()?.getElement()).toHaveTextContent('Section');
    });

    it('has links', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [
              { type: 'link', text: 'Page 1', href: '/something' },
              { type: 'link', text: 'Page 2', href: '/something-else' },
            ],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findItemByIndex(2)?.findLink()).toBeTruthy();
    });

    it('is expanded if child element is active and has no overrides', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it('is collapsed if child element is active but has overrides', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });
      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is expanded if grand child element is active and has no overrides', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [
              {
                type: 'section',
                text: 'Section',
                items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
              },
            ],
          },
        ],
      });

      // Grandparent
      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();

      // Parent
      expect(wrapper.findItemByIndex(1)?.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it('is collapsed if grand child element is active but has defaultExpanded set to false', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [
              {
                type: 'expandable-link-group',
                text: 'Expandable Link Group',
                href: '#',
                items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
              },
            ],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is collapsed if grand child element is active but parent has overrides', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/active',
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [
              {
                type: 'section',
                text: 'Inner section',
                defaultExpanded: false,
                items: [{ type: 'link', text: 'Page 1', href: '/active' }],
              },
            ],
          },
        ],
      });

      // Grandparent
      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();

      // Parent
      expect(wrapper.findItemByIndex(1)?.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is expanded if "defaultExpanded" prop is set to "true"', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: true,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it('is expanded if "defaultExpanded" prop is omitted', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it('is not expanded if "defaultExpanded" prop is set to false', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    it('does not modify expansion state without user interaction', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      rerender({ activeHref: '/nested-content' });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    it('keeps user modified expansion state after re-render', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      wrapper.findItemByIndex(1)!.findSection()!.findExpandIcon()!.click();

      rerender({ activeHref: '/' });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).toBeTruthy();
    });

    it('discards expansion state if items property is updated', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/active' }],
          },
        ],
      });

      wrapper.findItemByIndex(1)!.findSection()!.findExpandIcon()!.click();

      rerender({
        items: [
          {
            type: 'section',
            text: 'Section',
            defaultExpanded: false,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findSection()?.findExpandedContent()).not.toBeTruthy();
    });

    describe('when the section title is clicked', () => {
      it('triggers the onChange event', () => {
        const onChange = jest.fn();
        const wrapper = renderSideNavigation({
          onChange,
          items: [
            {
              type: 'section',
              text: 'Section',
              items: [{ type: 'link', text: 'Page 1', href: '/active' }],
            },
          ],
        });

        wrapper.findItemByIndex(1)!.findSectionTitle()!.click();

        expect(onChange).toHaveBeenCalledTimes(1);
      });

      it('triggers the onChange event with the correct detail object', () => {
        const onChange = jest.fn();
        const items: SideNavigationProps.Item[] = [
          {
            type: 'section',
            text: 'Section',
            items: [{ type: 'link', text: 'Page 1', href: '/active' }],
          },
        ];
        const wrapper = renderSideNavigation({ onChange, items });

        wrapper.findItemByIndex(1)!.findSectionTitle()!.click();

        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              item: items[0],
              expanded: false,
              expandableParents: [],
            },
          })
        );
      });

      it('triggers the onChange event for both open and close events', () => {
        const onChange = jest.fn();
        const wrapper = renderSideNavigation({
          onChange,
          items: [
            {
              type: 'section',
              text: 'Section',
              items: [{ type: 'link', text: 'Page 1', href: '/active' }],
            },
          ],
        });

        const sectionTitle = wrapper.findItemByIndex(1)!.findSectionTitle()!;
        sectionTitle.click();
        sectionTitle.click();

        expect(onChange).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('LinkGroup', () => {
    it('has links', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'link-group',
            text: 'Link Group',
            href: '/page',
            items: [
              { type: 'link', text: 'Page 1', href: '/something' },
              { type: 'link', text: 'Page 2', href: '/something-else' },
            ],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findItemByIndex(2)?.findLink()).toBeTruthy();
    });

    it('has specified text', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'link-group',
            text: 'Link Group',
            href: '/page',
            items: [{ type: 'link', text: 'Page 1', href: '/something' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveTextContent('Link Group');
    });

    it('has specified href', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'link-group',
            text: 'Link Group',
            href: ABSOLUTE_HREF,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveAttribute('href', ABSOLUTE_HREF);
    });

    it('has an additional info when "info" property is specified', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'link-group',
            text: 'Link Group',
            href: ABSOLUTE_HREF,
            info: <span>Additional info</span>,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.find('span')?.getElement()).toHaveTextContent('Additional info');
    });
  });

  describe('Expandable Link Group', () => {
    it('has links', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/page',
            items: [
              { type: 'link', text: 'Page 1', href: '/something' },
              { type: 'link', text: 'Page 2', href: '/something-else' },
            ],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findItemByIndex(1)?.findLink()?.getElement()).toHaveTextContent('Page 1');

      expect(wrapper.findItemByIndex(1)?.findItemByIndex(2)?.findLink()?.getElement()).toHaveTextContent('Page 2');
    });

    it('has specified text', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/page',
            items: [{ type: 'link', text: 'Page 1', href: '/something' }],
          },
        ],
      });
      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveTextContent('Expandable Link Group');
    });

    it('has specified href', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: ABSOLUTE_HREF,
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });
      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveAttribute('href', ABSOLUTE_HREF);
    });

    it('is expanded if active', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/something',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
    });

    it('is expanded if child element is active', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
    });

    it('is collapsed if has overrides and child element is active', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            defaultExpanded: false,
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is expanded if grand child element is active', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content/active',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [
              {
                type: 'expandable-link-group',
                text: 'Expandable Link Group',
                href: '/nested-content',
                items: [{ type: 'link', text: 'Page 1', href: '/nested-content/active' }],
              },
            ],
          },
        ],
      });

      // Grandparent
      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();

      // Parent
      expect(
        wrapper.findItemByIndex(1)?.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()
      ).toBeTruthy();
    });

    it('is collapsed if it has overrides and grand child element is active', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content/active',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            defaultExpanded: false,
            items: [
              {
                type: 'section',
                text: 'Section',
                items: [{ type: 'link', text: 'Page 1', href: '/nested-content/active' }],
              },
            ],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is collapsed if grand child element is active but parent has overrides', () => {
      const wrapper = renderSideNavigation({
        activeHref: '/nested-content/active',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [
              {
                type: 'expandable-link-group',
                text: 'Expandable Link Group',
                href: '/nested-content',
                defaultExpanded: false,
                items: [{ type: 'link', text: 'Page 1', href: '/nested-content/active' }],
              },
            ],
          },
        ],
      });

      // Grandparent
      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();

      // Parent
      expect(
        wrapper.findItemByIndex(1)?.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()
      ).not.toBeTruthy();
    });

    it('is expanded if "defaultExpanded" prop is set to true', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            defaultExpanded: true,
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
    });

    it('is collapsed if "expanded" flag is omitted', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('is collapsed if "defaultExpanded" prop is set to false', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            defaultExpanded: false,
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('discards auto-expansion state after re-render', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        activeHref: '/nested-content',
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            defaultExpanded: false,
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      rerender({ activeHref: '/' });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('keeps user modified expansion state after re-render', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            defaultExpanded: false,
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      wrapper.findItemByIndex(1)!.findExpandableLinkGroup()!.findExpandIcon()!.click();

      rerender({ activeHref: '/' });

      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
    });

    it('discards expansion state if items propery is updated', () => {
      const { wrapper, rerender } = renderUpdatableSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });

      wrapper.findItemByIndex(1)!.findExpandableLinkGroup()!.findExpandIcon()!.click();

      rerender({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '/something',
            items: [{ type: 'link', text: 'Page 1', href: '/nested-content' }],
          },
        ],
      });
      expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
    });

    it('decorates the link with the accurate aria-expanded attribute', () => {
      const wrapper = renderSideNavigation({
        items: [
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '#/something',
            defaultExpanded: true,
            items: [],
          },
          {
            type: 'expandable-link-group',
            text: 'Expandable Link Group',
            href: '#/something/else',
            defaultExpanded: false,
            items: [],
          },
        ],
      });

      expect(wrapper.findItemByIndex(1)?.findLink()?.getElement()).toHaveAttribute('aria-expanded', 'true');

      expect(wrapper.findItemByIndex(2)?.findLink()?.getElement()).toHaveAttribute('aria-expanded', 'false');
    });

    describe('when clicking on the title link', () => {
      it('gets expanded', () => {
        const wrapper = renderSideNavigation({
          items: [
            {
              type: 'expandable-link-group',
              text: 'Expandable link group',
              href: '#something',
              items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
            },
          ],
        });

        wrapper.findItemByIndex(1)!.findLink()!.click();

        expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
      });

      it('gets collapsed when clicking on expand icon', () => {
        const wrapper = renderSideNavigation({
          items: [
            {
              type: 'expandable-link-group',
              text: 'Expandable link group',
              href: '#something',
              items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
            },
          ],
        });

        wrapper.findItemByIndex(1)!.findLink()!.click();

        wrapper.findItemByIndex(1)!.findExpandableLinkGroup()!.findExpandIcon()!.click();

        expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).not.toBeTruthy();
      });

      it('gets expanded again when clicking again on link after collapsing through icon', () => {
        const wrapper = renderSideNavigation({
          items: [
            {
              type: 'expandable-link-group',
              text: 'Expandable link group',
              href: '#something',
              items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
            },
          ],
        });

        wrapper.findItemByIndex(1)!.findLink()!.click();

        wrapper.findItemByIndex(1)!.findExpandableLinkGroup()!.findExpandIcon()!.click();

        wrapper.findItemByIndex(1)!.findLink()!.click();

        expect(wrapper.findItemByIndex(1)?.findExpandableLinkGroup()?.findExpandedContent()).toBeTruthy();
      });

      it('triggers onChange', () => {
        const onChange = jest.fn();
        const wrapper = renderSideNavigation({
          onChange,
          items: [
            {
              type: 'expandable-link-group',
              text: 'Expandable link group',
              href: '#something',
              items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
            },
          ],
        });

        wrapper.findItemByIndex(1)!.findLink()!.click();

        expect(onChange).toHaveBeenCalled();
      });

      it('triggers onChange with the correct detail object', () => {
        const onChange = jest.fn();
        const items: SideNavigationProps.Item[] = [
          {
            type: 'expandable-link-group',
            text: 'Expandable link group',
            href: '#something',
            items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
          },
        ];
        const wrapper = renderSideNavigation({ onChange, items });

        wrapper.findItemByIndex(1)!.findLink()!.click();

        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              item: items[0],
              expanded: true,
              expandableParents: [],
            },
          })
        );
      });

      it('triggers onChange only when expansion state is changed', () => {
        const onChange = jest.fn();
        const wrapper = renderSideNavigation({
          onChange,
          items: [
            {
              type: 'expandable-link-group',
              text: 'Expandable link group',
              href: '#something',
              defaultExpanded: true,
              items: [{ type: 'link', text: 'Page 1', href: '#nested-content' }],
            },
          ],
        });
        const firstLink = wrapper.findItemByIndex(1)!.findLink()!;
        firstLink.click();
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('click event', () => {
    const baseProps = {
      header: { text: 'Console', href: '#1' },
      items: [
        {
          type: 'section',
          text: 'Section',
          defaultExpanded: true,
          items: [{ type: 'link', text: 'Page 1', href: '#2' }],
        } as SideNavigationProps.Section,
        {
          type: 'link-group',
          text: 'Link Group',
          href: '#3',
          items: [
            { type: 'link', text: 'Page 1', href: '#4' },
            { type: 'link', text: 'Page 2', href: '#5' },
          ],
        } as SideNavigationProps.LinkGroup,
        {
          type: 'expandable-link-group',
          text: 'Expandable Link Group',
          href: '#6',
          items: [
            { type: 'link', text: 'Page 1', href: '#7' },
            { type: 'link', text: 'Page 2', href: '#8' },
          ],
        } as SideNavigationProps.ExpandableLinkGroup,
      ],
    } as const;

    it('triggers the onFollow handler correctly', () => {
      const onFollow = jest.fn();
      const wrapper = renderSideNavigation({ ...baseProps, onFollow });
      wrapper.findAll('a').forEach(anchor => anchor.click());
      const hrefsInDetail = onFollow.mock.calls.map(([event]) => event.detail.href);
      expect(hrefsInDetail).toEqual(['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8']);
    });

    it('does not trigger the onFollow handler when clicked with a special key', () => {
      const onFollow = jest.fn();
      const wrapper = renderSideNavigation({ ...baseProps, onFollow });
      ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(specialKey => {
        wrapper.findAll('a').forEach(anchor => anchor.click({ [specialKey]: true }));
      });
      expect(onFollow).not.toHaveBeenCalled();
    });

    it('contains an original definition of a clicked item in the follow detail object', () => {
      const onFollow = jest.fn();
      const wrapper = renderSideNavigation({ ...baseProps, onFollow });

      wrapper.findAll('a').forEach(anchor => anchor.click());

      const expectedItems = [
        baseProps.header,
        ...baseProps.items,
        ...baseProps.items[0].items,
        ...baseProps.items[1].items,
        ...baseProps.items[2].items,
      ];

      onFollow.mock.calls.forEach(([event]) => {
        expect(expectedItems).toContain(event.detail);
      });
    });

    it('calls preventDefault on the link click event if onFollow is prevented', () => {
      const wrapper = renderSideNavigation({ ...baseProps, onFollow: e => e.preventDefault() });
      const innerLinks = wrapper.findAll('a');
      const sourceEvents: MouseEvent[] = [];

      innerLinks.forEach(wrapper => {
        wrapper.getElement().addEventListener('click', e => sourceEvents.push(e));
      });

      innerLinks.forEach(wrapper => wrapper.click());

      expect(sourceEvents.every(e => e.defaultPrevented)).toBeTruthy();
    });
  });

  describe('Logo', () => {
    it('renders small logo when text is defined', () => {
      const wrapper = renderSideNavigation({
        items: [],
        header: { text: 'Header text', logo: { src: '/logo.svg', alt: 'logo' }, href: '#1' },
      });

      expect(wrapper.findHeaderLink()!.getElement()).toHaveTextContent('Header text');

      const logo = wrapper.findHeaderLink()!.findByClassName(styles['header-logo'])!.getElement();
      expect(logo).not.toBeNull();
      expect(logo).toHaveAttribute('src', '/logo.svg');
      expect(logo).toHaveAttribute('alt', 'logo');

      expect(wrapper.findByClassName(styles['header-logo--stretched'])).toBeNull();
    });

    it('renders large logo when no text is defined', () => {
      const wrapper = renderSideNavigation({
        items: [],
        header: { logo: { src: '/logo.svg', alt: 'logo' }, href: '#1' },
      });

      expect(wrapper.findHeaderLink()!.getElement()).toHaveTextContent('');

      const logo = wrapper.findHeaderLink()!.findByClassName(styles['header-logo--stretched'])!.getElement();
      expect(logo).not.toBeNull();
      expect(logo).toHaveAttribute('src', '/logo.svg');
      expect(logo).toHaveAttribute('alt', 'logo');
    });
  });
});

describe('URL sanitization', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    consoleWarnSpy?.mockRestore();
    consoleErrorSpy?.mockRestore();
  });

  describe('for the header', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderSideNavigation({
        items: [],
        header: { href: 'javascript:void(0)' },
      });
      expect(element.findHeaderLink()!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderSideNavigation({
          items: [],
          header: { href: "javascript:alert('Hello from the header!')" },
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [SideNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from the header!')".`
      );
    });
  });

  describe('for a link', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderSideNavigation({
        items: [{ type: 'link', href: 'javascript:void(0)', text: 'test' }],
      });
      expect((element.findItemByIndex(1)!.find('a')!.getElement() as HTMLAnchorElement).href).toBe(
        'javascript:void(0)'
      );
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderSideNavigation({
          items: [{ type: 'link', href: "javascript:alert('Hello from a link!')", text: 'test' }],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [SideNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a link!')".`
      );
    });
  });

  describe('for a link group', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderSideNavigation({
        items: [{ type: 'link-group', href: 'javascript:void(0)', text: 'test', items: [] }],
      });
      expect((element.findItemByIndex(1)!.find('a')!.getElement() as HTMLAnchorElement).href).toBe(
        'javascript:void(0)'
      );
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderSideNavigation({
          items: [
            { type: 'link-group', href: "javascript:alert('Hello from a link group!')", text: 'test', items: [] },
          ],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [SideNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a link group!')".`
      );
    });
  });
});
