// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import { isMotionDisabled } from '../motion';

const matchMedia = jest.fn();
window.matchMedia = matchMedia;

beforeEach(() => {
  matchMedia.mockReturnValue({ matches: false });
});

describe('isMotionDisabled', () => {
  test('returns false when there is no awsui-motion-disabled class', () => {
    const renderResult = render(
      <div>
        <div id="test-element">Content</div>
      </div>
    );
    const element = createWrapper(renderResult.container).find('#test-element')!.getElement();
    expect(isMotionDisabled(element)).toEqual(false);
  });
  test('returns true when a parent element has awsui-motion-disabled class', () => {
    const renderResult = render(
      <div className="awsui-motion-disabled">
        <div>
          <div>
            <div>
              <div>
                <div id="test-element">Content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    const element = createWrapper(renderResult.container).find('#test-element')!.getElement();
    expect(isMotionDisabled(element)).toEqual(true);
  });
  test('returns false when there is an element with class awsui-motion-disabled, but it is not in the hierarchy', () => {
    const renderResult = render(
      <div>
        <div className="awsui-motion-disabled">Content</div>
        <div id="test-element">Content</div>
      </div>
    );
    const element = createWrapper(renderResult.container).find('#test-element')!.getElement();
    expect(isMotionDisabled(element)).toEqual(false);
  });
  test('returns true with prefers-reduced-motion: reduce ', () => {
    matchMedia.mockReturnValue({ matches: true });
    const renderResult = render(
      <div>
        <div id="test-element">Content</div>
      </div>
    );
    const element = createWrapper(renderResult.container).find('#test-element')!.getElement();
    expect(isMotionDisabled(element)).toEqual(true);
  });
  test('returns true with prefers-reduced-motion: reduce and class awsui-motion-disabled', () => {
    matchMedia.mockReturnValue({ matches: true });
    const renderResult = render(
      <div className="awsui-motion-disabled">
        <div id="test-element">Content</div>
      </div>
    );
    const element = createWrapper(renderResult.container).find('#test-element')!.getElement();
    expect(isMotionDisabled(element)).toEqual(true);
  });
});
