// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { EC2Instance } from './types';

const getElement = <T>(array: T[], loopedIndex: number) => array[loopedIndex % array.length];

const instances: EC2Instance[] = Array.from({ length: 50 }).map((item, i) => ({
  id: `XLOWCQQFJJHM8${i}`,
  type: getElement(['m5.large', 'm5.xlarge', 'm5.4xlarge'], i),
  publicDns: `231.50.3.${i}`,
  monitoring: 'Default',
  state: getElement(['Activated', 'Deactivated'], i),
  platformDetails: getElement(['Linux', 'Windows'], i),
  terminalProtection: 'on',
  launchTime: `2021-05-12 16:53:${i.toString().padStart(2, '0')} GMT+0200 CEST`,
  volume: getElement([1, 2, 3, 4, 5], i),
  securityGroups: getElement([['groupA', 'groupB'], ['groupC', 'groupD', 'groupE'], ['groupF']], i),
  loadBalancers: getElement(
    [
      ['lb-1', 'lb-2'],
      ['lb-3', 'lb-4', 'lb-5'],
      ['lb-6', 'lb-7', 'lb-8', 'lb-9'],
    ],
    i
  ),
  availabilityZone: getElement(['AZ 1', 'AZ 2'], i),
  numOfvCpu: getElement([3, 5, 9], i),
  inboundRules: [
    {
      type: 'All traffic',
      protocol: 'All',
      portRange: 'All',
      source: `sg-abcdefg${i} (default)`,
      description: '-',
    },
    {
      type: 'Custom TCP',
      protocol: 'TCP',
      portRange: '8182',
      source: `sg-dfs${i} (default)`,
      description: '-',
    },
  ],
}));

export default instances;
