// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import WizardWrapper from '../../../lib/components/test-utils/dom/wizard';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';
import Button from '../../../lib/components/button';
import Wizard, { WizardProps } from '../../../lib/components/wizard';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import styles from '../../../lib/components/wizard/styles.selectors.js';

import { DEFAULT_I18N_SETS, DEFAULT_STEPS } from './common';

declare global {
  interface Window {
    AWSC?: any;
    panorama?: any;
  }
}

const renderWizard = (wizardProps: WizardProps): [WizardWrapper, (props: WizardProps) => void] => {
  const { container, rerender } = render(<Wizard {...wizardProps} />);
  const rerenderWithProps = (newProps: WizardProps) => rerender(<Wizard {...newProps} />);
  return [createWrapper(container).findWizard()!, rerenderWithProps];
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type DefaultWizardProps = Optional<WizardProps, 'i18nStrings' | 'steps'>;

const renderDefaultWizard = (
  wizardProps?: DefaultWizardProps
): [WizardWrapper, (props: DefaultWizardProps) => void] => {
  const defaultProps = { i18nStrings: DEFAULT_I18N_SETS[0], steps: DEFAULT_STEPS };
  const [wrapper, rerender] = renderWizard({ ...defaultProps, ...wizardProps });
  return [wrapper, (newProps: DefaultWizardProps) => rerender({ ...defaultProps, ...newProps })];
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});
let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('i18nStrings', () => {
  test('uses submitButtonText over i18nStrings.submitButton', () => {
    const [wrapper] = renderDefaultWizard({ submitButtonText: 'Create DB instance' });
    for (let i = 0; i < DEFAULT_STEPS.length - 1; i++) {
      wrapper.findPrimaryButton().click();
    }
    expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent('Create DB instance');
  });

  DEFAULT_I18N_SETS.forEach((i18nStrings, index) => {
    test(`match provided i18nStrings, i18nSets[${index}], shown on the wizard component`, () => {
      const [wrapper] = renderWizard({
        i18nStrings,
        steps: DEFAULT_STEPS,
      });

      expect(wrapper.findByClassName(styles.navigation)!.getElement()).toHaveAttribute(
        'aria-label',
        i18nStrings.navigationAriaLabel
      );

      wrapper.findAllByClassName(styles['navigation-link-label']).forEach((label, index) => {
        const expectedTitle = i18nStrings.stepNumberLabel!(index + 1);
        const expectedLabel = DEFAULT_STEPS[index].isOptional
          ? `${expectedTitle} - ${i18nStrings.optional}`
          : expectedTitle;
        expect(label?.getElement()).toHaveTextContent(expectedLabel);
      });

      expect(wrapper.findCancelButton().getElement()).toHaveTextContent(i18nStrings.cancelButton!);
      expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent(i18nStrings.nextButton!);

      // navigate to next step
      wrapper.findPrimaryButton().click();
      const expectedCollapsedSteps = `${i18nStrings.collapsedStepsLabel!(2, DEFAULT_STEPS.length)}`;
      expect(wrapper.findByClassName(styles['collapsed-steps'])!.getElement()).toHaveTextContent(
        expectedCollapsedSteps
      );

      const expectedFormTitle = `${DEFAULT_STEPS[1].title} - ${i18nStrings.optional}`;
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent(expectedFormTitle);

      expect(wrapper.findPreviousButton()!.getElement()).toHaveTextContent(i18nStrings.previousButton!);

      // navigate to next step
      wrapper.findPrimaryButton().click();
      expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent(i18nStrings.submitButton!);
    });
  });
});

describe('Cancel button', () => {
  test('have Cancel button on every step', () => {
    const [wrapper] = renderDefaultWizard();
    DEFAULT_STEPS.forEach(() => {
      expect(wrapper.findCancelButton()).not.toBeNull();
      wrapper.findPrimaryButton().click();
    });
  });
  test('fires onCancel event with null in detail after clicking Cancel button', () => {
    const onCancelSpy = jest.fn();
    const [wrapper] = renderDefaultWizard({ onCancel: onCancelSpy });
    wrapper.findCancelButton().click();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: null }));
  });
});

