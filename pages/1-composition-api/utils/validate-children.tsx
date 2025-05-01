// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { isDevelopment } from '@cloudscape-design/component-toolkit/internal';

export default function validateChildren(displayName: string, permittedContent: any, children: any) {
  const permittedContentList = permittedContent.map((item: any) => item.displayName).join(', ');

  return (
    <>
      {React.Children.map(children, child => {
        if (isDevelopment) {
          if (permittedContent.includes(child.type)) {
            return child;
          } else {
            console.error(
              [
                `[AwsUi]: ${displayName} doesn't accept ${child.type.displayName} as a child or subcomponent.`,
                `Use one of ${permittedContentList} instead.`,
              ].join('\n')
            );
          }
        }
      })}
    </>
  );
}
