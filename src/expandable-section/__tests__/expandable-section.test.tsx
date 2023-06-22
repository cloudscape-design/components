// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { ExpandableSectionWrapper } from '../../../lib/components/test-utils/dom';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import Button from '../../../lib/components/button';
import Header from '../../../lib/components/header';
import Link from '../../../lib/components/link';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import '../../__a11y__/to-validate-a11y';

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

describe('Expandable Section', () => {
  const variantsWithDescription: ExpandableSectionProps.Variant[] = ['container', 'default', 'footer'];
  const variantsWithoutDescription: ExpandableSectionProps.Variant[] = ['navigation'];
  const nonContainerVariants: ExpandableSectionProps.Variant[] = ['default', 'footer', 'navigation'];

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
    describe('populates description slot correctly', () => {
      for (const variant of variantsWithDescription) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            variant,
            headerText: 'Test Header',
            headerDescription: 'Description',
          });
          const header = wrapper.findHeader().getElement();
          expect(header).toHaveTextContent('Description');
        });
      }
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

  describe('does not populate non-supported slots', () => {
    describe('Description', () => {
      for (const variant of variantsWithoutDescription) {
        test(`${variant} variant`, () => {
          const wrapper = renderExpandableSection({
            headerText: 'Test Header',
            headerDescription: 'Description',
            variant,
          });
          const header = wrapper.findHeader().getElement();
          expect(header).not.toHaveTextContent('Description');
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
          test('Action buttons', () => {
            const wrapper = renderExpandableSection({
              variant,
              headerText: 'Test Header',
              headerInfo: <Button>Action</Button>,
            });
            const header = wrapper.findHeader().getElement();
            expect(header).not.toHaveTextContent('Action');
          });
        });
      }
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
              'The `headerDescription` prop is not supported for this variant.'
            );
          });
        }
      });

      describe('other properties', () => {
        const testWarnings = (props: ExpandableSectionProps) => {
          render(<ExpandableSection {...props} />);
          expect(warnOnce).toHaveBeenCalledTimes(1);
          expect(warnOnce).toHaveBeenCalledWith(
            componentName,
            'The `headerCounter`, `headerInfo` and `headerActions` props are only supported for the "container" variant.'
          );
        };

        for (const variant of nonContainerVariants) {
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

      test('container variant', () => {
        testWarnings({
          variant: 'container',
          headerCounter: '(2)',
          headerDescription: 'Description',
          headerInfo: <Link>Info</Link>,
          headerActions: <Button>Action</Button>,
        });
      });

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
  test('set aria labels when no headerAriaLabel is set', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    expect(headerButton).toHaveAccessibleName('Header component');
  });
  test('set aria description if description present', () => {
    const wrapper = renderExpandableSection({
      variant: 'container',
      headerText: 'Header component',
      headerDescription: 'Expand to see more content',
    });
    const headerButton = wrapper.findHeader().find('[role="button"]')!.getElement();
    expect(headerButton).toHaveAccessibleDescription('Expand to see more content');
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
