// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../__tests__/render-hook';
import { DropdownOption, OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { flattenOptions } from '../../internal/components/option/utils/flatten-options';
import { useAnnouncement } from '../utils/use-announcement';

const options = [
  {
    label: 'Group 1',
    options: [
      {
        label: 'Child 1',
        value: 'should-not-be-announced-1',
      },
      {
        label: 'Child 2',
        value: 'should-not-be-announced-2',
      },
    ],
  },
  {
    label: 'Option 1',
    labelTag: 'bx',
  },
  {
    label: 'Group 2',
    disabled: true,
    options: [
      {
        label: 'Child 1',
        value: 'should-not-be-announced-3',
      },
      {
        label: 'Child 2',
        value: 'should-not-be-announced-4',
        disabled: true,
      },
    ],
  },
];

const { flatOptions, parentMap } = flattenOptions(options);
const getParent = (option: DropdownOption) => parentMap.get(option)?.option as undefined | OptionGroup;

describe('useAnnouncement', () => {
  const animationFrameRequests: FrameRequestCallback[] = [];
  const originalRequestAnimationFrame = window.requestAnimationFrame;

  const runAllCallbacks = () => animationFrameRequests.forEach(cb => cb(0));

  beforeEach(() => {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      animationFrameRequests.push(callback);
      return 0;
    };
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test('should return empty string when there is no highlighted or selected option', () => {
    const hook = renderHook(useAnnouncement, {
      initialProps: { getParent, selectedAriaLabel: 'Selected', announceSelected: false },
    });
    expect(hook.result.current).toEqual('');
  });

  test('should return announcement string when there is a highlighted option', () => {
    const hook = renderHook(useAnnouncement, {
      initialProps: { getParent, highlightedOption: flatOptions[3], announceSelected: false },
    });
    expect(hook.result.current).toEqual('Option 1 bx');
  });

  test('should return announcement string when there is a highlighted option in a group', () => {
    const hook = renderHook(useAnnouncement, {
      initialProps: { getParent, highlightedOption: flatOptions[1], announceSelected: false },
    });
    expect(hook.result.current).toEqual('Group 1 Child 1');
  });

  test('announcement should be prepended with selected label, if highlighted item is selected', () => {
    const hook = renderHook(useAnnouncement, {
      initialProps: {
        getParent,
        selectedAriaLabel: 'Selected',
        highlightedOption: flatOptions[1],
        announceSelected: true,
      },
    });
    expect(hook.result.current).toEqual('Selected Group 1 Child 1');
  });

  test('should return custom announcement string when renderHighlightedAriaLive is provided', () => {
    const hook = renderHook(useAnnouncement, {
      initialProps: {
        getParent,
        highlightedOption: flatOptions[1],
        renderHighlightedAriaLive: (option: OptionDefinition, group?: OptionGroup) =>
          `item ${option.label} in category ${group?.label}`,
        announceSelected: false,
      },
    });
    expect(hook.result.current).toEqual('item Child 1 in category Group 1');
  });

  test('should include group announcement only the first time the group is entered', () => {
    const props = { getParent, highlightedOption: flatOptions[1], announceSelected: false };
    const hook = renderHook(useAnnouncement, { initialProps: props });
    expect(hook.result.current).toEqual('Group 1 Child 1');

    // Ignore simple re-renders.
    hook.rerender(props);
    expect(hook.result.current).toEqual('Group 1 Child 1');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[2] });
    expect(hook.result.current).toEqual('Child 2');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[1] });
    expect(hook.result.current).toEqual('Child 1');
  });

  test('should repeat group announcement after entering an orphan option', () => {
    const props = { getParent, highlightedOption: flatOptions[1], announceSelected: false };
    const hook = renderHook(useAnnouncement, { initialProps: props });
    expect(hook.result.current).toEqual('Group 1 Child 1');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[3] });
    expect(hook.result.current).toEqual('Option 1 bx');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[1] });
    expect(hook.result.current).toEqual('Group 1 Child 1');
  });

  test('should repeat group announcement after entering a different group option', () => {
    const props = { getParent, highlightedOption: flatOptions[1], announceSelected: false };
    const hook = renderHook(useAnnouncement, { initialProps: props });
    expect(hook.result.current).toEqual('Group 1 Child 1');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[5] });
    expect(hook.result.current).toEqual('Group 2 Child 1');

    runAllCallbacks();
    hook.rerender({ ...props, highlightedOption: flatOptions[1] });
    expect(hook.result.current).toEqual('Group 1 Child 1');
  });
});
