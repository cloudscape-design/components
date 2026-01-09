// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import Link from '~components/link';
import TextContent from '~components/text-content';

export default function IconInheritSizingPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Icon Inherit Sizing Test</h1>

      <small style={{ fontSize: '12px', lineHeight: '16px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 12px, Line-height: 16px (body small text). The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        should have normal (16x16) icon.
      </small>

      <p style={{ fontSize: '14px', lineHeight: '20px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 14px, Line-height: 20px (body normal text). The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        should have normal (16x16) icon.
      </p>

      <p style={{ fontSize: '16px', lineHeight: '24px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 16px, Line-height: 24px. The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        icon should have normal (16x16).
      </p>

      <p style={{ fontSize: '18px', lineHeight: '24px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 18px, Line-height: 24px. The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        icon should have normal (16x16).
      </p>

      <p style={{ fontSize: '20px', lineHeight: '24px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 20px, Line-height: 24px. The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        should have medium (20x20) icon.
      </p>

      <p style={{ fontSize: '22px', lineHeight: '24px', fontFamily: 'Amazon Ember', paddingBlock: '8px' }}>
        Font: 22px, Line-height: 24px. The{' '}
        <Link external={true} variant="primary" fontSize="inherit" href="https://example.com">
          external link
        </Link>{' '}
        should have medium (20x20) icon.
      </p>

      <TextContent>
        <h1>
          <Icon name="status-positive" size="big" /> Heading 1 - Font: 24px, Line height: 30px
        </h1>
        <h2>
          <Icon name="status-positive" size="inherit" /> Heading 2 - Font: 20px, Line height: 24px
        </h2>
        <h3>
          <Icon name="status-positive" size="normal" /> Heading 3 - Font: 18px, Line height: 22px
        </h3>
        <h4>
          <Icon name="status-positive" size="normal" /> Heading 4 - Font: 16px, Line height: 20px
        </h4>
        <h5>
          <Icon name="status-positive" size="normal" /> Heading 5 - Font: 14px, Line height: 18px
        </h5>
      </TextContent>
    </div>
  );
}
