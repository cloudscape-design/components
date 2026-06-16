// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const cpuData = [
  { date: new Date(2020, 8, 16).getTime(), 'm1.large': 878, 'm1.xlarge': 491, 'm1.medium': 284, 'm1.small': 70 },
  { date: new Date(2020, 8, 17).getTime(), 'm1.large': 781, 'm1.xlarge': 435, 'm1.medium': 242, 'm1.small': 96 },
  { date: new Date(2020, 8, 18).getTime(), 'm1.large': 788, 'm1.xlarge': 478, 'm1.medium': 311, 'm1.small': 79 },
  { date: new Date(2020, 8, 19).getTime(), 'm1.large': 729, 'm1.xlarge': 558, 'm1.medium': 298, 'm1.small': 97 },
  { date: new Date(2020, 8, 20).getTime(), 'm1.large': 988, 'm1.xlarge': 530, 'm1.medium': 255, 'm1.small': 97 },
  { date: new Date(2020, 8, 21).getTime(), 'm1.large': 1016, 'm1.xlarge': 445, 'm1.medium': 339, 'm1.small': 70 },
  { date: new Date(2020, 8, 22).getTime(), 'm1.large': 987, 'm1.xlarge': 549, 'm1.medium': 273, 'm1.small': 62 },
  { date: new Date(2020, 8, 23).getTime(), 'm1.large': 986, 'm1.xlarge': 518, 'm1.medium': 341, 'm1.small': 67 },
  { date: new Date(2020, 8, 24).getTime(), 'm1.large': 925, 'm1.xlarge': 454, 'm1.medium': 382, 'm1.small': 68 },
  { date: new Date(2020, 8, 25).getTime(), 'm1.large': 742, 'm1.xlarge': 538, 'm1.medium': 361, 'm1.small': 70 },
  { date: new Date(2020, 8, 26).getTime(), 'm1.large': 920, 'm1.xlarge': 486, 'm1.medium': 262, 'm1.small': 91 },
  { date: new Date(2020, 8, 27).getTime(), 'm1.large': 826, 'm1.xlarge': 457, 'm1.medium': 248, 'm1.small': 76 },
  { date: new Date(2020, 8, 28).getTime(), 'm1.large': 698, 'm1.xlarge': 534, 'm1.medium': 243, 'm1.small': 66 },
  { date: new Date(2020, 8, 29).getTime(), 'm1.large': 1003, 'm1.xlarge': 523, 'm1.medium': 393, 'm1.small': 70 },
  { date: new Date(2020, 8, 30).getTime(), 'm1.large': 811, 'm1.xlarge': 527, 'm1.medium': 353, 'm1.small': 88 },
];

export const cpuSeries = [
  {
    name: 'm1.large',
    type: 'column',
    data: cpuData.map(datum => datum['m1.large']),
  },
  {
    name: 'm1.xlarge',
    type: 'column',
    data: cpuData.map(datum => datum['m1.xlarge']),
  },
  {
    name: 'm1.medium',
    type: 'column',
    data: cpuData.map(datum => datum['m1.medium']),
  },
  {
    name: 'm1.small',
    type: 'column',
    data: cpuData.map(datum => datum['m1.small']),
  },
] as const;
