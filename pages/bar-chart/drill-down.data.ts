// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import BarDataSeries = MixedLineBarChartProps.BarDataSeries;
import { padLeftZeros } from '~components/internal/utils/strings/pad-left-zeros';

export const months = [
  '2022-09',
  '2022-10',
  '2022-11',
  '2022-12',
  '2023-01',
  '2023-02',
  '2023-03',
  '2023-04',
  '2023-05',
  '2023-06',
  '2023-07',
  '2023-08',
];

export type ServiceId =
  | 'rds'
  | 'neptune'
  | 'quickSight'
  | 's3'
  | 'dax'
  | 'ecs'
  | 'openSearch'
  | 'cloudWatch'
  | 'kms'
  | 'dynamoDb'
  | 'athena'
  | 'lambda'
  | 'securityHub';

export const serviceNames: Record<string, string> = {
  rds: 'Relational Database Service',
  neptune: 'Neptune',
  quickSight: 'QuickSight',
  s3: 'S3',
  dax: 'DynamoDB Accelerator (DAX)',
  ecs: 'Elastic Container Service',
  openSearch: 'OpenSearch Service',
  cloudWatch: 'CloudWatch',
  kms: 'Key Management Service',
  dynamoDb: 'DynamoDB',
  athena: 'Athena',
  lambda: 'Lambda',
  securityHub: 'Security Hub',
};

export const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const monthlySeriesByService: Record<string, BarDataSeries<string>> = {
  rds: {
    title: serviceNames.rds,
    type: 'bar',
    data: [
      { x: months[6], y: 120 },
      { x: months[7], y: 295 },
      { x: months[8], y: 300 },
      { x: months[9], y: 290 },
      { x: months[10], y: 295 },
      { x: months[11], y: 295 },
    ],
    valueFormatter: dollarFormatter,
  },
  neptune: {
    title: serviceNames.neptune,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 251 })),
    valueFormatter: dollarFormatter,
  },
  quickSight: {
    title: serviceNames.quickSight,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 120 })),
    valueFormatter: dollarFormatter,
  },
  s3: {
    title: serviceNames.s3,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 117 })),
    valueFormatter: dollarFormatter,
  },
  dax: {
    title: serviceNames.dax,
    type: 'bar',
    data: [
      { x: months[4], y: 650 },
      { x: months[5], y: 100 },
    ],
    valueFormatter: dollarFormatter,
  },
  ecs: {
    title: serviceNames.ecs,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 10 })),
    valueFormatter: dollarFormatter,
  },
  openSearch: {
    title: serviceNames.openSearch,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 27 })),
    valueFormatter: dollarFormatter,
  },
  cloudWatch: {
    title: serviceNames.cloudWatch,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 22 })),
    valueFormatter: dollarFormatter,
  },
  kms: {
    title: serviceNames.kms,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 19 })),
    valueFormatter: dollarFormatter,
  },
  dynamoDb: {
    title: serviceNames.dynamoDb,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 10 })),
    valueFormatter: dollarFormatter,
  },
  athena: {
    title: serviceNames.athena,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 60 })),
    valueFormatter: dollarFormatter,
  },
  lambda: {
    title: serviceNames.lambda,
    type: 'bar',
    data: months.map((month, index) => ({ x: month, y: index === 8 ? 2200 : 60 })),
    valueFormatter: dollarFormatter,
  },
  securityHub: {
    title: serviceNames.securityHub,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 30 })),
    valueFormatter: dollarFormatter,
  },
  other: {
    title: 'Other',
    type: 'bar',
    data: [
      { x: months[0], y: 10 },
      { x: months[1], y: 10 },
      { x: months[2], y: 30 },
      { x: months[3], y: 35 },
      { x: months[4], y: 35 },
      { x: months[5], y: 60 },
      { x: months[6], y: 25 },
      { x: months[7], y: 20 },
      {
        x: months[8],
        y: 2300,
        details: [
          {
            key: serviceNames.dynamoDb,
            value: 10,
          },
          {
            key: serviceNames.athena,
            value: 60,
          },
          {
            key: serviceNames.lambda,
            value: 2200,
          },
          {
            key: serviceNames.securityHub,
            value: 30,
          },
        ],
      },
      { x: months[9], y: 35 },
      { x: months[10], y: 120 },
      { x: months[11], y: 120 },
    ],
    valueFormatter: dollarFormatter,
  },
};

export const monthlyServices = ['rds', 'neptune', 'quickSight', 's3', 'dax', 'ecs', 'openSearch', 'kms'];

export const monthlySeries: ReadonlyArray<BarDataSeries<string>> = [
  monthlySeriesByService.rds,
  monthlySeriesByService.neptune,
  monthlySeriesByService.quickSight,
  monthlySeriesByService.s3,
  monthlySeriesByService.dax,
  monthlySeriesByService.ecs,
  monthlySeriesByService.openSearch,
  monthlySeriesByService.kms,
  monthlySeriesByService.other,
];

