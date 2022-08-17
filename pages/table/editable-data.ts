// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as awsuiColors from '~design-tokens';

const statistics = ['Average', 'Minimum', 'Maximum', 'Sum', 'p99', 'tm99'] as const;
type Statistic = typeof statistics[number];
const periods = ['1 second', '10 seconds', '1 minute', '5 minutes', '15 minutes', '1 hour', '6 hours'] as const;
type Period = typeof periods[number];

export interface Metric {
  label: string;
  expression: string;
  color: string;
  enabled?: boolean;
  statistic: Statistic;
  period: Period;
}

export const initialItems: Array<Metric> = [
  {
    color: awsuiColors.colorChartsPaletteCategorical1,
    label: 'TTI',
    expression: '62703b497975c0c41204d19b',
    statistic: 'Minimum',
    period: '15 minutes',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical2,
    label: 'HZ',
    expression: '62703b49fe9e4146500e3090',
    statistic: 'Maximum',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical3,
    label: 'Total',
    expression: '62703b497e6df82d9138d923',
    statistic: 'p99',
    period: '6 hours',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical4,
    label: 'HZ',
    expression: '62703b495191b61fe65504a6',
    statistic: 'Average',
    period: '1 second',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical5,
    label: 'FR',
    expression: '62703b49b68087c249dc8608',
    statistic: 'Maximum',
    period: '15 minutes',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical6,
    label: 'LCP',
    expression: '62703b49fc70df0a022faded',
    statistic: 'Minimum',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical7,
    label: 'LCP',
    expression: '62703b49a24bb865df56e3ca',
    statistic: 'Maximum',
    period: '10 seconds',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical8,
    label: 'PON',
    expression: '62703b494fb262d62cfb8500',
    statistic: 'Average',
    period: '1 minute',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical9,
    label: 'HZ',
    expression: '62703b49ae4cd00fc7e58d0f',
    statistic: 'Maximum',
    period: '1 second',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical10,
    label: 'HZ',
    expression: '62703b499af173a8da10f9c6',
    statistic: 'Sum',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical11,
    label: 'FR',
    expression: '62703b49214c8456e13168ab',
    statistic: 'Average',
    period: '1 minute',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical12,
    label: 'LCP',
    expression: '62703b49a02a291f51d87d77',
    statistic: 'p99',
    period: '6 hours',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical13,
    label: 'PON',
    expression: '62703b49b604cd000bef4bba',
    statistic: 'p99',
    period: '6 hours',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical14,
    label: 'TTI',
    expression: '62703b4962426154ba2b6e23',
    statistic: 'Sum',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical15,
    label: 'HZ',
    expression: '62703b49518282e39f13df95',
    statistic: 'tm99',
    period: '5 minutes',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical16,
    label: 'BT',
    expression: '62703b492810b1f8f1bc7226',
    statistic: 'Average',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical17,
    label: 'LCP',
    expression: '62703b49a1598476effdc1fb',
    statistic: 'p99',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical18,
    label: 'Average Average',
    expression: '62703b498192575bff415c09',
    statistic: 'Maximum',
    period: '1 hour',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical19,
    label: 'BT',
    expression: '62703b4935c15d6a2fa8f28c',
    statistic: 'p99',
    period: '1 minute',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical20,
    label: 'Average Average',
    expression: '62703b49ab8d8507e1ed228f',
    statistic: 'p99',
    period: '10 seconds',
  },
  {
    color: awsuiColors.colorChartsPaletteCategorical21,
    label: 'FR',
    period: '15 minutes',
    statistic: 'Maximum',
    expression: '62703b49b68087c249dc8608',
  },
];