describe('Previous button', () => {
  test('have Previous button on every step except the first step', () => {
    const [wrapper] = renderDefaultWizard();
    expect(wrapper.findPreviousButton()).toBeNull();
    DEFAULT_STEPS.forEach(() => {
      wrapper.findPrimaryButton().click();
      expect(wrapper.findPreviousButton()).not.toBeNull();
    });
  });

  test('fires onNavigate event with requestedStepIndex and reason after clicking Previous button', () => {
    const onNavigateSpy = jest.fn();
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 1, onNavigate: onNavigateSpy });
    wrapper.findPreviousButton()!.click();
    expect(onNavigateSpy).toHaveBeenCalledTimes(1);
    expect(onNavigateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { requestedStepIndex: 0, reason: 'previous' } })
    );
  });
});

describe('Skip-to button', () => {
  const steps = [
    { title: 'Step 1', isOptional: false, content: 'content 1' },
    { title: 'Step 2', isOptional: true, content: 'content 2' },
    { title: 'Step 3', isOptional: false, content: 'content 3' },
    { title: 'Step 4', isOptional: false, content: 'content 4' },
    { title: 'Step 5', isOptional: true, content: 'content 5' },
    { title: 'Step 6', isOptional: true, content: 'content 6' },
    { title: 'Step 7', isOptional: false, content: 'content 7' },
  ];

  test('does not have skip-to button in when not allowed', () => {
    const [wrapper] = renderDefaultWizard({ steps, allowSkipTo: false });

    steps.forEach(() => {
      expect(wrapper.findSkipToButton()).toBeNull();
      wrapper.findPrimaryButton().click();
    });
  });

  test('have skip-to button in appropriate steps', () => {
    const [wrapper] = renderDefaultWizard({ steps, allowSkipTo: true });

    const getSkipButtonText = () => {
      try {
        return wrapper.findSkipToButton()!.getElement().textContent;
      } catch (ignore) {
        return '';
      }
    };

    // Step 1
    expect(getSkipButtonText()).toBe('Skip to Step 3(3)');
    // Step 2
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('');
    // Step 3
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('');
    // Step 4
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('Skip to Step 7(7)');
    // Step 5
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('Skip to Step 7(7)');
    // Step 6
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('');
    // Step 7
    wrapper.findPrimaryButton().click();
    expect(getSkipButtonText()).toBe('');
  });

  test('navigates correctly with skip-to button', () => {
    function testNavigation(activeStepIndex: number, requestedStepIndex: number) {
      const onNavigate = jest.fn();
      const [wrapper] = renderDefaultWizard({ activeStepIndex, onNavigate, steps, allowSkipTo: true });

      wrapper.findSkipToButton()!.click();

      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { requestedStepIndex, reason: 'skip' } })
      );
    }

    // Step 1 -> 3
    testNavigation(0, 2);
    // Step 4 -> 7
    testNavigation(3, 6);
    // Step 5 -> 7
    testNavigation(4, 6);
  });

  test('warns if skip-to is allowed but no translation function provided', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    renderWizard({ steps: DEFAULT_STEPS, i18nStrings: DEFAULT_I18N_SETS[1], allowSkipTo: true });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[AwsUi] [Wizard] You have set `allowSkipTo` but you have not provided `i18nStrings.skipToButtonLabel`. The skip-to button will not be rendered.'
    );
  });
});

describe('Primary button', () => {
  test('have Next button on every step except the last step, and Submit button only on the last step', () => {
    const [wrapper] = renderDefaultWizard();
    DEFAULT_STEPS.forEach((step, index) => {
      if (index < DEFAULT_STEPS.length - 1) {
        expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent(DEFAULT_I18N_SETS[0].nextButton!);
      } else {
        expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent(DEFAULT_I18N_SETS[0].submitButton!);
      }
      wrapper.findPrimaryButton().click();
    });
  });
  test('fires onNavigate event with requestedStepIndex and reason after clicking Next button', () => {
    const onNavigateSpy = jest.fn();
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 0, onNavigate: onNavigateSpy });
    wrapper.findPrimaryButton().click();
    expect(onNavigateSpy).toHaveBeenCalledTimes(1);
    expect(onNavigateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { requestedStepIndex: 1, reason: 'next' } })
    );
  });
  test('fires onSubmit event with null in detail after clicking Submit button', () => {
    const onSubmitSpy = jest.fn();
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 2, onSubmit: onSubmitSpy, onNavigate: () => {} });
    wrapper.findPrimaryButton().click();
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    expect(onSubmitSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: null }));
  });
});

