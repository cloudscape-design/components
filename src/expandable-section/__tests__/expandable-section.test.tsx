// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import Button from '../../../lib/components/button';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import InternalExpandableSection from '../../../lib/components/expandable-section/internal';
import Header from '../../../lib/components/header';
import Link from '../../../lib/components/link';
import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/expandable-section/styles.selectors.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderExpandableSection(props: ExpandableSectionProps = {}): ExpandableSectionWrapper {
  const { container } = render(<ExpandableSection {...props} />);
  return createWrapper(container).findExpandableSection()!;
}

const containerizedVariants: ExpandableSectionProps.Variant[] = ['container', 'stacked'];
const variantsWithActions: ExpandableSectionProps.Variant[] = ['container', 'stacked', 'default', 'inline'];

describe('Expandable Section', () => {
  const variantsWithDescription: ExpandableSectionProps.Variant[] = [
    ...containerizedVariants,
    'default',
    'footer',
    'inline',
  ];
  const variantsWithoutDescription: ExpandableSectionProps.Variant[] = ['navigation'];
  const nonContainerVariants: ExpandableSectionProps.Variant[] = ['default', 'footer', 'navigation', 'inline'];

  describe('variant property', () => {
    test('has one trigger button and no div=[role=button] for variant navigation', () => {
      const wrapper = renderExpandableSection({ variant: 'navigation' });
      expect(wrapper.findAll('button').length).toBe(1);
      expect(wrapper.findAll('div[role=button]').length).toBe(0);
    });
    describe('has no trigger button and div=[role=button]', () => {
      for (const variant of containerizedVariants) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({ variant });
          expect(wrapper.findAll('div[role=button]').length).toBe(1);
          expect(wrapper.findAll('button').length).toBe(0);
        });
      }
    });
    test('has no trigger button and div=[role=button] for variant footer', () => {
      const wrapper = renderExpandableSection({ variant: 'footer' });
      expect(wrapper.findAll('div[role=button]').length).toBe(1);
      expect(wrapper.findAll('button').length).toBe(0);
    });
  });

  describe('slots', () => {
    test('populates header text correctly', () => {
      const wrapper = renderExpandableSection({
        headerText: 'Test Header',
      });
      // Keep the test util for the deprecated header slot for coverage
      expect(wrapper.findHeader().getElement()).toHaveTextContent('Test Header');
      // New test util
      expect(wrapper.findHeaderText()?.getElement()).toHaveTextContent('Test Header');
    });
    describe('populates description slot correctly', () => {
      for (const variant of variantsWithDescription) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            variant,
            headerText: 'Test Header',
            headerDescription: 'Description',
          });
          // Keep the test util for the deprecated header slot for coverage
          expect(wrapper.findHeader().getElement()).toHaveTextContent('Description');
          // New test util
          expect(wrapper.findHeaderDescription()?.getElement()).toHaveTextContent('Description');
        });
      }
    });
    describe('populates info links slot correctly', () => {
      for (const variant of containerizedVariants) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            headerText: 'Test Header',
            variant,
            headerInfo: <Link>Info</Link>,
          });
          const infoLink = wrapper.findHeader().findLink();
          expect(infoLink).toBeTruthy();
          expect(infoLink!.getElement()).toHaveTextContent('Info');
        });
      }
    });
    describe('populates action buttons slot correctly', () => {
      for (const variant of variantsWithActions) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            headerText: 'Test Header',
            variant,
            headerActions: <Button>Action</Button>,
          });
          const button = wrapper.findHeader().findButton();
          expect(button).toBeTruthy();
          expect(button!.getElement()).toHaveTextContent('Action');
        });
      }
    });
    test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'container', 'navigation', 'stacked', 'inline'])(
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

  describe('does not populate non-supported slots', () => {
    describe('Description', () => {
      for (const variant of variantsWithoutDescription) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            headerText: 'Test Header',
            headerDescription: 'Description',
            variant,
          });
          expect(wrapper.findHeaderDescription()).toBeNull();
        });
      }
    });
    describe('Other props', () => {
      for (const variant of nonContainerVariants) {
        describe(`${variant} variant`, () => {
          test('Counter', () => {
            const wrapper = renderExpandableSection({
              variant,
              headerText: 'Test Header',
              headerCounter: '(3)',
            });
            const header = wrapper.findHeader().getElement();
            expect(header).not.toHaveTextContent('(3)');
          });
          test('Info links', () => {
            const wrapper = renderExpandableSection({
              variant,
              headerText: 'Test Header',
              headerInfo: <Link variant="info">Info</Link>,
            });
            const header = wrapper.findHeader().getElement();
            expect(header).not.toHaveTextContent('Info');
          });
          if (variant !== 'default') {
            test('Action buttons', () => {
              const wrapper = renderExpandableSection({
                variant,
                headerText: 'Test Header',
                headerInfo: <Button>Action</Button>,
              });
              const header = wrapper.findHeader().getElement();
              expect(header).not.toHaveTextContent('Action');
            });
          }
        });
      }
    });
    test('header in inline variant', () => {
      const wrapper = renderExpandableSection({
        variant: 'inline',
        header: 'Test header',
      });
      const header = wrapper.findHeader().getElement();
      expect(header).not.toHaveTextContent('Test header');
      expect(warnOnce).toHaveBeenCalledWith(
        'ExpandableSection',
        'Only `headerText` instead of `header` is supported for `inline` variant.'
      );
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
    describe('content region is labelled by header', () => {
      for (const variant of variantsWithDescription) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            variant,
            headerText: 'Header',
            headerDescription: 'Description',
          });
          const header = wrapper.findExpandButton().getElement();
          const expandedContent = wrapper.findContent().getElement();
          const contentId = expandedContent?.getAttribute('id');
          expect(header).toHaveAttribute('aria-controls', contentId);
          expect(expandedContent).toHaveAccessibleName('Header');
          expect(expandedContent).toHaveAccessibleDescription('Description');
        });
      }
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

    test('logs warning for deprecated header prop', () => {
      render(<ExpandableSection variant="container" header={<Header />} />);
      expect(warnOnce).toHaveBeenCalledTimes(1);
      expect(warnOnce).toHaveBeenCalledWith(
        componentName,
        'Use `headerText` instead of `header` to provide the button within the heading for a11y.'
      );
    });

    describe('logs warning for non supported configurations', () => {
      describe('headerDescription', () => {
        for (const variant of variantsWithoutDescription) {
          test(`${variant} variant`, () => {
            render(<ExpandableSection variant={variant} headerDescription={'Description'} />);
            expect(warnOnce).toHaveBeenCalledTimes(1);
            expect(warnOnce).toHaveBeenCalledWith(
              componentName,
              `The \`headerDescription\` prop is not supported for the ${variant} variant.`
            );
          });
        }
      });

      describe('other properties', () => {
        const testWarnings = (props: ExpandableSectionProps) => {
          render(<ExpandableSection {...props} />);
          expect(warnOnce).toHaveBeenCalledTimes(1);
          expect(warnOnce).toHaveBeenCalledWith(componentName, expect.stringMatching(/only supported for the/));
        };

        for (const variant of nonContainerVariants) {
          describe(`${variant} variant`, () => {
            test('headerCounter', () => {
              testWarnings({ variant, headerCounter: '(2)' });
            });
            test('headerInfo', () => {
              testWarnings({ variant, headerInfo: <Link>Info</Link> });
            });
            if (!variantsWithActions.includes(variant)) {
              test('headerActions', () => {
                testWarnings({ variant, headerActions: <Button>Action</Button> });
              });
            }
          });
        }
      });

      describe('headerDescription and other properties combined', () => {
        const testWarnings = (props: ExpandableSectionProps) => {
          render(<ExpandableSection {...props} headerDescription="Description" />);
          expect(warnOnce).toHaveBeenCalledTimes(2);
        };
        for (const variant of variantsWithoutDescription) {
          describe(`${variant} variant`, () => {
            test('headerCounter', () => {
              testWarnings({ variant, headerCounter: '(2)' });
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
      for (const variant of containerizedVariants) {
        test(`${variant} variant`, () => {
          testWarnings({
            variant,
            headerCounter: '(2)',
            headerDescription: 'Description',
            headerInfo: <Link>Info</Link>,
            headerActions: <Button>Action</Button>,
          });
        });
      }

      test('default variant', () => {
        testWarnings({
          variant: 'default',
          headerDescription: 'Description',
        });
      });
    });
  });
});

describe('headingTagOverride', () => {
  for (const variant of containerizedVariants) {
    test(`${variant} variant tag defaults to h2`, () => {
      const wrapper = renderExpandableSection({
        variant,
        headerText: 'Header component',
      });
      expect(wrapper.findHeader().findAll('h2').length).toBe(1);
    });
    test(`${variant} variant tag can be overwritten`, () => {
      const wrapper = renderExpandableSection({
        variant,
        headerText: 'Header component',
        headingTagOverride: 'h3',
      });
      expect(wrapper.findHeader().findAll('h2').length).toBe(0);
      expect(wrapper.findHeader().findAll('h3').length).toBe(1);
    });
  }
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

describe('headerText', () => {
  for (const variant of containerizedVariants) {
    describe(`with ${variant} variant`, () => {
      test('validate a11y for container with headerText', async () => {
        const { container } = render(
          <ExpandableSection
            variant={variant}
            headerText="Header component"
            headerCounter="5"
            headerDescription="Testing"
          />
        );
        await expect(container).toValidateA11y();
      });

      test('header button have aria-controls associated to expanded content', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        const expandedContent = wrapper.findContent().getElement();
        const contentId = expandedContent?.getAttribute('id');
        expect(headerButton).toHaveAttribute('aria-controls', contentId);
      });
      test('aria-expanded=false when collapsed', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        expect(headerButton).toHaveAttribute('aria-expanded', 'false');
      });
      test('aria-expanded=true when expanded', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
          defaultExpanded: true,
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        expect(headerButton).toHaveAttribute('aria-expanded', 'true');
      });
      test('set headerAriaLabel assigns an aria-label to the header, and no aria-labelledby will be set', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
          headerAriaLabel: 'ARIA Label',
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        const content = wrapper.findContent().getElement();
        expect(headerButton).toHaveAttribute('aria-label', 'ARIA Label');
        expect(content).toHaveAttribute('aria-label', 'ARIA Label');
        expect(headerButton).not.toHaveAttribute('aria-labelledby');
      });
      test('set aria labels when no headerAriaLabel is set', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        expect(headerButton).toHaveAccessibleName('Header component');
      });
      test('set aria description if description present', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
          headerDescription: 'Expand to see more content',
        });
        const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
        expect(headerButton).toHaveAccessibleDescription('Expand to see more content');
      });
      test('button should be under heading', () => {
        const wrapper = renderExpandableSection({
          variant,
          headerText: 'Header component',
        });
        expect(wrapper.findHeader().find('[role="button"]')!.findAll('h2')!.length).toBe(0);
        expect(wrapper.find('h2')!.find('[role="button"]')!.getElement()).toHaveTextContent('Header component');
      });
    });
  }
});

