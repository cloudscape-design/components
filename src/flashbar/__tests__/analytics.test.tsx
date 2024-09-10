// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';

import { clearOneTimeMetricsCache } from '@cloudscape-design/component-toolkit/internal/testing';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import { DATA_ATTR_ANALYTICS_FLASHBAR } from '../../../lib/components/internal/analytics/selectors';
import { createFlashbarWrapper } from './common';

declare global {
  interface Window {
    panorama?: any;
  }
}

const toggleButtonSelector = 'button';

function findFlashbarMetric() {
  return jest.mocked(window.panorama).mock.calls.filter((args: any) => args[1].eventContext === 'csa_flashbar');
}

describe('Analytics', () => {
  beforeEach(() => {
    window.panorama = () => {};
    jest.spyOn(window, 'panorama');
  });
  afterEach(() => {
    clearOneTimeMetricsCache();
  });

  it('does not send a metric when an empty array is provided', () => {
    createFlashbarWrapper(<Flashbar items={[]} />);
    expect(findFlashbarMetric()).toHaveLength(0);
  });

  it('sends a render metric when items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(findFlashbarMetric()).toEqual([
      [
        'trackCustomEvent',
        expect.objectContaining({
          eventContext: 'csa_flashbar',
          eventType: 'render',
          eventValue: '2',
          eventDetail: expect.any(String),
          timestamp: expect.any(Number),
        }),
      ],
    ]);
  });

  it('sends a render metric when stacked items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        stackItems={true}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(findFlashbarMetric()).toEqual([
      [
        'trackCustomEvent',
        expect.objectContaining({
          eventContext: 'csa_flashbar',
          eventType: 'render',
          eventValue: '2',
          eventDetail: expect.any(String),
          timestamp: expect.any(Number),
        }),
      ],
    ]);
  });

  it('does not send duplicate render metrics on multiple renders', () => {
    const items: FlashbarProps['items'] = [
      { type: 'error', header: 'Error', content: 'There was an error' },
      { type: 'success', header: 'Success', content: 'Everything went fine' },
    ];

    const { rerender } = reactRender(<Flashbar items={items} />);
    jest.mocked(window.panorama).mockClear();
    rerender(<Flashbar items={items} />);
    expect(window.panorama).toBeCalledTimes(0);
  });

  it('sends an expand metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        stackItems={true}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    jest.mocked(window.panorama).mockClear();

    wrapper.find(toggleButtonSelector)!.click();

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'expand',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a collapse metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        stackItems={true}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    wrapper.find(toggleButtonSelector)!.click(); // expand
    jest.mocked(window.panorama).mockClear(); // clear previous events

    wrapper.find(toggleButtonSelector)!.click(); // collapse
    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'collapse',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a dismiss metric when a flash item is dismissed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        items={[
          { type: 'error', header: 'Error', content: 'There was an error', dismissible: true, onDismiss: () => {} },
        ]}
      />
    );
    jest.mocked(window.panorama).mockClear(); // clear render event
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'dismiss',
        eventValue: 'error',
        timestamp: expect.any(Number),
      })
    );
  });

  describe('analytics', () => {
    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the flashbar type`, () => {
      const { container } = reactRender(<Flashbar items={[{ id: '0', type: 'success' }]} />);
      expect(container.querySelector(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="success"]`)).toBeInTheDocument();
    });

    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the effective flashbar type when loading`, () => {
      const { container } = reactRender(<Flashbar items={[{ id: '0', type: 'success', loading: true }]} />);
      expect(container.querySelector(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="info"]`)).toBeInTheDocument();
    });
  });
});