const sampleYear = 2023,
  sampleMonthIndex = 4;
export const days = Array(new Date(sampleYear, sampleMonthIndex + 1, 0).getDate())
  .fill(0)
  .map(
    (item, index) =>
      `${sampleYear}-${padLeftZeros((sampleMonthIndex + 1).toString(), 2)}-${padLeftZeros((index + 1).toString(), 2)}`
  );

const baseDailySampleData = [
  { x: '2023-05-01', y: 80 },
  { x: '2023-05-02', y: 22 },
  { x: '2023-05-03', y: 40 },
  { x: '2023-05-04', y: 80 },
  { x: '2023-05-05', y: 56 },
  { x: '2023-05-06', y: 56 },
  { x: '2023-05-07', y: 80 },
  { x: '2023-05-08', y: 135 },
  { x: '2023-05-09', y: 135 },
  { x: '2023-05-10', y: 135 },
  { x: '2023-05-11', y: 84 },
  { x: '2023-05-12', y: 81 },
  { x: '2023-05-13', y: 78 },

  { x: '2023-05-14', y: 78 },

  { x: '2023-05-15', y: 118 },
  { x: '2023-05-16', y: 135 },
  { x: '2023-05-17', y: 100 },
  { x: '2023-05-18', y: 84 },
  { x: '2023-05-19', y: 81 },
  { x: '2023-05-20', y: 78 },

  { x: '2023-05-21', y: 80 },

  { x: '2023-05-22', y: 135 },
  { x: '2023-05-23', y: 81 },
  { x: '2023-05-24', y: 84 },
  { x: '2023-05-25', y: 89 },

  { x: '2023-05-26', y: 80 },
  { x: '2023-05-27', y: 80 },
  { x: '2023-05-28', y: 80 },
  { x: '2023-05-29', y: 80 },
  { x: '2023-05-30', y: 80 },
  { x: '2023-05-31', y: 80 },
];

function getBaseDailySampleData(n: number) {
  return baseDailySampleData.map(item => ({ x: item.x, y: (item.y * n) / (3000 - 393) }));
}

function getDailyData(serviceId: ServiceId): BarDataSeries<string> {
  return {
    title: serviceNames[serviceId],
    type: 'bar',
    data: getBaseDailySampleData(monthlySeriesByService[serviceId].data.find(({ x }) => x === months[8])?.y || 100),
  };
}

export const dailySeriesByService: Record<string, BarDataSeries<string>> = {
  rds: getDailyData('rds'),
  neptune: getDailyData('neptune'),
  quickSight: getDailyData('quickSight'),
  s3: getDailyData('s3'),
  dax: getDailyData('dax'),
  ecs: getDailyData('ecs'),
  openSearch: getDailyData('openSearch'),
  cloudWatch: getDailyData('cloudWatch'),
  kms: getDailyData('kms'),
  dynamoDb: getDailyData('dynamoDb'),
  athena: getDailyData('athena'),
  securityHub: getDailyData('securityHub'),
  lambda: {
    title: serviceNames.lambda,
    type: 'bar',
    data: [
      { x: '2023-05-02', y: 22 },
      { x: '2023-05-03', y: 40 },
      { x: '2023-05-05', y: 56 },
      { x: '2023-05-06', y: 56 },
      { x: '2023-05-08', y: 135 },
      { x: '2023-05-09', y: 135 },
      { x: '2023-05-10', y: 135 },
      { x: '2023-05-11', y: 84 },
      { x: '2023-05-12', y: 81 },
      { x: '2023-05-13', y: 78 },
      { x: '2023-05-15', y: 118 },
      { x: '2023-05-16', y: 135 },
      {
        x: '2023-05-17',
        y: 493,
        link: { href: '#/light/bar-chart/bills/?' + window.location.href.split('?')[1], external: true },
        key: 'All accounts',
      },
      { x: '2023-05-18', y: 84 },
      { x: '2023-05-19', y: 81 },
      { x: '2023-05-20', y: 78 },
      { x: '2023-05-22', y: 135 },
      { x: '2023-05-23', y: 81 },
      { x: '2023-05-24', y: 84 },
      { x: '2023-05-25', y: 89 },
    ],
    valueFormatter: dollarFormatter,
  },
};

export const dailyMaySeries = [
  dailySeriesByService.rds,
  dailySeriesByService.neptune,
  dailySeriesByService.quickSight,
  dailySeriesByService.s3,
  dailySeriesByService.dax,
  dailySeriesByService.ecs,
  dailySeriesByService.openSearch,
  dailySeriesByService.kms,
  dailySeriesByService.lambda,
  dailySeriesByService.cloudWatch,
  dailySeriesByService.dynamoDb,
  dailySeriesByService.athena,
  dailySeriesByService.securityHub,
];
