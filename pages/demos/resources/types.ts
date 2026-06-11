// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export interface BehaviorResource {
  precedence: string;
  pathPattern: string;
  origin: string;
  viewerProtocolPolicy: string;
  forwardedQueryStrings: string;
}

export interface LogResource {
  id: string;
  name: string;
  lastWritten: string;
  size: string;
}

export interface ContentOriginsResource {
  value: string;
  label: string;
}

export interface OriginResource {
  id: string;
  name: string;
  type: string;
  accessIdentity: string;
}
export interface InvalidationResource {
  id: string;
  status: string;
  date: string;
}

export interface DistributionResource {
  id: string;
  deliveryMethod: string;
  domainName: string;
  origin: string;
  priceClass: string;
  logging: string;
  sslCertificate: string;
  tags: { department: string[]; environment: string[] };
  date: Date;
  state?: 'Activated' | 'Deactivated';
}

export interface Tag {
  key: string;
  value: string;
}

export interface TagsResource {
  resourceTags: Tag[];
  valueMap: {
    owner: string[];
    project: string[];
    role: string[];
    performance: string[];
    profile: string[];
  };
}

export interface EC2Instance {
  id: string;
  type: string;
  publicDns: string;
  monitoring: string;
  state: string;
  platformDetails: string;
  terminalProtection: string;
  launchTime: string;
  volume: number;
  securityGroups: string[];
  loadBalancers: string[];
  availabilityZone: string;
  numOfvCpu: number;
  inboundRules: {
    type: string;
    protocol: string;
    portRange: string;
    source: string;
    description: string;
  }[];
}
