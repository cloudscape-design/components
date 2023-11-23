// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import SpaceBetween from '~components/space-between';
import Link from '~components/link';
import PieChart from '~components/pie-chart';
import ScreenshotArea from '../utils/screenshot-area';
import AppContext, { AppContextType } from '../app/app-context';
import FocusTarget from '../common/focus-target';

type DemoContext = React.Context<
  AppContextType<{
    useLinks: 'keys' | 'values' | null;
  }>
>;

import { commonProps, data1, FoodData, segmentDescription1 } from './common';

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <>
      <h1>Pie chart with links</h1>
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
      <FocusTarget />
      <ScreenshotArea>
        <PieChart<FoodData>
          {...commonProps}
          hideFilter={true}
          hideLegend={true}
          statusType="finished"
          data={data1}
          ariaLabel="Food facts"
          size="medium"
          legendTitle="Legend"
          ariaDescription="Potatoes are most delicious"
          detailPopoverContent={datum =>
            [
              {
                key: 'Popularity',
                value: `${datum.value}%`,
              },
              {
                key: 'Calories per 100g',
                value: `${datum.calories} kcal`,
              },
            ].map(({ key, value }) => ({
              key:
                urlParams.useLinks === 'keys' ? (
                  <Link external={true} href="#">
                    {key}
                  </Link>
                ) : (
                  key
                ),
              value:
                urlParams.useLinks === 'values' ? (
                  <Link external={true} href="#" ariaLabel={`${key}: ${value}`}>
                    {value}
                  </Link>
                ) : (
                  value
                ),
            }))
          }
          segmentDescription={segmentDescription1}
          hideDescriptions={true}
          hideTitles={true}
        />
      </ScreenshotArea>
    </>
  );
}
