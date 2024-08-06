// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LineChartProps } from '~components/line-chart';

const networkTrafficData = [
  { date: new Date(1600984800000), 'i-03736447': 68003, 'i-06f70d90': 46560, 'i-02924ba6': 25865, 'i-0e36f15f': 21350 },
  { date: new Date(1600985700000), 'i-03736447': 67382, 'i-06f70d90': 49666, 'i-02924ba6': 24253, 'i-0e36f15f': 21055 },
  { date: new Date(1600986600000), 'i-03736447': 74322, 'i-06f70d90': 47996, 'i-02924ba6': 25269, 'i-0e36f15f': 20188 },
  { date: new Date(1600987500000), 'i-03736447': 72499, 'i-06f70d90': 46020, 'i-02924ba6': 20308, 'i-0e36f15f': 22246 },
  { date: new Date(1600988400000), 'i-03736447': 69616, 'i-06f70d90': 46568, 'i-02924ba6': 24315, 'i-0e36f15f': 21998 },
  {
    date: new Date(1600989300000),
    'i-03736447': 70055,
    'i-06f70d90': 47205,
    'i-02924ba6': 25181,
    'i-0e36f15f': 190307,
  },
  {
    date: new Date(1600990200000),
    'i-03736447': 74055,
    'i-06f70d90': 46329,
    'i-02924ba6': 23027,
    'i-0e36f15f': 180385,
  },
  { date: new Date(1600991100000), 'i-03736447': 73420, 'i-06f70d90': 49614, 'i-02924ba6': 20500, 'i-0e36f15f': 21715 },
  { date: new Date(1600992000000), 'i-03736447': 65713, 'i-06f70d90': 49792, 'i-02924ba6': 25369, 'i-0e36f15f': 20760 },
  { date: new Date(1600992900000), 'i-03736447': 68954, 'i-06f70d90': 48284, 'i-02924ba6': 23369, 'i-0e36f15f': 21803 },
  { date: new Date(1600993800000), 'i-03736447': 74289, 'i-06f70d90': 47697, 'i-02924ba6': 24184, 'i-0e36f15f': 21356 },
  { date: new Date(1600994700000), 'i-03736447': 76521, 'i-06f70d90': 46463, 'i-02924ba6': 22768, 'i-0e36f15f': 20269 },
  { date: new Date(1600995600000), 'i-03736447': 78337, 'i-06f70d90': 47384, 'i-02924ba6': 21965, 'i-0e36f15f': 20700 },
  {
    date: new Date(1600996500000),
    'i-03736447': 105029,
    'i-06f70d90': 47986,
    'i-02924ba6': 23129,
    'i-0e36f15f': 20881,
  },
  {
    date: new Date(1600997400000),
    'i-03736447': 104961,
    'i-06f70d90': 49529,
    'i-02924ba6': 23483,
    'i-0e36f15f': 20082,
  },
  {
    date: new Date(1600998300000),
    'i-03736447': 102044,
    'i-06f70d90': 48146,
    'i-02924ba6': 21048,
    'i-0e36f15f': 21947,
  },
  {
    date: new Date(1600999200000),
    'i-03736447': 120062,
    'i-06f70d90': 46001,
    'i-02924ba6': 23181,
    'i-0e36f15f': 20636,
  },
  {
    date: new Date(1601000100000),
    'i-03736447': 140112,
    'i-06f70d90': 46649,
    'i-02924ba6': 22824,
    'i-0e36f15f': 21470,
  },
  {
    date: new Date(1601001000000),
    'i-03736447': 138935,
    'i-06f70d90': 47895,
    'i-02924ba6': 24827,
    'i-0e36f15f': 21910,
  },
  {
    date: new Date(1601001900000),
    'i-03736447': 139103,
    'i-06f70d90': 47977,
    'i-02924ba6': 23661,
    'i-0e36f15f': 20620,
  },
  {
    date: new Date(1601002800000),
    'i-03736447': 132378,
    'i-06f70d90': 46908,
    'i-02924ba6': 21907,
    'i-0e36f15f': 20412,
  },
  {
    date: new Date(1601003700000),
    'i-03736447': 112884,
    'i-06f70d90': 46496,
    'i-02924ba6': 59489,
    'i-0e36f15f': 22751,
  },
  {
    date: new Date(1601004600000),
    'i-03736447': 74689,
    'i-06f70d90': 47991,
    'i-02924ba6': 190975,
    'i-0e36f15f': 21277,
  },
  { date: new Date(1601005500000), 'i-03736447': 68451, 'i-06f70d90': 48881, 'i-02924ba6': 22827, 'i-0e36f15f': 21625 },
  { date: new Date(1601006400000), 'i-03736447': 66404, 'i-06f70d90': 48833, 'i-02924ba6': 20384, 'i-0e36f15f': 21267 },
  { date: new Date(1601007300000), 'i-03736447': 67037, 'i-06f70d90': 46665, 'i-02924ba6': 23365, 'i-0e36f15f': 21555 },
  { date: new Date(1601008200000), 'i-03736447': 70425, 'i-06f70d90': 49552, 'i-02924ba6': 23635, 'i-0e36f15f': 21072 },
  { date: new Date(1601009100000), 'i-03736447': 65583, 'i-06f70d90': 49013, 'i-02924ba6': 22462, 'i-0e36f15f': 21418 },
  { date: new Date(1601010000000), 'i-03736447': 67361, 'i-06f70d90': 48834, 'i-02924ba6': 23409, 'i-0e36f15f': 20808 },
  { date: new Date(1601010900000), 'i-03736447': 66421, 'i-06f70d90': 49644, 'i-02924ba6': 20730, 'i-0e36f15f': 22795 },
  { date: new Date(1601011800000), 'i-03736447': 69670, 'i-06f70d90': 48032, 'i-02924ba6': 21257, 'i-0e36f15f': 20953 },
  { date: new Date(1601012700000), 'i-03736447': 68534, 'i-06f70d90': 49544, 'i-02924ba6': 23190, 'i-0e36f15f': 20834 },
  { date: new Date(1601013600000), 'i-03736447': 71507, 'i-06f70d90': 49043, 'i-02924ba6': 23497, 'i-0e36f15f': 22604 },
];

export const networkTrafficDomain = [
  networkTrafficData[0].date,
  networkTrafficData[networkTrafficData.length - 1].date,
];

export const networkTrafficSeries: LineChartProps<Date>['series'] = [
  {
    title: 'i-03736447',
    type: 'line',
    valueFormatter: value => value.toLocaleString('en-US'),
    data: networkTrafficData.map(datum => ({ x: datum.date, y: datum['i-03736447'] })),
  },
  {
    title: 'i-06f70d90',
    type: 'line',
    valueFormatter: value => value.toLocaleString('en-US'),
    data: networkTrafficData.map(datum => ({ x: datum.date, y: datum['i-06f70d90'] })),
  },
  {
    title: 'i-02924ba6',
    type: 'line',
    valueFormatter: value => value.toLocaleString('en-US'),
    data: networkTrafficData.map(datum => ({ x: datum.date, y: datum['i-02924ba6'] })),
  },
  {
    title: 'i-0e36f15f',
    type: 'line',
    valueFormatter: value => value.toLocaleString('en-US'),
    data: networkTrafficData.map(datum => ({ x: datum.date, y: datum['i-0e36f15f'] })),
  },
];
