// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Header from '~components/header';

// Constrains the width so the dialog reads like an in-context chat/card surface
// rather than stretching the full page width. Adds left padding so the demo
// isn't flush against the edge, and wraps the demo in a Container by default so
// it's easy to see. Pages that bring their own surface (their own Container or a
// bespoke chat layout) pass `disableContainer`.
export function DialogPage({
  title,
  children,
  disableContainer = false,
}: {
  title: string;
  children: React.ReactNode;
  disableContainer?: boolean;
}) {
  return (
    <article style={{ paddingInlineStart: 24 }}>
      <h1>{title}</h1>
      <div style={{ maxInlineSize: 520 }}>
        {disableContainer ? (
          children
        ) : (
          <Container header={<Header variant="h3">Generative AI assistant</Header>}>
            {/* Reserve a consistent chat height across all examples and bottom-align the
                content, so messages sit at the bottom and grow upward into the empty space. */}
            <div style={{ minBlockSize: 440, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {children}
            </div>
          </Container>
        )}
      </div>
    </article>
  );
}
