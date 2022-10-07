// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';

function renderExpandableSection(props: ExpandableSectionProps = {}): ExpandableSectionWrapper {
  const { container } = render(<ExpandableSection {...props} />);
  return createWrapper(container).findExpandableSection()!;
}

describe('Expandable Section', () => {
  describe('variant property', () => {
    test('has one trigger button and no div=[role=button] for variant navigation', () => {
      const wrapper = renderExpandableSection({ variant: 'navigation' });
      expect(wrapper.findAll('button').length).toBe(1);
      expect(wrapper.findAll('div[role=button]').length).toBe(0);
    });
    test('has no trigger button and div=[role=button] for variant container', () => {
      const wrapper = renderExpandableSection({ variant: 'container' });
      expect(wrapper.findAll('div[role=button]').length).toBe(1);
      expect(wrapper.findAll('button').length).toBe(0);
    });
    test('has no trigger button and div=[role=button] for variant footer', () => {
      const wrapper = renderExpandableSection({ variant: 'footer' });
      expect(wrapper.findAll('div[role=button]').length).toBe(1);
      expect(wrapper.findAll('button').length).toBe(0);
    });
  });
  describe('slots', () => {
    test('populates header slot correctly', () => {
      const wrapper = renderExpandableSection({
        header: 'Test Header',
      });
      const header = wrapper.findHeader().getElement();
      expect(header).toHaveTextContent('Test Header');
    });
    test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'container', 'navigation'])(
      'populates content slot correctly for "%s" variant',
      variant => {
        const wrapper = renderExpandableSection({
          defaultExpanded: true,
          children: 'Example content',
          variant: variant,
        });
        const expandedContent = wrapper.findExpandedContent()?.getElement();
        expect(expandedContent).toHaveTextContent('Example content');
      }
    );
    test('populates content slot correctly', () => {
      const wrapper = renderExpandableSection({
        defaultExpanded: true,
        children: 'Example content',
      });
      const expandedContent = wrapper.findExpandedContent()?.getElement();
      expect(expandedContent).toHaveTextContent('Example content');
    });
  });
  describe('expanded property', () => {
    test('shows content region when true', () => {
      const wrapper = renderExpandableSection({
        expanded: true,
        children: 'Example content',
      });
      const expandedContent = wrapper.findExpandedContent()?.getElement();
      expect(expandedContent).toBeInTheDocument();
      expect(expandedContent).toHaveTextContent('Example content');
    });
    test('hides content region when false', () => {
      const wrapper = renderExpandableSection();
      const expandedContent = wrapper.findExpandedContent()?.getElement();
      expect(expandedContent).toBeFalsy();
    });
    test('uses a div with role "button" as trigger', () => {
      const wrapper = renderExpandableSection();
      const header = wrapper.findHeader().getElement();
      expect(header.tagName).toBe('DIV');
      expect(header.getAttribute('role')).toBe('button');
    });
    test('icon is focusable in navigation variant', () => {
      const wrapper = renderExpandableSection({ variant: 'navigation' });
      const header = wrapper.findHeader().getElement();
      const icon = wrapper.findExpandIcon().getElement();
      expect(header.tagName).not.toBe('div[role=button]');
      expect(header).not.toHaveAttribute('tabindex', '0');
      expect(icon.tagName).toBe('BUTTON');
    });
  });
  describe('defaultExpanded', () => {
    test('shows content region when true', () => {
      const wrapper = renderExpandableSection({
        defaultExpanded: true,
        children: 'Example content',
      });
      const expandedContent = wrapper.findExpandedContent()?.getElement();
      expect(expandedContent).toBeInTheDocument();
      expect(expandedContent).toHaveTextContent('Example content');
    });
  });
  describe('a11y', () => {
    test('content region is labelled by header', () => {
      const wrapper = renderExpandableSection();
      const header = wrapper.findHeader().getElement();
      const expandedContent = wrapper.findContent().getElement();
      const contentId = expandedContent?.getAttribute('id');
      expect(header).toHaveAttribute('aria-controls', contentId);
    });
    test('aria-expanded=false when collapsed', () => {
      const wrapper = renderExpandableSection();
      const header = wrapper.findHeader().getElement();
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });
    test('aria-expanded=true when expanded', () => {
      const wrapper = renderExpandableSection({
        defaultExpanded: true,
      });
      const header = wrapper.findHeader().getElement();
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    test('can assign a different label to the header', () => {
      const wrapper = renderExpandableSection({
        headerAriaLabel: 'ARIA Label',
      });
      const header = wrapper.findHeader().getElement();
      const content = wrapper.findContent().getElement();
      expect(header).toHaveAttribute('aria-label', 'ARIA Label');
      expect(content).toHaveAttribute('aria-label', 'ARIA Label');
    });
  });

  describe('focus', () => {
    test('can be focused through the API', () => {
      let expandableSection: ExpandableSectionProps.Ref | null = null;
      const renderResult = render(<ExpandableSection ref={el => (expandableSection = el)} />);
      const wrapper = createWrapper(renderResult.container);
      expandableSection!.focus();
      expect(document.activeElement).toBe(wrapper.findExpandableSection()?.findHeader()!.getElement());
    });
  });
});
