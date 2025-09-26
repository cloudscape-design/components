// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition } from '../../internal/components/option/interfaces';
import { filterOptions } from '../filter-options';

const createOption = (overrides: Partial<OptionDefinition> = {}): OptionDefinition => ({
  value: 'test-value',
  label: 'Test Label',
  ...overrides,
});
describe('filterOptions matching', () => {
  const testOptions = [
    createOption({
      value: 'ec2-instance',
      label: 'Amazon EC2 Instance',
      tags: ['compute', 'virtual-machine'],
      filteringTags: ['aws-ec2', 'cloud-compute'],
    }),
    createOption({
      value: 's3-bucket',
      label: 'Amazon S3 Bucket',
      tags: ['storage', 'object-storage'],
      filteringTags: ['simple-storage', 'bucket'],
    }),
    createOption({
      value: 'rds-database',
      label: 'Amazon RDS Database',
      tags: ['database', 'relational'],
      filteringTags: ['mysql', 'postgres'],
    }),
    createOption({
      value: 'lambda-function',
      label: 'AWS Lambda Function',
      tags: ['serverless', 'compute'],
      filteringTags: ['function-as-a-service', 'faas'],
    }),
  ];

  test('should match by value property', () => {
    const result = filterOptions(testOptions, 'ec2-instance');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('ec2-instance');
  });

  test('should match by partial value', () => {
    const result = filterOptions(testOptions, 'ec2');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('ec2-instance');
  });

  test('should match by label property', () => {
    const result = filterOptions(testOptions, 'Amazon EC2 Instance');
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Amazon EC2 Instance');
  });

  test('should match by partial label', () => {
    const result = filterOptions(testOptions, 'Lambda');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('lambda-function');
  });

  test('should match by tags property', () => {
    const result = filterOptions(testOptions, 'compute');
    expect(result).toHaveLength(2);
    expect(result.map(r => r.value)).toContain('ec2-instance');
    expect(result.map(r => r.value)).toContain('lambda-function');
  });

  test('should match by filteringTags property', () => {
    const result = filterOptions(testOptions, 'simple-storage');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('s3-bucket');
  });

  test('should match across multiple properties for same option', () => {
    // Test option that matches on multiple properties
    const result = filterOptions(testOptions, 'storage');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('s3-bucket');

    // Verify it matches both in tags and could match in other properties
    const option = result[0];
    expect(option.tags).toContain('storage');
  });

  test('should perform case-insensitive matching across all properties', () => {
    // Test case insensitive value matching
    let result = filterOptions(testOptions, 'RDS-DATABASE');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('rds-database');

    // Test case insensitive label matching
    result = filterOptions(testOptions, 'amazon s3');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('s3-bucket');

    // Test case insensitive tag matching
    result = filterOptions(testOptions, 'SERVERLESS');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('lambda-function');

    // Test case insensitive filteringTags matching
    result = filterOptions(testOptions, 'MYSQL');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('rds-database');
  });

  test('should match multiple options when search matches different properties', () => {
    // Search for 'amazon' which should match labels of multiple options
    const result = filterOptions(testOptions, 'amazon');
    expect(result).toHaveLength(3);
    expect(result.map(r => r.value)).toContain('ec2-instance');
    expect(result.map(r => r.value)).toContain('s3-bucket');
    expect(result.map(r => r.value)).toContain('rds-database');
  });

  test('should return empty array when no properties match', () => {
    const result = filterOptions(testOptions, 'nonexistent-search');
    expect(result).toHaveLength(0);
  });
});
