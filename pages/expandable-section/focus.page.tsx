// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppContext, { AppContextType } from '../app/app-context';

import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';

import ScreenshotArea from '../utils/screenshot-area';
import { headerActions, headerInfo } from './common';

type DemoContext = React.Context<
  AppContextType<{
    hasHeaderActions?: boolean;
    hasHeaderInfo?: boolean;
    headerCounter?: string;
    headerDescription?: string;
    headerText: string;
    variant?: string;
  }>
>;

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  const { hasHeaderActions, hasHeaderInfo, headerCounter, headerDescription, headerText, variant } = urlParams;

  const isVariantValid = variant && ['container', 'default', 'footer', 'navigation'].indexOf(variant) !== -1;

  return (
    <article>
      <h1>Expandable Section - focus tests</h1>

      <button id="focus-target">Focus target</button>

      <ScreenshotArea>
        <ExpandableSection
          defaultExpanded={true}
          headerActions={hasHeaderActions ? headerActions : undefined}
          headerCounter={headerCounter}
          headerDescription={headerDescription}
          headerInfo={hasHeaderInfo ? headerInfo : undefined}
          headerText={headerText || 'Header text'}
          variant={isVariantValid ? (variant as ExpandableSectionProps.Variant) : undefined}
        >
          Expandable section content
        </ExpandableSection>
      </ScreenshotArea>
    </article>
  );
}
