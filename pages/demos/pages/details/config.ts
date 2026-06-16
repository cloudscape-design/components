// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DistributionResource } from '../../resources/types';

export const DEMO_DISTRIBUTION: DistributionResource = {
  id: 'SLCCSMWOHOFUY0',
  domainName: 'abcdef01234567890.cloudfront.net',
  priceClass: 'Use only US, Canada, Europe, and Asia',
  sslCertificate: 'Default CloudFront SSL certificate',
  deliveryMethod: 'Web',
  origin: 'EXAMPLE-BUCKET-1.s3.amazon',
  logging: 'Off',
  tags: { environment: ['development'], department: ['support'] },
  date: new Date(),
};
