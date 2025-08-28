// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition } from '../../internal/components/option/interfaces';
import { filterOptions } from '../filter-options';

describe('Property Filter filterOptions with tags', () => {
  const createOption = (overrides: Partial<OptionDefinition> = {}): OptionDefinition => ({
    value: 'test-value',
    label: 'Test Label',
    ...overrides,
  });

  describe('matchSingleOption tag functionality', () => {
    test('should match options by tags', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['compute', 'ec2', 'running'],
        }),
        createOption({
          value: 'instance-2',
          label: 'Instance 2',
          tags: ['storage', 's3'],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);
    });

    test('should match options by filteringTags', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          filteringTags: ['virtual-machine', 'cloud-compute'],
        }),
        createOption({
          value: 'instance-2',
          label: 'Instance 2',
          filteringTags: ['database', 'rds'],
        }),
      ];

      const result = filterOptions(options, 'virtual-machine');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);
    });

    test('should perform case-insensitive tag matching', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['COMPUTE', 'EC2'],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);
    });

    test('should match partial tag content', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['cloud-compute', 'virtual-machine'],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);
    });

    test('should match both tags and filteringTags', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['compute'],
          filteringTags: ['ec2', 'virtual-machine'],
        }),
      ];

      // Should match via tags
      let result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);

      // Should match via filteringTags
      result = filterOptions(options, 'ec2');
      expect(result).toHaveLength(1);

      // Should match via filteringTags
      result = filterOptions(options, 'virtual-machine');
      expect(result).toHaveLength(1);
    });

    test('should maintain backward compatibility with options without tags', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
        }),
        createOption({
          value: 'instance-2',
          label: 'Instance 2',
          tags: ['compute'],
        }),
      ];

      // Should match by label
      let result = filterOptions(options, 'Instance 1');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);

      // Should match by tag
      result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[1]);
    });

    test('should handle empty tag arrays gracefully', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: [],
          filteringTags: [],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(0);
    });

    test('should handle undefined tags gracefully', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: undefined,
          filteringTags: undefined,
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(0);
    });

    test('should match when search text matches both label and tags', () => {
      const options = [
        createOption({
          value: 'compute-instance',
          label: 'Compute Instance',
          tags: ['compute', 'ec2'],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(options[0]);
    });

    test('should not match when search text does not match any field or tag', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['compute', 'ec2'],
          filteringTags: ['virtual-machine'],
        }),
      ];

      const result = filterOptions(options, 'database');
      expect(result).toHaveLength(0);
    });

    test('should match multiple options with different tag matches', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['compute', 'ec2'],
        }),
        createOption({
          value: 'instance-2',
          label: 'Instance 2',
          filteringTags: ['compute-optimized'],
        }),
        createOption({
          value: 'instance-3',
          label: 'Instance 3',
          tags: ['storage'],
        }),
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(2);
      expect(result).toContain(options[0]);
      expect(result).toContain(options[1]);
    });

    test('should handle special characters in tags', () => {
      const options = [
        createOption({
          value: 'instance-1',
          label: 'Instance 1',
          tags: ['t3.micro', 'us-east-1', 'prod-env'],
        }),
      ];

      let result = filterOptions(options, 't3.micro');
      expect(result).toHaveLength(1);

      result = filterOptions(options, 'us-east');
      expect(result).toHaveLength(1);

      result = filterOptions(options, 'prod-env');
      expect(result).toHaveLength(1);
    });
  });

  describe('filterOptions with groups and tags', () => {
    test('should filter grouped options with tags', () => {
      const options: any[] = [
        {
          label: 'Compute Group',
          options: [
            createOption({
              value: 'instance-1',
              label: 'Instance 1',
              tags: ['ec2', 'compute'],
            }),
            createOption({
              value: 'instance-2',
              label: 'Instance 2',
              tags: ['storage', 's3'],
            }),
          ],
        },
      ];

      const result = filterOptions(options, 'compute');
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Compute Group');
      expect((result[0] as any).options).toHaveLength(1); // only the matching child
      expect((result[0] as any).options[0].tags).toContain('compute');
    });
  });
});
