// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { calculatePosition } from '../../../lib/components/dropdown/dropdown-fit-handler';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/dropdown/dropdown-fit-handler', () => {
  const originalModule = jest.requireActual('../../../lib/components/dropdown/dropdown-fit-handler');
  return {
    ...originalModule,
    calculatePosition: jest.fn(originalModule.calculatePosition),
  };
});

function renderButtonDropdown(
  groupItems: ButtonDropdownProps.Items,
  status: ButtonDropdownProps.AsyncLoadingStatusType
) {
  return (
    <ButtonDropdown
      expandableGroups={true}
      items={[{ id: 'g1', text: 'Resources', items: groupItems }]}
      getExpandableItemsAsyncLoadingState={() => status}
      asyncLoadingProps={{ loadingText: () => 'Loading' }}
      onLoadItems={() => {}}
    >
      Actions
    </ButtonDropdown>
  );
}

async function flushContentChanges() {
  await act(async () => {
    await Promise.resolve();
    jest.runOnlyPendingTimers();
  });
}

describe('ButtonDropdown expandable group dropdown width', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('recalculates the group dropdown with fixed attachment sides when long items load', async () => {
    const { container, rerender } = render(renderButtonDropdown([], 'loading'));
    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })).not.toBeNull();

    const flyout = () => Array.from(container.querySelectorAll<HTMLElement>('[data-open="true"]')).pop()!;
    const widthBefore = parseFloat(flyout().style.inlineSize) || 0;
    const originalCalculatePosition = jest.requireActual(
      '../../../lib/components/dropdown/dropdown-fit-handler'
    ).calculatePosition;
    (calculatePosition as jest.Mock).mockClear();
    (calculatePosition as jest.Mock).mockImplementation((...args: unknown[]) => {
      const [position, triggerBox] = originalCalculatePosition(...args);
      return [
        { ...position, inlineSize: args[3] === true ? `${widthBefore + 200}px` : position.inlineSize },
        triggerBox,
      ];
    });
    rerender(
      renderButtonDropdown(
        [
          {
            id: 'long',
            text: 'arn:aws:apprunner:ap-southeast-2:123456789012:autoscalingconfiguration/DefaultConfiguration/1/0001',
          },
        ],
        'finished'
      )
    );
    await flushContentChanges();

    const interiorCalls = (calculatePosition as jest.Mock).mock.calls.filter(args => args[3] === true);
    expect(interiorCalls).toHaveLength(1);
    expect(interiorCalls[0][interiorCalls[0].length - 1]).toEqual({ dropBlockStart: false, dropInlineStart: false });
    expect(flyout().style.inlineSize).toBe(`${widthBefore + 200}px`);
    (calculatePosition as jest.Mock).mockImplementation(originalCalculatePosition);
  });
});
