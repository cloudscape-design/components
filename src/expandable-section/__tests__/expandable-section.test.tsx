// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

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
    test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'navigation', 'container', 'stacked', 'inline'])(
      '%s variant has aria-expanded=false when collapsed',
      variant => {
        const wrapper = renderExpandableSection({ variant, headerText: 'Header' });
        expect(wrapper.findExpandButton().getElement()).toHaveAttribute('aria-expanded', 'false');
      }
    );
    test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'navigation', 'container', 'stacked', 'inline'])(
      '%s variant has aria-expanded=true when expanded',
      variant => {
        const wrapper = renderExpandableSection({ variant, headerText: 'Header', defaultExpanded: true });
        expect(wrapper.findExpandButton().getElement()).toHaveAttribute('aria-expanded', 'true');
      }
    );

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
    test.each(['default', 'footer'] as const)('icon renders before header text for %s variant', variant => {
      const wrapper = renderInternalExpandableSection({ variant });
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
  });

  describe('end position', () => {
    test.each(['footer', 'default'] as const)('icon renders after header text for %s variant', variant => {
      const wrapper = renderInternalExpandableSection({ variant, __expandIconPosition: 'end' });
      const expandButton = wrapper.findExpandButton().getElement();
      const children = Array.from(expandButton.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      const textIndex = children.findIndex(el => el.classList.contains(styles['header-text']));
      expect(iconIndex).toBeGreaterThan(textIndex);
    });

    test('icon renders after header content for navigation variant', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'navigation', __expandIconPosition: 'end' });
      const header = wrapper.findHeader().getElement();
      // Header wrapper should have the icon-end modifier
      expect(header.classList.contains(styles['header-icon-end'])).toBe(true);
      // Icon should be the last child
      const children = Array.from(header.children);
      const iconIndex = children.findIndex(el => el.classList.contains(styles['icon-container']));
      expect(iconIndex).toBe(children.length - 1);
    });

    test('container variant positions caret outside header wrapper (as separate sibling element)', () => {
      const wrapper = renderInternalExpandableSection({ variant: 'container', __expandIconPosition: 'end' });
      const icon = wrapper.findExpandIcon().getElement();
      const expandButton = wrapper.findExpandButton().getElement();
      // Icon should NOT be a descendant of the expand-button wrapper
      expect(expandButton.contains(icon)).toBe(false);
      // Icon is a sibling of the internal header content, both inside the same header row
      const headerRow = wrapper.findHeader().getElement();
      expect(headerRow.contains(icon)).toBe(true);
      expect(headerRow.contains(expandButton)).toBe(true);
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
    test.each(['navigation', 'footer', 'default', 'container'] as const)(
      '%s variant toggles aria-expanded on click',
      variant => {
        const wrapper = renderInternalExpandableSection({ variant, __expandIconPosition: 'end' });
        const expandButton = wrapper.findExpandButton().getElement();
        expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        wrapper.findExpandButton().click();
        expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      }
    );

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

  describe('disableContentPaddings', () => {
    test('applies disable-content-paddings class when disableContentPaddings is true', () => {
      const wrapper = renderExpandableSection({
        disableContentPaddings: true,
        defaultExpanded: true,
        children: 'Content',
      });
      expect(wrapper.findContent().getElement()).toHaveClass(styles['disable-content-paddings']);
    });

    test('does not apply disable-content-paddings class by default', () => {
      const wrapper = renderExpandableSection({
        defaultExpanded: true,
        children: 'Content',
      });
      expect(wrapper.findContent().getElement()).not.toHaveClass(styles['disable-content-paddings']);
    });
  });

  describe('outside icon button (end position with renderIconOutsideHeader)', () => {
    test('container variant caret is a native button element so it is keyboard-focusable without role hacks', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'container',
        __expandIconPosition: 'end',
        headerText: 'Header',
      });
      const caret = wrapper.findExpandIcon().getElement();
      // Native <button> is automatically keyboard-focusable and announced as "button" by AT
      expect(caret.tagName).toBe('BUTTON');
    });

    test('default variant with actions renders caret as a native button for independent keyboard access', () => {
      const wrapper = renderInternalExpandableSection({
        variant: 'default',
        __expandIconPosition: 'end',
        headerText: 'Header',
        headerActions: <button>Action</button>,
      });
      const caret = wrapper.findExpandIcon().getElement();
      // Native <button> is automatically keyboard-focusable and announced as "button" by AT
      expect(caret.tagName).toBe('BUTTON');
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

    test('keyboard Enter on outside caret button toggles exactly once (no double-toggle)', () => {
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

      // Simulate keyboard Enter: keyDown → keyUp → browser-synthesized click
      // keyCode is required because the wrapper's onKeyUp handler checks event.keyCode
      fireEvent.keyDown(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.keyUp(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.click(iconButton);

      // Should toggle exactly once (expanded = true)
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });

    test('keyboard Space on outside caret button toggles exactly once (no double-toggle)', () => {
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

      // Simulate keyboard Space: keyDown → keyUp → browser-synthesized click
      // keyCode is required because the wrapper's onKeyUp handler checks event.keyCode
      fireEvent.keyDown(iconButton, { key: ' ', keyCode: 32 });
      fireEvent.keyUp(iconButton, { key: ' ', keyCode: 32 });
      fireEvent.click(iconButton);

      // Should toggle exactly once (expanded = true)
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { expanded: true } }));
    });

    test('keyboard toggle then toggle again results in closed state', () => {
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

      // First toggle: expand
      fireEvent.keyDown(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.keyUp(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.click(iconButton);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { expanded: true } }));

      // Second toggle: collapse
      fireEvent.keyDown(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.keyUp(iconButton, { key: 'Enter', keyCode: 13 });
      fireEvent.click(iconButton);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { expanded: false } }));
    });
  });

  describe('tab order for link-group with expand icon position', () => {
    test('start position: caret button precedes link in tab order', () => {
      const { container } = render(
        <InternalExpandableSection
          variant="navigation"
          __expandIconPosition="start"
          headerText={<a href="/link">Link</a>}
        >
          Content
        </InternalExpandableSection>
      );
      const wrapper = createWrapper(container).findExpandableSection()!;
      const header = wrapper.findHeader().getElement();
      const focusableElements = Array.from(header.querySelectorAll('button, a[href], [role="button"][tabindex="0"]'));
      const tags = focusableElements.map(el => el.tagName);
      // Start position: caret (BUTTON) first, then the link (A)
      expect(tags).toEqual(['BUTTON', 'A']);
    });

    test('end position: link precedes caret button in tab order', () => {
      const { container } = render(
        <InternalExpandableSection
          variant="navigation"
          __expandIconPosition="end"
          headerText={<a href="/link">Link</a>}
        >
          Content
        </InternalExpandableSection>
      );
      const wrapper = createWrapper(container).findExpandableSection()!;
      const header = wrapper.findHeader().getElement();
      const focusableElements = Array.from(header.querySelectorAll('button, a[href], [role="button"][tabindex="0"]'));
      const tags = focusableElements.map(el => el.tagName);
      // End position: link (A) first, then the caret (BUTTON)
      expect(tags).toEqual(['A', 'BUTTON']);
    });
  });
});
