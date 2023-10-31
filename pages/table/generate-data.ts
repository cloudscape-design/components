// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import range from 'lodash/range';
import padStart from 'lodash/padStart';
import pseudoRandom from '../utils/pseudo-random';

export type InstanceState = 'PENDING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'TERMINATING' | 'TERMINATED';

export interface Instance {
  id: string;
  state: InstanceState;
  type: string;
  imageId: string;
  dnsName?: string;
}

export function id() {
  const id = Math.ceil(pseudoRandom() * Math.pow(16, 8)).toString(16);
  return padStart(id, 8, '0');
}

export function state() {
  const states = [
    'PENDING',
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'STOPPING',
    'STOPPED',
    'STOPPED',
    'TERMINATED',
    'TERMINATING',
  ] as const;
  return states[Math.floor(pseudoRandom() * states.length)];
}

export function number() {
  return 1 + Math.floor(pseudoRandom() * 256);
}

export function dnsName() {
  return `ec2-${number()}-${number()}-${number()}-${number()}.eu-west-1.compute.amazonaws.com`;
}

export function instanceType() {
  const types = [
    't1.micro',
    't2.nano',
    't2.small',
    't2.xlarge',
    't2.2xlarge',
    'm3.medium',
    'm3.large',
    'm3.xlarge',
    'm3.2xlarge',
    'm4.large',
    'm4.xlarge',
    'm4.2xlarge',
    'm4.4xlarge',
    'm4.10xlarge',
    'm4.16xlarge',
    'cr1.8xlarge',
    'r5.large',
    'r5.xlarge',
    'r5.2xlarge',
    'r5.metal',
    'r5d.xlarge',
    'r5d.2xlarge',
    'r5d.4xlarge',
    'r5d.8xlarge',
    'r5d.12xlarge',
    'r5d.16xlarge',
    'r5d.24xlarge',
    'r5d.metal',
    'i3.large',
    'i3.xlarge',
    'i3.2xlarge',
    'i3.16xlarge',
    'c3.large',
    'c3.xlarge',
    'c4.2xlarge',
    'c5.large',
    'c5.4xlarge ',
    'g2.2xlarge',
    'p2.xlarge',
    'm5.large',
    'm5.xlarge',
    'm5.2xlarge',
    'u-6tb1.metal',
  ];
  return types[Math.floor(pseudoRandom() * types.length)];
}

export function imageId() {
  return `ami-${id()}`;
}

export function generateItems(count = 4000) {
  return range(count).map(() => {
    const value: Instance = {
      id: id(),
      state: state(),
      type: instanceType(),
      imageId: imageId(),
    };
    if (value.state !== 'PENDING') {
      value.dnsName = dnsName();
    }
    return value;
  });
}
