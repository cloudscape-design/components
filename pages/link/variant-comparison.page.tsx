// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link, { LinkProps } from '~components/link';

import styles from './styles.scss';

interface RowProps {
  label: string;
  variant: LinkProps['variant'];
  href?: string;
  color?: LinkProps['color'];
}

function LinkCell({ variant, href, color }: Omit<RowProps, 'label'>) {
  const isInverted = color === 'inverted';
  return (
    <td>
      <div className={isInverted ? styles['container-inverted'] : undefined}>
        <Link variant={variant} href={href} color={color}>
          Link text
        </Link>
      </div>
    </td>
  );
}

const variants: Array<{ label: string; variant: LinkProps['variant'] }> = [
  { label: 'primary', variant: 'primary' },
  { label: 'secondary', variant: 'secondary' },
  { label: 'info', variant: 'info' },
];

export default function LinkVariantComparison() {
  return (
    <>
      <style>{`
        .custom-link {
          --awsui-style-color-default-6b9ypa: light-dark(#080808, #fcfcfc);
          --awsui-style-color-hover-6b9ypa: light-dark(#000000, #ffffff);
          --awsui-style-color-active-6b9ypa: light-dark(#080808, #fcfcfc);
        }
        .custom-link:hover,
        .custom-link:active,
        .custom-link:focus {
          text-decoration-line: none !important;
        }
      `}</style>
      <h1>Link variant comparison</h1>
      <p>Focused view for evaluating primary, secondary and info variants — with/without href, normal and inverted.</p>

      <table style={{ borderCollapse: 'collapse', marginBlockStart: '24px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingInlineEnd: '32px', paddingBlockEnd: '8px' }}>Variant</th>
            <th style={{ paddingInlineEnd: '32px', paddingBlockEnd: '8px' }}>With href (normal)</th>
            <th style={{ paddingInlineEnd: '32px', paddingBlockEnd: '8px' }}>Without href (normal)</th>
            <th style={{ paddingInlineEnd: '32px', paddingBlockEnd: '8px' }}>With href (inverted)</th>
            <th style={{ paddingInlineEnd: '32px', paddingBlockEnd: '8px' }}>Without href (inverted)</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(({ label, variant }) => (
            <tr key={label}>
              <td style={{ paddingInlineEnd: '32px', paddingBlock: '12px', fontWeight: 'bold' }}>{label}</td>
              <LinkCell variant={variant} href="#" />
              <LinkCell variant={variant} href={undefined} />
              <LinkCell variant={variant} href="#" color="inverted" />
              <LinkCell variant={variant} href={undefined} color="inverted" />
            </tr>
          ))}
          <tr>
            <Link variant="secondary" external={true} href="#" className="custom-link">
              <span style={{ color: 'light-dark(#080808, #fcfcfc)' }}>Custom link</span>
            </Link>
          </tr>
          <tr>
            <Link
              variant="secondary"
              external={true}
              href="#"
              style={{
                root: {
                  color: {
                    default: 'light-dark(#080808, #fcfcfc)',
                    hover: 'light-dark(#000000, #ffffff)',
                    active: 'light-dark(#080808, #fcfcfc)',
                  },
                },
              }}
            >
              Custom link
            </Link>
          </tr>
        </tbody>
      </table>
    </>
  );
}