describe('Navigation', () => {
  test('disables unvisited steps on the menu', () => {
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 0, onNavigate: () => {} });
    const navigationLinks = wrapper
      .findMenuNavigationLinks()
      .slice(1, 3)
      .map(link => link.getElement());
    navigationLinks.forEach(link => {
      expect(link).toHaveClass(styles['navigation-link-disabled']);
      expect(link).toHaveAttribute('aria-disabled');
      expect(link).not.toHaveAttribute('aria-current');
    });
    expect(wrapper.findMenuNavigationLink(2, 'disabled')).not.toBeNull();
    expect(wrapper.findMenuNavigationLink(2, 'active')).toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'disabled')).not.toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'active')).toBeNull();
  });

  test('enables unvisited steps on the menu when skip-to is possible', () => {
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 0, onNavigate: () => {}, allowSkipTo: true });
    const navigationLinks = wrapper
      .findMenuNavigationLinks()
      .slice(1, 3)
      .map(link => link.getElement());
    navigationLinks.forEach(link => {
      expect(link).not.toHaveClass(styles['navigation-link-disabled']);
      expect(link).not.toHaveAttribute('aria-disabled');
      expect(link).not.toHaveAttribute('aria-current');
    });
    expect(wrapper.findMenuNavigationLink(2, 'disabled')).toBeNull();
    expect(wrapper.findMenuNavigationLink(2, 'active')).toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'disabled')).toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'active')).toBeNull();
  });

  test('unvisited required steps are not accessible until visited using skip-to', () => {
    const steps = [
      { title: 'Step 1', isOptional: false, content: 'content 1' },
      { title: 'Step 2', isOptional: false, content: 'content 2' },
      { title: 'Step 3', isOptional: true, content: 'content 3' },
    ];
    const [wrapper] = renderWizard({ steps, i18nStrings: DEFAULT_I18N_SETS[1], allowSkipTo: true });
    expect(wrapper.findMenuNavigationLink(1, 'active')).not.toBeNull();
    expect(wrapper.findMenuNavigationLink(1, 'disabled')).toBeNull();
    expect(wrapper.findMenuNavigationLink(2, 'active')).toBeNull();
    expect(wrapper.findMenuNavigationLink(2, 'disabled')).not.toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'active')).toBeNull();
    expect(wrapper.findMenuNavigationLink(3, 'disabled')).not.toBeNull();
  });

  test('sets active step', () => {
    const [wrapper] = renderDefaultWizard({ activeStepIndex: 0, onNavigate: () => {} });
    const activeStep = wrapper.findMenuNavigationLink(1)!.getElement();
    expect(wrapper.findMenuNavigationLink(1, 'active')).not.toBeNull();
    expect(wrapper.findMenuNavigationLink(1, 'disabled')).toBeNull();
    expect(activeStep).toHaveAttribute('aria-current', 'step');
    expect(activeStep).not.toHaveAttribute('aria-disabled');
  });

  test('enables visited steps for navigation on the menu', () => {
    const [wrapper, rerender] = renderDefaultWizard({ activeStepIndex: 2, onNavigate: () => {} });
    wrapper
      .findMenuNavigationLinks()
      .slice(0, 2)
      .map(link => link.getElement())
      .forEach(link => {
        expect(link).not.toHaveClass(styles['navigation-link-disabled']);
        expect(link).not.toHaveAttribute('aria-current');
      });
    rerender({ activeStepIndex: 0, onNavigate: () => {} });
    wrapper
      .findMenuNavigationLinks()
      .slice(1, 3)
      .map(link => link.getElement())
      .forEach(link => {
        expect(link).not.toHaveClass(styles['navigation-link-disabled']);
        expect(link).not.toHaveAttribute('aria-current');
      });
  });

  test('fires onNavigate event with requestedStepIndex and reason after clicking on menu step', () => {
    const onNavigate = jest.fn();
    const [wrapper, rerender] = renderDefaultWizard({ activeStepIndex: 0, onNavigate, allowSkipTo: true });

    // Navigate 1 -> 3
    wrapper.findMenuNavigationLink(3)!.click();
    rerender({ activeStepIndex: 2, onNavigate, allowSkipTo: true });

    // Navigate 3 -> 1
    wrapper.findMenuNavigationLink(1)!.click();
    rerender({ activeStepIndex: 0, onNavigate, allowSkipTo: true });

    // Navigate 1 -> 3
    wrapper.findMenuNavigationLink(3)!.click();
    rerender({ activeStepIndex: 2, onNavigate, allowSkipTo: true });

    expect(onNavigate).toHaveBeenCalledTimes(3);
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { requestedStepIndex: 2, reason: 'skip' } })
    );
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { requestedStepIndex: 0, reason: 'step' } })
    );
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { requestedStepIndex: 2, reason: 'step' } })
    );
  });
});

