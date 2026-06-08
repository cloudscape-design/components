// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Link, { LinkProps } from '@cloudscape-design/components/link';

interface InfoLinkProps {
  id?: string;
  ariaLabel?: string;
  onFollow: LinkProps['onFollow'];
}
export const InfoLink = (props: InfoLinkProps) => (
  <Link href="#" variant="info" className="secondary-link" {...props}>
    Info
  </Link>
);
