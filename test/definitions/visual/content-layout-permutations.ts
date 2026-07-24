// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

function contentLayoutPermutation(params: Record<string, string>, width = 1400): TestDefinition {
  return {
    description: `${JSON.stringify(params)} at ${width}`,
    path: 'content-layout/permutations',
    screenshotType: 'screenshotArea' as const,
    configuration: { width },
    queryParams: params,
  };
}

const suite: TestSuite = {
  description: 'ContentLayout permutations',
  componentName: 'content-layout',
  tests: [
    // default and high-contrast headerVariants with all background styles
    ...(['default', 'high-contrast'] as const).flatMap(headerVariant =>
      (['none', 'gradient', 'image'] as const).flatMap(headerBackgroundStyle =>
        [1400, 600].flatMap<TestDefinition>(width => [
          contentLayoutPermutation(
            {
              headerVariant,
              headerBackgroundStyle,
              hasContainer: 'true',
              defaultPadding: 'true',
              hasBreadcrumbs: 'false',
              hasNotifications: 'false',
              disableOverlap: 'false',
              hasAppLayout: 'false',
              hasAppLayoutWithOpenNavigation: 'false',
              hasSecondaryHeader: 'false',
              removeHeader: 'false',
            },
            width
          ),
          contentLayoutPermutation(
            {
              headerVariant,
              headerBackgroundStyle,
              hasContainer: 'true',
              defaultPadding: 'true',
              hasBreadcrumbs: 'true',
              hasNotifications: 'true',
              disableOverlap: 'false',
              hasAppLayout: 'false',
              hasAppLayoutWithOpenNavigation: 'false',
              hasSecondaryHeader: 'false',
              removeHeader: 'false',
            },
            width
          ),
        ])
      )
    ),
    // maxContentWidth variants
    ...(['default', 'high-contrast'] as const).flatMap(headerVariant =>
      (['none', 'gradient', 'image'] as const).map<TestDefinition>(headerBackgroundStyle =>
        contentLayoutPermutation({
          headerVariant,
          headerBackgroundStyle,
          hasContainer: 'true',
          defaultPadding: 'true',
          hasBreadcrumbs: 'true',
          hasNotifications: 'true',
          disableOverlap: 'false',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'false',
          removeHeader: 'false',
          maxContentWidth: '1000',
        })
      )
    ),
    // divider headerVariant
    ...[1400, 600].flatMap<TestDefinition>(width => [
      contentLayoutPermutation(
        {
          headerVariant: 'divider',
          defaultPadding: 'true',
          hasContainer: 'true',
          hasBreadcrumbs: 'false',
          hasNotifications: 'false',
          disableOverlap: 'false',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'false',
          removeHeader: 'false',
        },
        width
      ),
      contentLayoutPermutation(
        {
          headerVariant: 'divider',
          defaultPadding: 'true',
          hasContainer: 'true',
          hasBreadcrumbs: 'true',
          hasNotifications: 'true',
          disableOverlap: 'true',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'false',
          removeHeader: 'false',
          maxContentWidth: '1000',
        },
        width
      ),
    ]),
    // with app layout
    contentLayoutPermutation({
      headerVariant: 'divider',
      defaultPadding: 'true',
      hasContainer: 'true',
      hasBreadcrumbs: 'false',
      hasNotifications: 'false',
      disableOverlap: 'true',
      hasAppLayout: 'true',
      hasAppLayoutWithOpenNavigation: 'false',
      hasSecondaryHeader: 'false',
      removeHeader: 'false',
    }),
    contentLayoutPermutation({
      headerVariant: 'high-contrast',
      headerBackgroundStyle: 'gradient',
      defaultPadding: 'true',
      hasContainer: 'true',
      hasBreadcrumbs: 'true',
      hasNotifications: 'true',
      disableOverlap: 'false',
      hasAppLayout: 'true',
      hasAppLayoutWithOpenNavigation: 'false',
      hasSecondaryHeader: 'false',
      removeHeader: 'false',
      maxContentWidth: '800',
    }),
    // with open navigation
    contentLayoutPermutation({
      headerVariant: 'high-contrast',
      defaultPadding: 'true',
      hasContainer: 'true',
      hasBreadcrumbs: 'false',
      hasNotifications: 'false',
      disableOverlap: 'false',
      hasAppLayout: 'true',
      hasAppLayoutWithOpenNavigation: 'true',
      hasSecondaryHeader: 'false',
      removeHeader: 'false',
    }),
    contentLayoutPermutation({
      headerVariant: 'divider',
      defaultPadding: 'true',
      hasContainer: 'true',
      hasBreadcrumbs: 'true',
      hasNotifications: 'true',
      disableOverlap: 'false',
      hasAppLayout: 'true',
      hasAppLayoutWithOpenNavigation: 'true',
      hasSecondaryHeader: 'false',
      removeHeader: 'false',
      maxContentWidth: '700',
    }),
    // with secondary header
    ...[1400, 600].map<TestDefinition>(width =>
      contentLayoutPermutation(
        {
          headerVariant: 'high-contrast',
          defaultPadding: 'true',
          hasContainer: 'true',
          hasBreadcrumbs: 'false',
          hasNotifications: 'false',
          disableOverlap: 'false',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'true',
          removeHeader: 'false',
        },
        width
      )
    ),
    contentLayoutPermutation({
      headerVariant: 'high-contrast',
      defaultPadding: 'true',
      hasContainer: 'true',
      hasBreadcrumbs: 'false',
      hasNotifications: 'false',
      disableOverlap: 'false',
      hasAppLayout: 'false',
      hasAppLayoutWithOpenNavigation: 'false',
      hasSecondaryHeader: 'true',
      removeHeader: 'false',
      maxContentWidth: '900',
    }),
    // without header
    ...[1400, 600].flatMap(width =>
      [true, false].flatMap(defaultPadding =>
        (['default', 'high-contrast', 'divider'] as const).map<TestDefinition>(headerVariant =>
          contentLayoutPermutation(
            {
              headerVariant,
              defaultPadding: `${defaultPadding}`,
              removeHeader: 'true',
              hasContainer: `${defaultPadding}`,
              hasBreadcrumbs: 'false',
              hasNotifications: 'false',
              disableOverlap: 'false',
              hasAppLayout: 'false',
              hasAppLayoutWithOpenNavigation: 'false',
              hasSecondaryHeader: 'false',
            },
            width
          )
        )
      )
    ),
    // without default padding
    ...[1400, 600].map<TestDefinition>(width =>
      contentLayoutPermutation(
        {
          headerVariant: 'default',
          defaultPadding: 'false',
          hasContainer: 'false',
          hasBreadcrumbs: 'false',
          hasNotifications: 'false',
          disableOverlap: 'false',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'false',
          removeHeader: 'false',
        },
        width
      )
    ),
    // with disabled overlap
    ...[1400, 600].map<TestDefinition>(width =>
      contentLayoutPermutation(
        {
          headerVariant: 'high-contrast',
          defaultPadding: 'true',
          hasContainer: 'true',
          hasBreadcrumbs: 'false',
          hasNotifications: 'false',
          disableOverlap: 'true',
          hasAppLayout: 'false',
          hasAppLayoutWithOpenNavigation: 'false',
          hasSecondaryHeader: 'false',
          removeHeader: 'false',
        },
        width
      )
    ),
  ],
};

export default suite;