describe('Form', () => {
  test('renders header', () => {
    const [wrapper] = renderDefaultWizard({ steps: [{ title: 'test title', content: null }] });
    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('test title');
  });
  test('renders description', () => {
    const [wrapper] = renderDefaultWizard({ steps: [{ title: '', description: 'test description', content: null }] });
    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('test description');
  });
  test('renders info', () => {
    const [wrapper] = renderDefaultWizard({ steps: [{ title: '', info: 'test info', content: null }] });
    expect(wrapper.findInfo()!.getElement()).toHaveTextContent('test info');
  });
  test('renders content', () => {
    const [wrapper] = renderDefaultWizard({
      steps: [{ title: '', content: <div className="test">test content</div> }],
    });
    expect(wrapper.findByClassName('test')!.getElement()).toHaveTextContent('test content');
  });
  test('renders errorText', () => {
    const [wrapper] = renderDefaultWizard({ steps: [{ title: '', errorText: 'test error', content: null }] });
    expect(wrapper.findError()!.getElement()).toHaveTextContent('test error');
  });
});

test('sets last step as active when activeStepIndex is out of bound, and raises warning', () => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  expect(consoleWarnSpy).not.toHaveBeenCalled();
  const [wrapper] = renderDefaultWizard({ activeStepIndex: 7, onNavigate: () => {} });

  const activeStep = wrapper.findMenuNavigationLink(3)!.getElement();
  expect(activeStep).toHaveClass(styles['navigation-link-active']);
  expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    '[AwsUi] [Wizard] You have set `activeStepIndex` to 7 but you have provided only 3 steps. Its value is ignored and the component uses 2 instead.'
  );
});

test('raises a warning when setting activeStepIndex without onNavigate listener', () => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  expect(consoleWarnSpy).not.toHaveBeenCalled();
  renderDefaultWizard({ activeStepIndex: 2 });
  expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    '[AwsUi] [Wizard] You provided a `activeStepIndex` prop without an `onNavigate` handler. This will render a non-interactive component.'
  );
});

test('does not perform navigation when used in controlled mode', () => {
  const [wrapper] = renderDefaultWizard({ activeStepIndex: 1, onNavigate: () => {} });
  const checkStep = () => {
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Step 2, substep oneStep 2, substep two');
  };
  wrapper.findPreviousButton()!.click();
  checkStep();
  wrapper.findPrimaryButton().click();
  checkStep();
  wrapper.findMenuNavigationLink(1)!.click();
  checkStep();
});

test('performs navigation when used in uncontrolled mode', () => {
  const [wrapper] = renderDefaultWizard();
  const checkStep = (index: number) => {
    if (index === 0) {
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Step 1, substep oneStep 1, substep two');
    } else {
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Step 2, substep oneStep 2, substep two');
    }
  };
  checkStep(0);
  wrapper.findPrimaryButton().click();
  checkStep(1);
  wrapper.findMenuNavigationLink(1)!.click();
  checkStep(0);
  wrapper.findPrimaryButton().click();
  checkStep(1);
  wrapper.findPreviousButton()!.click();
  checkStep(0);
});

