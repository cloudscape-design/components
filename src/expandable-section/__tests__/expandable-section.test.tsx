// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import Button from '../../../lib/components/button';
import Header from '../../../lib/components/header';
import Link from '../../../lib/components/link';
import { warnOnce } from '../../../lib/components/internal/logging';
import '../../__a11y__/to-validate-a11y';

jest.mock('../../../lib/components/internal/logging', () => ({
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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
        headerText: 'Test Header',
      });
      const header = wrapper.findHeader().getElement();
      expect(header).toHaveTextContent('Test Header');
    });
    test('populates info links slot correctly for "container" variant', () => {
      const wrapper = renderExpandableSection({
        headerText: 'Test Header',
        variant: 'container',
        headerInfo: <Link>Info</Link>,
      });
      const infoLink = wrapper.findHeader().findLink();
      expect(infoLink).toBeTruthy();
      expect(infoLink!.getElement()).toHaveTextContent('Info');
    });
    test('populates action buttons slot correctly for "container" variant', () => {
      const wrapper = renderExpandableSection({
        headerText: 'Test Header',
        variant: 'container',
        headerActions: <Button>Action</Button>,
      });
      const button = wrapper.findHeader().findButton();
      expect(button).toBeTruthy();
      expect(button!.getElement()).toHaveTextContent('Action');
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

  describe('dev warnings', () => {
    const componentName = 'ExpandableSection';
    const nonContainerVariants: ExpandableSectionProps.Variant[] = ['default', 'footer', 'navigation'];

    test('logs warning for deprecated header prop', () => {
      render(<ExpandableSection variant="container" header={<Header />} />);
      expect(warnOnce).toHaveBeenCalledTimes(1);
      expect(warnOnce).toHaveBeenCalledWith(
        componentName,
        'Use `headerText` instead of `header` to provide the button within the heading for a11y.'
      );
    });

    describe('logs warning for non supported configurations', () => {
      const testWarnings = (props: ExpandableSectionProps) => {
        render(<ExpandableSection {...props} />);
        expect(warnOnce).toHaveBeenCalledTimes(1);
        expect(warnOnce).toHaveBeenCalledWith(
          componentName,
          'The `headerCounter`, `headerDescription`, `headerInfo` and `headerActions` props are only supported for the "container" variant.'
        );
      };

      for (const variant of nonContainerVariants) {
        describe(`${variant} variant`, () => {
          test('headerCounter', () => {
            testWarnings({ variant, headerCounter: '(2)' });
          });
          test('headerCounter', () => {
            testWarnings({ variant, headerDescription: 'Description' });
          });
          test('headerInfo', () => {
            testWarnings({ variant, headerInfo: <Link>Info</Link> });
          });
          test('headerActions', () => {
            testWarnings({ variant, headerActions: <Button>Action</Button> });
          });
        });
      }
    });

    describe('does not log warning for supported configurations', () => {
      const testWarnings = (props: ExpandableSectionProps) => {
        render(<ExpandableSection {...props} />);
        expect(warnOnce).not.toHaveBeenCalled();
      };

      for (const variant of nonContainerVariants) {
        test(`${variant} variant`, () => {
          testWarnings({ variant });
        });
      }

      test('container variant', () => {
        testWarnings({
          variant: 'container',
          headerCounter: '(2)',
          headerDescription: 'Description',
          headerInfo: <Link>Info</Link>,
          headerActions: <Button>Action</Button>,
        });
      });
    });
  });
});

describe('headingTagOverride', () => {
  test('container variant tag defaults to h2', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
    });
    expect(wrapper.findHeader().findAll('h2').length).toBe(1);
  });
  test('container variant tag can be overwritten', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
      headingTagOverride: 'h3',
    });
    expect(wrapper.findHeader().findAll('h2').length).toBe(0);
    expect(wrapper.findHeader().findAll('h3').length).toBe(1);
  });
  for (const variant of ['default', 'footer']) {
    describe.each<ExpandableSectionProps.Variant>(['default', 'footer'])(`variant: ${variant}`, variant => {
      test('tag defaults to div', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
        });
        expect(wrapper.findHeader().findAll('h1,h2,h3,h4,h5,h6').length).toBe(0);
      });
      test('default variant tag can be overwritten', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
          headingTagOverride: 'h3',
        });
        expect(wrapper.findHeader().findAll('h3').length).toBe(1);
      });
    });
  }
});

describe('Variant container with headerText', () => {
  test('validate a11y for container with headerText', async () => {
    const { container } = render(
      <ExpandableSection
        variant="container"
        headerText="Header component"
        headerCounter="5"
        headerDescription="Testing"
      />
    );
    await expect(container).toValidateA11y();
  });

  test('header button have aria-controls associated to expanded content', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    const expandedContent = wrapper.findContent().getElement();
    const contentId = expandedContent?.getAttribute('id');
    expect(headerButton).toHaveAttribute('aria-controls', contentId);
  });
  test('aria-expanded=false when collapsed', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');
  });
  test('aria-expanded=true when expanded', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
      defaultExpanded: true,
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    expect(headerButton).toHaveAttribute('aria-expanded', 'true');
  });
  test('set headerAriaLabel assigns an aria-label to the header, and no aria-labelledby will be set', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
      headerAriaLabel: 'ARIA Label',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    const content = wrapper.findContent().getElement();
    expect(headerButton).toHaveAttribute('aria-label', 'ARIA Label');
    expect(content).toHaveAttribute('aria-label', 'ARIA Label');
    expect(headerButton).not.toHaveAttribute('aria-labelledby');
  });
  test('set aria-labelledby when no headerAriaLabel is set', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
      headerCounter: '(5)',
      headerDescription: 'Expand to see more content',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement()!.getAttribute('aria-labelledby');
    const screenreaderElement = wrapper.findHeader().find(`#${headerButton}`)!.getElement();
    expect(screenreaderElement.textContent).toBe('Header component (5) Expand to see more content');
  });
  test('does not set aria-labelledby for default variant', () => {
    const wrapper = renderExpandableSection({
      variant: 'default',
      headerText: 'Header component',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    expect(headerButton).not.toHaveAttribute('aria-labelledby');
  });
  test('button should be under heading', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
    });
    expect(wrapper.findHeader().find('[role="button"]')!.findAll('h2')!.length).toBe(0);
    expect(wrapper.find('h2')!.find('[role="button"]')!.getElement()).toHaveTextContent('Header component');
  });
});
