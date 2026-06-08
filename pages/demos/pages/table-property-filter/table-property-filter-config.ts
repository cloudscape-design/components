// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { enumOperators, stringOperators } from '../../common/property-filter-operators';

export const FILTERING_PROPERTIES = [
  {
    propertyLabel: 'Domain name',
    key: 'domainName',
    groupValuesLabel: 'Domain name values',
    operators: stringOperators,
  },
  {
    propertyLabel: 'Delivery method',
    key: 'deliveryMethod',
    groupValuesLabel: 'Delivery method values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Price class',
    key: 'priceClass',
    groupValuesLabel: 'Price class values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Origin',
    key: 'origin',
    groupValuesLabel: 'Origin values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Status',
    key: 'status',
    groupValuesLabel: 'Status values',
    operators: stringOperators,
  },
  { propertyLabel: 'State', key: 'state', groupValuesLabel: 'State values' },
  {
    propertyLabel: 'Logging',
    key: 'logging',
    groupValuesLabel: 'Logging values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'SSL certificate',
    key: 'sslCertificate',
    groupValuesLabel: 'SSL certificate values',
    operators: enumOperators,
  },
];
