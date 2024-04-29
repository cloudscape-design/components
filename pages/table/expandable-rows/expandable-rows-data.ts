// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { id as generateId, instanceType as generateInstanceSize } from '../generate-data';
import pseudoRandom from '../../utils/pseudo-random';
import { sumBy, uniq } from 'lodash';
import { Instance, InstanceDetail, InstanceType, InstanceState } from './common';

export const allInstances: Instance[] = [];
for (let i = 0; i < 35; i++) {
  allInstances.push(...generateLevelItems(1, []));
}

function generateLevelItems(level: number, path: string[], parent: null | InstanceDetail = null): Instance[] {
  const type = generateInstanceType(level);
  const state = generateState(parent);
  const instanceDetail = {
    type,
    name: `${type}-${generateId()}`,
    role: generateRole(type, level),
    engine: parent?.engine ?? generateEngine(type),
    state,
    size: generateSize(type),
    region: generateRegion(type),
    terminationReason: generateTerminationReason(state),
  };
  const nextPath = [instanceDetail.name, ...path];
  const children = generateChildren(type, level, nextPath, instanceDetail);
  const selectsPerSecond = getSelectsPerSecond(type, children);
  const stateGrouped = getGroupedState(instanceDetail.state, children);
  const sizeGrouped = getGroupedSize(type, instanceDetail.size, children);
  const regionGrouped = getGroupedRegion(type, instanceDetail.region, children);
  return [
    {
      ...instanceDetail,
      selectsPerSecond,
      stateGrouped,
      sizeGrouped,
      regionGrouped,
      parentName: parent?.name ?? null,
      path: nextPath,
      children: children.length,
      level,
    },
    ...children,
  ];
}

function generateInstanceType(level: number): InstanceType {
  const rand = pseudoRandom();
  if (level === 1) {
    return rand < 0.2 ? 'global' : rand < 0.8 ? 'cluster' : 'instance';
  }
  if (level === 2) {
    return rand < 0.6 ? 'cluster' : 'instance';
  }
  if (level === 3) {
    return rand < 0.3 ? 'cluster' : 'instance';
  }
  return 'instance';
}

function generateChildren(instanceType: InstanceType, level: number, path: string[], parent: InstanceDetail) {
  if (instanceType === 'instance') {
    return [];
  }
  const count = level === 1 ? 1 + Math.floor(pseudoRandom() * 5) : Math.floor(pseudoRandom() * 5);
  const children: Instance[] = [];
  for (let i = 0; i < count; i++) {
    children.push(...generateLevelItems(level + 1, path, parent));
  }
  return children;
}

function generateRole(instanceType: InstanceType, level: number) {
  if (instanceType === 'global') {
    return 'Global';
  }
  if (instanceType === 'cluster') {
    return 'Cluster';
  }
  if (instanceType === 'instance' && level === 1) {
    return 'Instance';
  }
  const instanceRoles = ['Reader', 'Writer', 'Replica', 'Replica', 'Replica', 'Replica'];
  return instanceRoles[Math.floor(pseudoRandom() * instanceRoles.length)];
}

function generateState(parent: null | InstanceDetail) {
  if (parent?.state === 'STOPPED' || parent?.state === 'TERMINATED') {
    return pseudoRandom() < 0.9 ? 'STOPPED' : 'TERMINATED';
  }
  const states = [
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'STOPPED',
    'STOPPED',
    'TERMINATED',
  ] as const;
  return states[Math.floor(pseudoRandom() * states.length)];
}

function getSelectsPerSecond(instanceType: InstanceType, children: Instance[]): null | number {
  if (instanceType === 'global') {
    return null;
  }
  return instanceType === 'instance'
    ? Math.floor(pseudoRandom() * 500)
    : sumBy(children, instance => instance.selectsPerSecond ?? 0);
}

function getGroupedState(state: InstanceState, children: Instance[]) {
  const grouped = { RUNNING: 0, STOPPED: 0, TERMINATED: 0, [state]: 1 };
  for (const instance of children) {
    grouped[instance.state]++;
  }
  return grouped;
}

function getGroupedSize(instanceType: InstanceType, size: null | string, children: Instance[]) {
  if (instanceType === 'global') {
    return '';
  }
  if (instanceType === 'instance') {
    return size ?? '';
  }
  return `${children.filter(instance => instance.type === 'instance').length} instances`;
}

function generateEngine(instanceType: InstanceType) {
  if (instanceType === 'global') {
    return 'Aurora MySQL';
  }
  const engines = ['MariaDB', 'MySQL', 'Aurora MySQL', 'Microsoft SQL Server', 'PostgreSQL', 'Oracle'];
  return engines[Math.floor(pseudoRandom() * engines.length)];
}

function generateSize(instanceType: InstanceType) {
  return instanceType === 'instance' ? generateInstanceSize() : null;
}

function generateRegion(instanceType: InstanceType) {
  if (instanceType === 'global') {
    return null;
  }
  const regions = [
    'us-east-1',
    'us-east-1a',
    'us-east-1b',
    'us-east-2',
    'us-east-2a',
    'us-east-2b',
    'us-west-1',
    'us-west-1a',
    'us-west-1b',
    'us-west-2',
    'us-west-2a',
    'us-west-2b',
  ];
  return regions[Math.floor(pseudoRandom() * regions.length)];
}

function getGroupedRegion(instanceType: InstanceType, region: null | string, children: Instance[]) {
  if (instanceType === 'global') {
    const allRegions = uniq(children.map(instance => instance.region).filter(Boolean));
    return `${allRegions.length} regions`;
  }
  return region ?? '';
}

function generateTerminationReason(state: InstanceState): null | string {
  if (state === 'TERMINATED') {
    return `Terminated automatically (CM-${generateId().slice(0, 5).toUpperCase()})`;
  }
  return null;
}