test('disables all navigation while a step is loading', () => {
  const props: Partial<WizardProps> = {
    allowSkipTo: true,
    steps: [
      {
        title: 'Step 1',
        content: 'Content 1',
      },
      {
        title: 'Step 2',
        content: 'Content 2',
        isOptional: true,
      },
      {
        title: 'Step 3',
        content: 'Content 3',
        isOptional: true,
      },
      {
        title: 'Step 4',
        content: 'Content 4',
      },
    ],
    activeStepIndex: 1,
    onNavigate: () => {},
  };

  const [wrapper, rerender] = renderDefaultWizard(props);
  expect(wrapper.findPreviousButton()!.getElement()).toBeEnabled();
  expect(wrapper.findSkipToButton()!.getElement()).toBeEnabled();
  expect(wrapper.findPrimaryButton()!.getElement()).toBeEnabled();

  expect(wrapper.findMenuNavigationLink(1, 'disabled')).toBeNull();
  expect(wrapper.findMenuNavigationLink(2, 'active')).not.toBeNull();
  expect(wrapper.findMenuNavigationLink(3, 'disabled')).toBeNull();
  expect(wrapper.findMenuNavigationLink(4, 'disabled')).toBeNull();

  rerender({ ...props, isLoadingNextStep: true });

  expect(wrapper.findPreviousButton()!.getElement()).toBeDisabled();
  expect(wrapper.findSkipToButton()!.getElement()).toBeDisabled();
  expect(wrapper.findCancelButton()!.getElement()).toBeEnabled();
  expect(wrapper.findPrimaryButton()!.getElement()).toHaveAttribute('aria-disabled', 'true');

  expect(wrapper.findMenuNavigationLink(1, 'disabled')).not.toBeNull();
  expect(wrapper.findMenuNavigationLink(2, 'active')).not.toBeNull();
  expect(wrapper.findMenuNavigationLink(3, 'disabled')).not.toBeNull();
  expect(wrapper.findMenuNavigationLink(4, 'disabled')).not.toBeNull();

  // check for screen reader announcement
  expect(wrapper.findActions()?.findByClassName(liveRegionStyles.root)?.getElement()).toHaveTextContent(
    DEFAULT_I18N_SETS[0].nextButtonLoadingAnnouncement!
  );

  rerender({ ...props, isLoadingNextStep: false });

  expect(wrapper.findPreviousButton()!.getElement()).toBeEnabled();
  expect(wrapper.findSkipToButton()!.getElement()).toBeEnabled();
  expect(wrapper.findCancelButton()!.getElement()).toBeEnabled();
  expect(wrapper.findPrimaryButton()!.getElement()).toBeEnabled();

  expect(wrapper.findMenuNavigationLink(1, 'disabled')).toBeNull();
  expect(wrapper.findMenuNavigationLink(2, 'active')).not.toBeNull();
  expect(wrapper.findMenuNavigationLink(3, 'disabled')).toBeNull();
  expect(wrapper.findMenuNavigationLink(4, 'disabled')).toBeNull();
});

describe('Custom actions', () => {
  test('shows custom actions when defined', () => {
    const onClick = jest.fn();
    const [wrapper] = renderDefaultWizard({ secondaryActions: <Button onClick={onClick}>Save as draft</Button> });

    wrapper.findSecondaryActions()!.findButton()!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('i18n', () => {
  test('supports rendering static strings using i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          wizard: {
            'i18nStrings.stepNumberLabel': 'Custom step {stepNumber}',
            'i18nStrings.collapsedStepsLabel': 'Custom step {stepNumber} of {stepsCount}',
            'i18nStrings.skipToButtonLabel': 'Custom skip to {task__title}',
            'i18nStrings.navigationAriaLabel': 'Custom steps',
            'i18nStrings.cancelButton': 'Custom cancel',
            'i18nStrings.previousButton': 'Custom previous',
            'i18nStrings.nextButton': 'Custom next',
            'i18nStrings.optional': 'Custom optional',
          },
        }}
      >
        <Wizard
          i18nStrings={{ submitButton: 'Create instance' }}
          allowSkipTo={true}
          steps={[
            { title: 'Step 1', content: 'Content 1', isOptional: true },
            { title: 'Step 2', content: 'Content 2', isOptional: true },
            { title: 'Step 3', content: 'Content 3', isOptional: true },
          ]}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findWizard()!;
    expect(wrapper.find('li:nth-child(1)')!.getElement()).toHaveTextContent(
      'Custom step 1 - Custom optional' + 'Step 1'
    );
    expect(wrapper.getElement()).toHaveTextContent('Custom step 1 of 3');
    expect(wrapper.findCancelButton().getElement()).toHaveTextContent('Custom cancel');
    expect(wrapper.findPrimaryButton().getElement()).toHaveTextContent('Custom next');
    expect(wrapper.findSkipToButton()!.getElement()).toHaveTextContent('Custom skip to Step 3');
    expect(wrapper.find('nav')!.getElement()).toHaveAccessibleName('Custom steps');
    wrapper.findPrimaryButton().click();
    expect(wrapper.findPreviousButton()!.getElement()).toHaveTextContent('Custom previous');
  });
});
