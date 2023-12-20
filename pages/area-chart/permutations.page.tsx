// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AreaChartProps } from '~components/area-chart';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

import ScreenshotArea from '../utils/screenshot-area';

import Example, { ExampleProps } from './example';

const series: readonly AreaChartProps.Series<number>[] = [
  {
    title: 'p50',
    type: 'area',
    data: [
      { x: 1, y: 30.413934260428764 },
      { x: 2, y: 30.398644318247598 },
      { x: 3, y: 31.17087796748336 },
      { x: 4, y: 31.154713292545075 },
      { x: 5, y: 30.566976535213033 },
      { x: 6, y: 30.54990869119804 },
      { x: 7, y: 31.615434553424265 },
      { x: 8, y: 31.4910064178892 },
      { x: 9, y: 31.14933558333676 },
      { x: 10, y: 30.90973367019943 },
      { x: 11, y: 31.328368010882325 },
      { x: 12, y: 30.87433084532036 },
      { x: 13, y: 30.335544087395792 },
      { x: 14, y: 31.988167292375987 },
      { x: 15, y: 30.84896151317207 },
      { x: 16, y: 31.00113717780503 },
      { x: 17, y: 31.545862680309813 },
      { x: 18, y: 30.863477481286996 },
      { x: 19, y: 31.339529253215346 },
      { x: 20, y: 30.649238746337936 },
      { x: 21, y: 31.64001786986271 },
      { x: 22, y: 30.321221170743634 },
      { x: 23, y: 30.961953482319522 },
      { x: 24, y: 31.731311589529007 },
      { x: 25, y: 30.5512081710826 },
    ],
  },
  {
    title: 'p60',
    type: 'area',
    data: [
      { x: 1, y: 66.35534232160589 },
      { x: 2, y: 66.27438630129241 },
      { x: 3, y: 49.83885993496894 },
      { x: 4, y: 66.31295873240052 },
      { x: 5, y: 63.944533063210706 },
      { x: 6, y: 46.18924655081278 },
      { x: 7, y: 58.01320817715364 },
      { x: 8, y: 58.90268411448915 },
      { x: 9, y: 52.06570185538751 },
      { x: 10, y: 57.22346854973787 },
      { x: 11, y: 55.344306509450796 },
      { x: 12, y: 37.69678313269839 },
      { x: 13, y: 62.87848114015176 },
      { x: 14, y: 48.7591047976579 },
      { x: 15, y: 55.99072184280791 },
      { x: 16, y: 63.63821387776116 },
      { x: 17, y: 74.32482802995509 },
      { x: 18, y: 68.34723985040648 },
      { x: 19, y: 38.87323744699138 },
      { x: 20, y: 55.63442316094745 },
      { x: 21, y: 61.35894461525148 },
      { x: 22, y: 55.72090915372521 },
      { x: 23, y: 65.09743429248738 },
      { x: 24, y: 66.25518471340474 },
      { x: 25, y: 52.32144768362599 },
    ],
  },
  { title: 'Limit', type: 'threshold', y: 150, color: 'gray' },
  {
    title: 'p90',
    type: 'area',
    data: [
      { x: 1, y: 63.662439851710495 },
      { x: 2, y: 76.29064722752123 },
      { x: 3, y: 76.887047690678 },
      { x: 4, y: 115.2373456671628 },
      { x: 5, y: 69.47957781512599 },
      { x: 6, y: 65.91730880650331 },
      { x: 7, y: 96.124638332016 },
      { x: 8, y: 108.84556866110469 },
      { x: 9, y: 124.30767412974818 },
      { x: 10, y: 106.96448530158823 },
      { x: 11, y: 86.14022788060404 },
      { x: 12, y: 83.8137469375633 },
      { x: 13, y: 101.4562706276698 },
      { x: 14, y: 115.93856858716059 },
      { x: 15, y: 105.59445437769982 },
      { x: 16, y: 120.30678397160084 },
      { x: 17, y: 68.14418120957981 },
      { x: 18, y: 118.295358462793 },
      { x: 19, y: 80.21480917575825 },
      { x: 20, y: 99.23201096732213 },
      { x: 21, y: 109.83953830029573 },
      { x: 22, y: 88.55313113487432 },
      { x: 23, y: 74.27020498945947 },
      { x: 24, y: 103.33029704234607 },
      { x: 25, y: 77.127237352675 },
    ],
  },
];

const permutations = createPermutations<ExampleProps<any>>([
  {
    name: ['Permutation:states'],
    series: [series],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    yScaleType: ['linear'],
    statusType: ['loading', 'finished', 'error'],
  },
  {
    name: ['Permutation:empty'],
    series: [series, series.filter(s => s.type === 'threshold'), []],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    yScaleType: ['linear'],
  },
  {
    name: ['Permutation:legend'],
    series: [series],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    hideLegend: [true, false],
  },
  {
    name: ['Permutation:filter'],
    series: [series],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    hideFilter: [true, false],
    additionalFilters: [<div key="">Custom filters</div>],
  },
  {
    name: ['Permutation:visible'],
    series: [series],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    visibleSeries: [[], series.slice(0, 1), series.slice(0, 2)],
  },
  {
    name: ['Permutation:series'],
    series: [series, series.slice(3)],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    yScaleType: ['linear'],
  },
  {
    name: ['Permutation:scales'],
    series: [series],
    xTitle: ['X'],
    xScaleType: ['linear'],
    yTitle: ['Y'],
    yDomain: [[1, 250]],
    yScaleType: ['linear', 'log'],
  },
]);

export default function () {
  return (
    <>
      <h1>Area chart permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Example isPermutation={true} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
