// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TableItem {
  order?: number;
  instanceid?: string;
  state?: number;
  instancetype?: string;
  averagelatency?: number;
  availablestorage?: number;
  owner?: string;
  privateipaddress?: string;
  publicdns?: string;
  ipv4publicip?: string;
  securitygroup?: string;
  releasedate?: Date;
  launchdate?: Date;
  lasteventat?: Date;
}

export const states: Record<number, string> = {
  0: 'Stopped',
  1: 'Stopping',
  2: 'Pending',
};

export const allItems: TableItem[] = Array(3000)
  .fill(0)
  .map((_item, index) => ({
    instanceid: `i-3b44795b1fea36ac${index}`,
    state: 0,
    instancetype: 't3.large',
    averagelatency: 636,
    availablestorage: 3.57,
    owner: 'admin512',
    privateipaddress: '97.34.33.202',
    publicdns: 'ec2-10-15-87-78.us-west-1.compute.amazonaws.com',
    ipv4publicip: '62.36.39.27',
    securitygroup: 'launch-wizard-26',
    launchdate: '2019-05-10',
    lasteventat: '2022-02-06T19:58:40',
  }))
  .map((item, indx) => ({
    order: indx,
    ...item,
    stopped: item.state === 0,
    releasedate: new Date(new Date(item.launchdate).getTime() - getRandomTimeHours(10, 2000)),
    launchdate: new Date(item.launchdate),
    lasteventat: new Date(item.lasteventat),
  }));

function getRandomTimeHours(min: number, max: number) {
  min = min * 1000 * 60 * 60;
  max = max * 1000 * 60 * 60;
  return Math.floor(Math.random() * (max - min) + min);
}
