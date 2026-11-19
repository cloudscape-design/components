// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Input from '~components/input';
import Link from '~components/link';
import Popover from '~components/popover';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import Token from '~components/token';

import { SimplePage } from '../app/templates';

type LabelType = 'text' | 'popover' | 'link';

export default function TokenLabelPlaygroundPage() {
  const [variant, setVariant] = useState<'normal' | 'inline'>('inline');
  const [labelType, setLabelType] = useState<LabelType>('text');
  const [labelText, setLabelText] = useState('Token label that can get long');
  const [labelTag, setLabelTag] = useState('Label tag that can get long too');
  const [dismissible, setDismissible] = useState(true);
  const [withTooltip, setWithTooltip] = useState(true);

  const label =
    labelType === 'popover' ? (
      <Popover
        triggerType="text-inline"
        header={labelText}
        content={labelTag ? `Label tag: ${labelTag}` : 'Popover content'}
        wrapTriggerText={false}
      >
        {labelText}
      </Popover>
    ) : labelType === 'link' ? (
      <Link href="#" variant="primary">
        {labelText}
      </Link>
    ) : (
      labelText
    );

  return (
    <SimplePage title="Token label and label tag playground">
      <SpaceBetween size="l">
        <SpaceBetween size="m" direction="horizontal">
          <FormField label="Variant">
            <SegmentedControl
              selectedId={variant}
              onChange={({ detail }) => setVariant(detail.selectedId as 'normal' | 'inline')}
              options={[
                { id: 'inline', text: 'Inline' },
                { id: 'normal', text: 'Normal' },
              ]}
            />
          </FormField>
          <FormField label="Label type">
            <SegmentedControl
              selectedId={labelType}
              onChange={({ detail }) => setLabelType(detail.selectedId as LabelType)}
              options={[
                { id: 'text', text: 'Text' },
                { id: 'popover', text: 'Popover' },
                { id: 'link', text: 'Link' },
              ]}
            />
          </FormField>
        </SpaceBetween>
        <SpaceBetween size="m" direction="horizontal">
          <FormField label="Label">
            <Input value={labelText} onChange={({ detail }) => setLabelText(detail.value)} />
          </FormField>
          <FormField label="Label tag">
            <Input value={labelTag} onChange={({ detail }) => setLabelTag(detail.value)} />
          </FormField>
        </SpaceBetween>
        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={dismissible} onChange={({ detail }) => setDismissible(detail.checked)}>
            Dismissible
          </Checkbox>
          <Checkbox checked={withTooltip} onChange={({ detail }) => setWithTooltip(detail.checked)}>
            tooltipContent
          </Checkbox>
        </SpaceBetween>

        <Token
          variant={variant}
          label={label}
          ariaLabel={labelType === 'text' ? undefined : labelText}
          labelTag={labelTag || undefined}
          tooltipContent={withTooltip ? [labelText, labelTag].filter(Boolean).join(' ') : undefined}
          onDismiss={dismissible ? () => {} : undefined}
          dismissLabel="Remove token"
        />
      </SpaceBetween>
    </SimplePage>
  );
}
