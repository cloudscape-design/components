// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import BreadcrumbGroup from '../../../lib/components/breadcrumb-group/index.js';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import {
  GeneratedAnalyticsMetadataWizardCancel,
  GeneratedAnalyticsMetadataWizardNavigate,
  GeneratedAnalyticsMetadataWizardSubmit,
} from '../../../lib/components/wizard/analytics-metadata/interfaces.js';
import Wizard, { WizardProps } from '../../../lib/components/wizard/index.js';
import InternalWizard from '../../../lib/components/wizard/internal.js';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils.js';
import { DEFAULT_I18N_SETS } from './common.js';

import labels from '../../../lib/components/wizard/analytics-metadata/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

const steps: WizardProps['steps'] = [
  {
    title: 'Step 1',
    content: <div>content 1</div>,
  },
  {
    title: 'Step 2',
    content: <div>content 2</div>,
    isOptional: true,
  },
  {
    title: 'Step 3',
    content: <div>content 3</div>,
  },
];

function renderWizard(props: Partial<WizardProps> = {}) {
  const renderResult = render(
    <Wizard steps={steps} i18nStrings={DEFAULT_I18N_SETS[0]} allowSkipTo={true} {...props} />
  );
  return createWrapper(renderResult.container).findWizard()!;
}

const getMetadata = (
  activeStepIndex: number,
  label = '',
  { errorContext, ...analyticsMetadata }: WizardProps['analyticsMetadata'] = {}
) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Wizard',
          label,
          properties: {
            activeStepIndex: `${activeStepIndex}`,
            activeStepLabel: steps[activeStepIndex].title,
            stepsCount: '3',
            ...errorContext,
            ...analyticsMetadata,
          },
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe.each([true, false])('with visualrefresh=%s', isVR => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(isVR);
  });
  describe('Wizard renders correct analytics metadata', () => {
    test('on next button', () => {
      const wrapper = renderWizard();
      const nextButton = wrapper.findPrimaryButton().getElement();
      validateComponentNameAndLabels(nextButton, labels);
      const navigateMetadata: GeneratedAnalyticsMetadataWizardNavigate = {
        action: 'navigate',
        detail: {
          label: 'Next',
          reason: 'next',
          targetStepIndex: '1',
        },
      };
      expect(getGeneratedAnalyticsMetadata(nextButton)).toEqual({
        ...navigateMetadata,
        ...getMetadata(0),
      });
    });
    test('on cancel button', () => {
      const wrapper = renderWizard();
      const button = wrapper.findCancelButton().getElement();
      validateComponentNameAndLabels(button, labels);
      const cancelMetadata: GeneratedAnalyticsMetadataWizardCancel = {
        action: 'cancel',
        detail: {
          label: 'Cancel',
        },
      };
      expect(getGeneratedAnalyticsMetadata(button)).toEqual({
        ...cancelMetadata,
        ...getMetadata(0),
      });
    });
    test('on submit button', () => {
      const wrapper = renderWizard({ activeStepIndex: 2, onNavigate: () => {} });
      const button = wrapper.findPrimaryButton().getElement();
      validateComponentNameAndLabels(button, labels);
      const submitMetadata: GeneratedAnalyticsMetadataWizardSubmit = {
        action: 'submit',
        detail: {
          label: 'Create record',
        },
      };
      expect(getGeneratedAnalyticsMetadata(button)).toEqual({
        ...submitMetadata,
        ...getMetadata(2),
      });
    });
    test('on skip button', () => {
      const wrapper = renderWizard();
      const button = wrapper.findSkipToButton()!.getElement();
      validateComponentNameAndLabels(button, labels);
      expect(getGeneratedAnalyticsMetadata(button)).toEqual({
        action: 'navigate',
        detail: {
          label: 'Skip to Step 3(3)',
          reason: 'skip',
          targetStepIndex: '2',
        },
        ...getMetadata(0),
      });
    });

    test('on navigation links', () => {
      const wrapper = renderWizard();
      wrapper.findPrimaryButton().click();

      const firstLink = wrapper.findMenuNavigationLink(1)!.getElement();
      validateComponentNameAndLabels(firstLink, labels);
      expect(getGeneratedAnalyticsMetadata(firstLink)).toEqual({
        action: 'navigate',
        detail: {
          label: 'Step 1',
          reason: 'step',
          targetStepIndex: '0',
        },
        ...getMetadata(1),
      });

      const thirdLink = wrapper.findMenuNavigationLink(3)!.getElement();
      expect(getGeneratedAnalyticsMetadata(thirdLink)).toEqual(getMetadata(1));
    });
    test('with analyticsMetadata', () => {
      const analyticsMetadata: WizardProps['analyticsMetadata'] = {
        instanceIdentifier: 'a',
        flowType: 'create',
        resourceType: 'record',
      };
      const wrapper = renderWizard({ analyticsMetadata });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata(0, '', analyticsMetadata));
    });
    test('with breadcrumbs', () => {
      const renderResult = render(
        <>
          <BreadcrumbGroup
            items={[
              { text: 'first', href: '#' },
              { text: 'wizard label', href: '#/this' },
            ]}
          />
          <Wizard steps={steps} i18nStrings={DEFAULT_I18N_SETS[0]} />
        </>
      );
      const wrapper = createWrapper(renderResult.container).findWizard()!;
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata(0, 'wizard label'));
    });
  });

  test('does not render "component" metadata', () => {
    const renderResult = render(<InternalWizard steps={steps} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    expect(getGeneratedAnalyticsMetadata(createWrapper(renderResult.container).findWizard()!.getElement())).toEqual({});
  });
});