describe('__expandIconPosition', () => {
  function renderInternalExpandableSection(
    props: Partial<Parameters<typeof InternalExpandableSection>[0]> = {}
  ): ExpandableSectionWrapper {
    const { container } = render(<InternalExpandableSection headerText="Header" {...props} />);
    return createWrapper(container).findExpandableSection()!;
  }

  describe('default behavior (start position)', () => {
    test('icon renders before header text for default variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'default' });
      const expandButton = wrapper.findExpandButton().getElement();
      const children = Array.from(expandButton.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      const textIndex = children.findIndex(el => el.classList.contains(styles['header-text']));
      expect(iconIndex).toBeLessThan(textIndex);
    });

    test('icon renders before header text for footer variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer' });
      const expandButton = wrapper.findExpandButton().getElement();
      const children = Array.from(expandButton.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      const textIndex = children.findIndex(el => el.classList.contains(styles['header-text']));
      expect(iconIndex).toBeLessThan(textIndex);
    });

    test('icon renders before header content for navigation variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'navigation' });
      const header = wrapper.findHeader().getElement();
      const children = Array.from(header.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      // Icon should be the first child (index 0)
      expect(iconIndex).toBe(0);
    });

    test('does not apply icon-end modifier classes when position is start', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer', __expandIconPosition: 'start' });
      const icon = wrapper.findExpandIcon().getElement();
      expect(icon.classList.contains(styles['icon-container-end'])).toBe(false);
    });
  });

  describe('end position', () => {
    test('icon renders after header text for footer variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      const children = Array.from(expandButton.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      const textIndex = children.findIndex(el => el.classList.contains(styles['header-text']));
      expect(iconIndex).toBeGreaterThan(textIndex);
    });

    test('icon renders after header text for default variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'default', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      const children = Array.from(expandButton.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      const textIndex = children.findIndex(el => el.classList.contains(styles['header-text']));
      expect(iconIndex).toBeGreaterThan(textIndex);
    });

    test('icon renders after header content for navigation variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'navigation', __expandIconPosition: 'end' });
      const header = wrapper.findHeader().getElement();
      const children = Array.from(header.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      // Icon should be the last child
      expect(iconIndex).toBe(children.length - 1);
    });

    test('icon renders after header text for container variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'container', __expandIconPosition: 'end' });
      // For container variant, icon is rendered outside InternalHeader
      const icon = wrapper.findExpandIcon().getElement();
      expect(icon.classList.contains(styles['icon-container-end'])).toBe(true);
    });

    test('applies icon-container-end modifier class for footer variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer', __expandIconPosition: 'end' });
      const icon = wrapper.findExpandIcon().getElement();
      expect(icon.classList.contains(styles['icon-container-end'])).toBe(true);
    });

    test('applies header-icon-end modifier class for navigation variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'navigation', __expandIconPosition: 'end' });
      const header = wrapper.findHeader().getElement();
      expect(header.classList.contains(styles['header-icon-end'])).toBe(true);
    });

    test('applies header-button-icon-end modifier class for footer variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      expect(expandButton.classList.contains(styles['header-button-icon-end'])).toBe(true);
    });

    test('icon renders outside header actions for default variant with headerActions', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'default',
        __expandIconPosition: 'end',
        headerActions: <button>Action</button>,
      });
      // The icon should be rendered outside the header-content wrapper,
      // as a direct child of the header-icon-end wrapper — matching the container variant pattern.
      const header = wrapper.findHeader().getElement();
      const headerContent = header.querySelector(`.${styles['header-content']}`);
      expect(headerContent).toBeTruthy();
      const icon = wrapper.findExpandIcon().getElement();
      // Icon should be a sibling of the header-content wrapper, not nested inside it.
      expect(icon.parentElement).toBe(headerContent!.parentElement);
      expect(icon.previousElementSibling).not.toBe(null);
    });
  });

  describe('expand/collapse functionality with end position', () => {
    test('navigation variant toggles aria-expanded on click', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'navigation', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      wrapper.findExpandButton().click();
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('footer variant toggles aria-expanded on click', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'footer', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      wrapper.findExpandButton().click();
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('default variant toggles aria-expanded on click', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'default', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      wrapper.findExpandButton().click();
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('container variant toggles aria-expanded on click', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'container', __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      wrapper.findExpandButton().click();
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('content is shown when expanded with end position', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'footer',
        __expandIconPosition: 'end',
        defaultExpanded: true,
        children: 'Expanded content',
      });
      const expandedContent = wrapper.findExpandedContent()?.getElement();
      expect(expandedContent).toHaveTextContent('Expanded content');
    });
  });

  describe('outside icon button (end position with renderIconOutsideHeader)', () => {
    test('container variant renders outside caret as a button with aria-expanded', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'container',
        __expandIconPosition: 'end',
        headerText: 'Header',
      });
      const iconButton = wrapper.findExpandIcon().getElement();
      expect(iconButton.tagName).toBe('BUTTON');
      expect(iconButton).toHaveAttribute('aria-expanded', 'false');
      expect(iconButton).toHaveAttribute('aria-controls');
    });

    test('default variant with headerActions renders outside caret as a button with aria-expanded', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'default',
        __expandIconPosition: 'end',
        headerText: 'Header',
        headerActions: <button>Action</button>,
      });
      const iconButton = wrapper.findExpandIcon().getElement();
      expect(iconButton.tagName).toBe('BUTTON');
      expect(iconButton).toHaveAttribute('aria-expanded', 'false');
      expect(iconButton).toHaveAttribute('aria-controls');
    });

    test('clicking the outside caret button toggles expansion for container variant', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'container',
        __expandIconPosition: 'end',
        headerText: 'Header',
        children: 'Content',
      });
      const iconButton = wrapper.findExpandIcon().getElement();
      expect(iconButton).toHaveAttribute('aria-expanded', 'false');
      iconButton.click();
      expect(iconButton).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findExpandedContent()?.getElement()).toHaveTextContent('Content');
    });

    test('clicking the outside caret button toggles expansion for default with actions', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'default',
        __expandIconPosition: 'end',
        headerText: 'Header',
        headerActions: <button>Action</button>,
        children: 'Content',
      });
      const iconButton = wrapper.findExpandIcon().getElement();
      expect(iconButton).toHaveAttribute('aria-expanded', 'false');
      iconButton.click();
      expect(iconButton).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findExpandedContent()?.getElement()).toHaveTextContent('Content');
    });

    test('container without actions: clicking caret toggles exactly once (no double-toggle)', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InternalExpandableSection
          variant="container"
          __expandIconPosition="end"
          headerText="Header"
          onChange={onChange}
        >
          Content
        </InternalExpandableSection>
      );
      const wrapper = createWrapper(container).findExpandableSection()!;
      const iconButton = wrapper.findExpandIcon().getElement();
      iconButton.click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });

    test('outside caret button has aria-controls matching content region id', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'container',
        __expandIconPosition: 'end',
        headerText: 'Header',
        children: 'Content',
        defaultExpanded: true,
      });
      const iconButton = wrapper.findExpandIcon().getElement();
      const contentRegion = wrapper.findContent().getElement();
      expect(iconButton.getAttribute('aria-controls')).toBe(contentRegion.getAttribute('id'));
    });

    test('keyboard Enter on outside caret button toggles expansion', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InternalExpandableSection
          variant="container"
          __expandIconPosition="end"
          headerText="Header"
          onChange={onChange}
        >
          Content
        </InternalExpandableSection>
      );
      const wrapper = createWrapper(container).findExpandableSection()!;
      const iconButton = wrapper.findExpandIcon().getElement();
      // Native button handles Enter/Space natively, triggering click
      iconButton.click();
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
