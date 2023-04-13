// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import {
  hotspotContext as HotspotContext,
  HotspotContext as HotspotContextType,
} from '../../../lib/components/annotation-context/context';
import TutorialPanel, { TutorialPanelProps } from '../../../lib/components/tutorial-panel';

import { getTutorials, i18nStrings } from './data';
import createWrapper from '../../../lib/components/test-utils/dom';

function getContext(props?: Partial<HotspotContextType>): HotspotContextType {
  return {
    registerHotspot: jest.fn(),
    unregisterHotspot: jest.fn(),
    currentStepIndex: 0,
    currentTutorial: null,
    onStartTutorial: jest.fn(),
    onExitTutorial: jest.fn(),
    getContentForId: jest.fn(),
    ...props,
  };
}

function renderTutorialPanel(props?: Partial<TutorialPanelProps>) {
  const tutorials = getTutorials();
  const defaultProps: TutorialPanelProps = {
    i18nStrings: i18nStrings,
    downloadUrl: 'DOWNLOAD_URL',
    tutorials: tutorials,
    onFeedbackClick: jest.fn(),
  };

  return { ...render(<TutorialPanel {...defaultProps} {...props} />), tutorials };
}

function renderTutorialPanelWithContext(
  props?: Partial<TutorialPanelProps>,
  contextProps?: Partial<HotspotContextType>
) {
  const tutorials = getTutorials();

  const defaultProps: TutorialPanelProps = {
    i18nStrings: i18nStrings,
    downloadUrl: 'DOWNLOAD_URL',
    tutorials: tutorials,
    onFeedbackClick: () => {},
  };

  const context = getContext(contextProps);

  return {
    ...render(
      <HotspotContext.Provider value={context}>
        <TutorialPanel {...defaultProps} {...props} />
      </HotspotContext.Provider>
    ),
    tutorials,
    context,
  };
}

describe('tutorial list', () => {
  test('can collapse and expand tutorials', () => {
    const { container } = renderTutorialPanel();
    const wrapper = createWrapper(container).findTutorialPanel()!;

    wrapper.findTutorials()[0].findCollapseButton()!.click();
    wrapper.findTutorials()[0].findExpandButton()!.click();

    wrapper.findTutorials()[1].findExpandButton()!.click();
    wrapper.findTutorials()[1].findCollapseButton()!.click();
  });

  test('completed tutorials are collapsed by default', () => {
    const { container } = renderTutorialPanel();
    const wrapper = createWrapper(container).findTutorialPanel()!;

    expect(wrapper.findTutorials()[1].findExpandButton()!.getElement()).toBeInTheDocument();
    expect(wrapper.findTutorials()[1].findCollapseButton()).toBeNull();
  });

  test('un-completed tutorials are expanded by default', () => {
    const { container } = renderTutorialPanel();
    const wrapper = createWrapper(container).findTutorialPanel()!;

    expect(wrapper.findTutorials()[0].findCollapseButton()!.getElement()).toBeInTheDocument();
    expect(wrapper.findTutorials()[0].findExpandButton()).toBeNull();
  });

  test('a tutorial can be started with the start button', () => {
    const { container, context, tutorials } = renderTutorialPanelWithContext();
    const wrapper = createWrapper(container).findTutorialPanel()!;

    wrapper.findTutorials()[0].findStartButton()!.click();

    expect(context.onStartTutorial).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { tutorial: tutorials[0] } })
    );
  });

  test('shows the correct tutorial information', () => {
    const { container } = renderTutorialPanelWithContext();
    const wrapper = createWrapper(container).findTutorialPanel()!;

    expect(wrapper.findTutorials()[0].findTitle()!.getElement()).toHaveTextContent('TUTORIAL_1_TITLE_TEST');
    expect(wrapper.findTutorials()[0].findDescription()!.getElement()).toHaveTextContent('TUTORIAL_DESCRIPTION_TEST');
    expect(wrapper.findTutorials()[0].findLearnMoreLink()!.getElement()).toHaveTextContent('LEARN_MORE_LINK_TEXT');
    expect(wrapper.findTutorials()[0].findCompleted()).toBeNull();
    expect(wrapper.findTutorials()[0].findPrerequisitesAlert()).toBeNull();

    expect(wrapper.findTutorials()[1].findTitle()!.getElement()).toHaveTextContent('TUTORIAL_2_TITLE_TEST');
    expect(wrapper.findTutorials()[1].findDescription()!.getElement()).toHaveTextContent('TUTORIAL_DESCRIPTION_TEST');
    expect(wrapper.findTutorials()[1].findLearnMoreLink()).toBeNull();
    expect(wrapper.findTutorials()[1].findCompleted()!.getElement()).toBeInTheDocument();

    wrapper.findTutorials()[1].findExpandButton()!.click();
    expect(wrapper.findTutorials()[1].findPrerequisitesAlert()!.getElement()).toHaveTextContent(
      'PREREQUISITES_ALERT_TEXT'
    );
  });
});

