// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import AppContext, { AppContextType } from '../app/app-context';
import DrilldownChart, { DrilldownChartProps } from './drilldown-chart';

type DemoContext = React.Context<AppContextType<DrilldownChartProps>>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <>
      <h1>Bar chart drilldown</h1>
      <SpaceBetween direction="horizontal" size="s">
        <label>
          <input
            type="checkbox"
            checked={urlParams.horizontalBars || false}
            onChange={event => setUrlParams({ horizontalBars: event.target.checked })}
          />{' '}
          Horizontal bars
        </label>
        <label>
          <input
            type="checkbox"
            checked={urlParams.expandableSubItems || false}
            onChange={event => setUrlParams({ expandableSubItems: event.target.checked })}
          />{' '}
          Expandable sub-items
        </label>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="s">
        <label>
          <input
            type="radio"
            name="links"
            value="keys"
            onChange={() => setUrlParams({ useLinks: 'keys' })}
            checked={urlParams.useLinks === 'keys'}
          />{' '}
          Links in keys
        </label>
        <label>
          <input
            type="radio"
            name="links"
            value="values"
            onChange={() => setUrlParams({ useLinks: 'values' })}
            checked={urlParams.useLinks === 'values'}
          />{' '}
          Links in values
        </label>
        <label>
          <input
            type="radio"
            name="links"
            value="none"
            onChange={() => setUrlParams({ useLinks: undefined })}
            checked={!urlParams.useLinks}
          />{' '}
          No links
        </label>
      </SpaceBetween>
      <ScreenshotArea>
        <DrilldownChart
          horizontalBars={urlParams.horizontalBars}
          useLinks={urlParams.useLinks}
          expandableSubItems={urlParams.expandableSubItems}
        />
      </ScreenshotArea>
    </>
  );
}
