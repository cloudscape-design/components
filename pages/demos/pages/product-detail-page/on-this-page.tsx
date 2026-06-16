// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import AnchorNavigation from '@cloudscape-design/components/anchor-navigation';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';

function OnThisPageNavigation({ variant }: { variant: 'mobile' | 'side' }) {
  const anchorNavigation = (
    <AnchorNavigation
      anchors={[
        {
          text: 'Product overview',
          href: '#product-overview',
          level: 1,
        },
        {
          text: 'Pricing',
          href: '#pricing',
          level: 1,
        },
        {
          text: 'Details',
          href: '#details',
          level: 1,
        },
        {
          text: 'Support',
          href: '#support',
          level: 1,
        },
        {
          text: 'Related products and services',
          href: '#related-products',
          level: 1,
        },
      ]}
      ariaLabelledby="navigation-header"
    />
  );

  return variant === 'side' ? (
    <div className="on-this-page--side" data-testid="on-this-page">
      <Box variant="h2" margin={{ bottom: 'xxs' }}>
        <span id="navigation-header">On this page</span>
      </Box>
      {anchorNavigation}
    </div>
  ) : (
    <ExpandableSection variant="footer" headingTagOverride="h2" headerText="On this page">
      {anchorNavigation}
    </ExpandableSection>
  );
}

export { OnThisPageNavigation };
