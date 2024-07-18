// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Container, Flashbar, Header, Hotspot, SpaceBetween } from '~components';
import Link from '~components/link';

export function PageTwo({ onFollowLink }: { onFollowLink: () => void }) {
  return (
    <SpaceBetween size="l">
      <Flashbar
        items={[
          {
            type: 'success',
            header: 'Successfully created bucket "MyDemoBucket101"',
            statusIconAriaLabel: 'success',
            content: (
              <>
                To upload files and folders, or to configure additional bucket settings such as Bucket Versioning, tags,
                and default encryption, choose <b>Go to bucket details</b>.
              </>
            ),
            buttonText: 'Go to bucket details',
            onButtonClick: () => onFollowLink(),
          },
        ]}
      />
      <Header variant="h1">Buckets</Header>
      <Container>
        <SpaceBetween direction="horizontal" size="xxl">
          <Hotspot hotspotId="demo-bucket-link">
            <Link onFollow={() => onFollowLink()}>MyDemoBucket101</Link>
          </Hotspot>

          <div />
          <div>Not public</div>
          <div />
          <div>
            <Hotspot hotspotId="second-hotspot-on-page" direction="bottom">
              US West (Oregon) us-west-2
            </Hotspot>
            <Hotspot hotspotId="used-in-a-different-tutorial" />
          </div>
          <div />
          <div>2020-05-30T10:47:21:000Z</div>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