describe('tutorial detail view', () => {
  test("shows 'completed' screen", () => {
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[1] });
    const { container } = renderTutorialPanelWithContext({ tutorials }, context);
    const wrapper = createWrapper(container).findTutorialPanel()!;

    expect(wrapper.findCompletionScreenTitle()!.getElement()).toHaveTextContent('COMPLETION_SCREEN_TITLE');
    expect(wrapper.findCompletionScreenDescription()!.getElement()).toHaveTextContent(
      'COMPLETED_SCREEN_DESCRIPTION_TEST'
    );
  });

  test('shows the correct data', () => {
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[0] });
    const { container } = renderTutorialPanelWithContext({ tutorials }, context);
    const wrapper = createWrapper(container).findTutorialPanel()!;

    const taskList = wrapper.findTaskList();
    expect(taskList).toHaveLength(2);

    expect(taskList[0].findTitle().getElement()).toHaveTextContent('FIRST_TASK_TEST');
    expect(taskList[0].findStepsTitle().getElement()).toHaveTextContent('TOTAL_STEPS_1');
    expect(taskList[0].findSteps()).toHaveLength(1);
    expect(taskList[0].findSteps()[0].getElement()).toHaveTextContent('FIRST_STEP_TEST');

    expect(taskList[1].findTitle().getElement()).toHaveTextContent('SECOND_TASK_TEST');
    expect(taskList[1].findStepsTitle().getElement()).toHaveTextContent('TOTAL_STEPS_2');
    expect(taskList[1].findSteps()).toHaveLength(2);
    expect(taskList[1].findSteps()[0].getElement()).toHaveTextContent('SECOND_STEP_TEST');
    expect(taskList[1].findSteps()[1].getElement()).toHaveTextContent('THIRD_STEP_TEST');
  });

  test('can exit the tutorial', () => {
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[0] });
    const { container } = renderTutorialPanelWithContext({ tutorials }, context);
    const wrapper = createWrapper(container).findTutorialPanel()!;

    wrapper.findDismissButton()!.click();
    expect(context.onExitTutorial).toHaveBeenCalledTimes(1);
  });

  test('can give feedback', () => {
    const onFeedbackClick = jest.fn();
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[1] });
    const { container } = renderTutorialPanelWithContext({ tutorials, onFeedbackClick }, context);
    const wrapper = createWrapper(container).findTutorialPanel()!;

    wrapper.findFeedbackLink()!.getElement().click();
    expect(onFeedbackClick).toHaveBeenCalledTimes(1);
  });

  test('feedback link is optional', () => {
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[1] });
    const { container } = renderTutorialPanelWithContext({ tutorials, onFeedbackClick: undefined }, context);
    const wrapper = createWrapper(container).findTutorialPanel()!;

    expect(wrapper.findFeedbackLink()).toBe(null);
  });

  test('completed screen should have role status', () => {
    const tutorials = getTutorials();
    const context = getContext({ currentTutorial: tutorials[1] });
    const { container } = renderTutorialPanelWithContext({ tutorials }, context);
    const completedScreen = createWrapper(container).findTutorialPanel()!.find('[role="status"]')!.getElement();
    expect(completedScreen).toHaveTextContent('COMPLETION_SCREEN_TITLE');
    expect(completedScreen).toHaveTextContent('COMPLETED_SCREEN_DESCRIPTION_TEST');
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

  describe('for the "Learn more" URL', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const tutorials = getTutorials();
      const context = getContext();

      tutorials[0].learnMoreUrl = 'javascript:void(0)';
      const { container } = renderTutorialPanelWithContext({ tutorials }, context);
      const wrapper = createWrapper(container).findTutorialPanel()!;

      expect(wrapper.findTutorials()[0].findLearnMoreLink()!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('throws an error when a dangerous javascript: URL is passed', () => {
      const tutorials = getTutorials();
      const context = getContext();

      tutorials[0].learnMoreUrl = "javascript:alert('Hello from Learn More!')";
      expect(() => renderTutorialPanelWithContext({ tutorials }, context)).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TutorialPanel] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from Learn More!')".`
      );
    });
  });

  describe('for the "Download" URL', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const tutorials = getTutorials();
      const context = getContext();

      const { container } = renderTutorialPanelWithContext({ tutorials, downloadUrl: 'javascript:void(0)' }, context);
      const wrapper = createWrapper(container).findTutorialPanel()!;

      expect(wrapper.findDownloadLink()!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('throws an error when a dangerous javascript: URL is passed', () => {
      const tutorials = getTutorials();
      const context = getContext();

      expect(() =>
        renderTutorialPanelWithContext({ tutorials, downloadUrl: "javascript:alert('Hello from Download!')" }, context)
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TutorialPanel] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from Download!')".`
      );
    });
    test('does not show the download link when downloadUrl is not passed', () => {
      const tutorials = getTutorials();
      const context = getContext();

      const { container } = renderTutorialPanelWithContext({ tutorials, downloadUrl: undefined }, context);
      const wrapper = createWrapper(container).findTutorialPanel()!;
      expect(wrapper.findDownloadLink()).toBeFalsy();
    });
  });
  describe('a11y', () => {
    test('task list expandable section should have aria-label joining task title and total step label', () => {
      const tutorials = getTutorials();
      const context = getContext({ currentTutorial: tutorials[0] });
      const { container } = renderTutorialPanelWithContext({ tutorials }, context);
      const wrapper = createWrapper(container).findTutorialPanel()!;
      const taskList = wrapper.findTaskList();

      expect(taskList[0].findStepsTitle().getElement().getAttribute('aria-label')).toBe(
        'TASK_1_FIRST_TASK_TEST TOTAL_STEPS_1'
      );
    });
    test('links have correct aria-label', () => {
      const tutorials = getTutorials();
      const context = getContext();
      const { container } = renderTutorialPanelWithContext({ tutorials }, context);
      const wrapper = createWrapper(container).findTutorialPanel()!;
      expect(wrapper.findDownloadLink()!.getElement()).toHaveAttribute('aria-label', 'DOWNLOAD_THIS_TUTORIAL_LINK');
      expect(wrapper.findTutorials()[0].findLearnMoreLink()!.getElement()).toHaveAttribute(
        'aria-label',
        'LEARN_MORE_ABOUT_TUTORIA'
      );
    });
  });
});
