// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container, { ContainerProps } from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  title: string;
  content: React.ReactNode;
}

const items: Item[] = [
  {
    id: 'account',
    title: 'Account settings',
    content: (
      <SpaceBetween size="m">
        <Box>
          Manage the identity and contact details associated with this account. Changes to the primary email address
          require re-verification before they take effect, and updates to the account name are reflected across billing
          documents and the console within a few minutes.
        </Box>
        <Box>
          Alternate contacts let you route billing, operations, and security notifications to the right people without
          sharing root credentials. We recommend configuring all three so that time-sensitive messages are never missed.
        </Box>
      </SpaceBetween>
    ),
  },
  {
    id: 'network',
    title: 'Network configuration',
    content: (
      <SpaceBetween size="m">
        <Box>
          Define the VPC, subnets, and security groups that this workload runs in. Instances launched into a private
          subnet reach the internet through a NAT gateway, while public subnets route directly through the internet
          gateway.
        </Box>
        <Box>
          Security groups act as stateful virtual firewalls at the instance level; network ACLs provide an additional,
          stateless layer at the subnet boundary. Keep inbound rules as narrow as possible and prefer referencing other
          security groups over hard-coded CIDR ranges so that access follows resources as they scale.
        </Box>
        <Box>
          Changes to routing and peering can take effect asynchronously. After editing a route table, confirm
          connectivity from a representative instance before rolling the change out to the rest of the fleet.
        </Box>
      </SpaceBetween>
    ),
  },
  {
    id: 'storage',
    title: 'Storage options',
    content: (
      <Box>
        Choose between general purpose SSD, provisioned IOPS, and throughput-optimized volumes depending on the
        workload&rsquo;s access pattern. You can resize a volume without detaching it, but the file system must be
        extended separately for the additional capacity to become usable.
      </Box>
    ),
  },
  {
    id: 'security',
    title: 'Security and compliance',
    content: (
      <SpaceBetween size="m">
        <Box>
          Review the encryption, logging, and access-control posture for this resource. Server-side encryption is
          enabled by default using an AWS managed key; switch to a customer managed key if your compliance program
          requires control over key rotation and grants.
        </Box>
        <Box>
          Audit logging captures every control-plane action and delivers it to your configured trail. Pair this with
          least-privilege IAM policies and periodic access reviews to keep the blast radius of any single credential as
          small as possible.
        </Box>
        <Box>
          Findings from automated checks appear here as they are evaluated. Address critical and high-severity items
          first, and document any accepted risks so that they can be revisited during the next review cycle.
        </Box>
      </SpaceBetween>
    ),
  },
  {
    id: 'tags',
    title: 'Tags',
    content: (
      <Box>
        Tags are key-value pairs that help you organize resources, allocate cost, and scope permissions. Apply a
        consistent set of tags &mdash; such as environment, owner, and cost center &mdash; across all resources so that
        reporting and automation stay reliable as the account grows.
      </Box>
    ),
  },
];

export default function FocusableContainerPage() {
  const refs = useRef<Record<string, ContainerProps.Ref | null>>({});

  const focusItem = (id: string) => {
    refs.current[id]?.focus();
  };

  // Deep-linking: focus and scroll to the container named by the `focus` query parameter on load.
  // The dev pages router keeps the route and its query in the URL hash (e.g.
  // #/container/focusable?focus=security), so read from the hash's query segment, falling back to
  // the document query string.
  useEffect(() => {
    const hashQuery = window.location.hash.split('?')[1] ?? '';
    const id = new URLSearchParams(hashQuery || window.location.search).get('focus');
    if (id && refs.current[id]) {
      focusItem(id);
    }
  }, []);

  return (
    <article>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <div>
            <h1>Focusable container</h1>
            <Box variant="p">
              Use the &ldquo;jump to&rdquo; links to programmatically move focus to a container. Each container scrolls
              into view and shows a focus ring at the jump destination. Deep-linking is demonstrated via the{' '}
              <code>focus</code> query parameter (for example <code>?focus=security</code>) &mdash; a real application
              would typically use the URL hash, but the dev pages router already owns it here.
            </Box>
          </div>

          <SpaceBetween direction="horizontal" size="l">
            <Box variant="span" fontWeight="bold">
              Jump to:
            </Box>
            {items.map(item => (
              <Link key={item.id} onFollow={() => focusItem(item.id)}>
                {item.title}
              </Link>
            ))}
          </SpaceBetween>

          {items.map((item, index) => (
            <Container
              key={item.id}
              ref={instance => {
                refs.current[item.id] = instance;
              }}
              header={<Header variant="h2">{item.title}</Header>}
              footer={
                <Button onClick={() => focusItem(items[(index + 1) % items.length].id)}>
                  Jump to {items[(index + 1) % items.length].title}
                </Button>
              }
            >
              {item.content}
            </Container>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
