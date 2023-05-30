// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import ScreenshotArea from '../utils/screenshot-area';
import { ColumnLayout, FormField, Header, Textarea } from '~components';
import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';

export default function SplitButtonPage() {
  const [parsedData, setParsedData] = useState<SplitButtonProps>({
    variant: 'normal',
    segments: [
      { id: 'launch-instance', text: 'Launch instance' },
      { id: 'stop-all-instances', text: 'Stop all instances' },
    ],
    items: [
      {
        id: 'launch-instance-from-template',
        text: 'Launch instance from template',
        disabledReason: 'No template available',
        disabled: true,
      },
    ],
    ariaLabel: 'open dropdown',
    loading: false,
    loadingText: 'Loading',
    expandableGroups: false,
    expandToViewport: false,
  });
  const [dataStr, setDataStr] = useState('');
  const [dataError, setDataError] = useState('');
  const [editorLoading, setEditorLoading] = useState(false);

  useEffect(() => {
    if (!dataStr) {
      return;
    }

    setEditorLoading(true);

    const timeoutId = setTimeout(() => {
      try {
        setParsedData(parseSplitButtonProps(dataStr));
        setDataError('');
      } catch (error: any) {
        setDataError(error.message);
      }

      setEditorLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [dataStr]);

  useEffect(() => {
    if (!editorLoading && !dataError) {
      setDataStr(JSON.stringify(parsedData, null, 2));
    }
  }, [parsedData, editorLoading, dataError]);

  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <Header variant="h1">Simple SplitButton</Header>
        <ColumnLayout columns={2}>
          <FormField
            label={!editorLoading ? 'SplitButtonProps' : 'SplitButtonProps (Updating...)'}
            errorText={dataError}
            stretch={true}
          >
            <Textarea
              value={dataStr}
              onChange={({ detail }) => setDataStr(detail.value)}
              rows={Math.max(10, dataStr.split('\n').length)}
            />
          </FormField>

          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <SplitButton {...parsedData} onItemClick={({ detail }) => alert(`Clicked on "${detail.id}"`)} />
          </div>
        </ColumnLayout>
      </article>
    </ScreenshotArea>
  );
}

function parseSplitButtonProps(input: string): SplitButtonProps {
  const json = JSON.parse(input);
  return orderKeys(
    {
      variant: validateVariant(json),
      segments: validateSegments(json),
      items: validateItems(json),
      ariaLabel: validateNonEmptyString('ariaLabel', json),
      loading: validateBoolean('loading', json),
      loadingText: validateNonEmptyString('loadingText', json),
      expandableGroups: validateBoolean('expandableGroups', json),
      expandToViewport: validateBoolean('expandToViewport', json),
    },
    json
  );
}

function validateSegments(input: Record<string, unknown>): readonly SplitButtonProps.Segment[] {
  if (!Array.isArray(input.segments)) {
    throw new Error('Error: `segments` must be an array.');
  }

  for (const segment of input.segments) {
    if (typeof segment.id !== 'string') {
      throw new Error('Error: segment must have an `id` property of type "string".');
    }
  }

  const ids = input.segments.map(it => it.id);
  if (ids.length !== new Set(ids).size) {
    throw new Error('Error: all segments must have unique IDs.');
  }

  return input.segments.map(segment =>
    orderKeys(
      {
        id: segment.id,
        disabled: segment.disabled !== undefined ? !!segment.disabled : undefined,
        iconName: segment.iconName,
        text: segment.text,
      },
      segment
    )
  );
}

function validateItems(input: Record<string, unknown>): readonly SplitButtonProps.ItemOrGroup[] {
  if (!Array.isArray(input.items)) {
    throw new Error('Error: `items` must be an array.');
  }

  for (const item of input.items) {
    if (typeof item.id !== 'string') {
      throw new Error('Error: item must have an `id` property of type "string".');
    }
  }

  const ids = input.items.map(it => it.id);
  if (ids.length !== new Set(ids).size) {
    throw new Error('Error: all items must have unique IDs.');
  }

  return input.items.map(item => {
    if (item.items) {
      return orderKeys(
        {
          id: item.id,
          text: item.text,
          items: validateItems(item),
        },
        item
      );
    }
    return orderKeys(
      {
        id: item.id,
        text: item.text,
        disabled: item.disabled !== undefined ? !!item.disabled : undefined,
        disabledReason: item.disabledReason,
        href: item.href,
        external: item.external,
        iconName: item.iconName,
      },
      item
    );
  });
}

function validateVariant(input: Record<string, unknown>): SplitButtonProps.Variant {
  if (input.variant === 'normal' || input.variant === 'primary') {
    return input.variant;
  }
  throw new Error(`Error: \`variant\` must be of ["normal", "primary"].`);
}

function validateBoolean(propertyName: string, input: Record<string, unknown>): boolean {
  const value = input[propertyName];
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error(`Error: \`${propertyName}\` must be of [false, true].`);
}

function validateNonEmptyString(propertyName: string, input: Record<string, unknown>): string {
  const value = input[propertyName];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  throw new Error(`Error: \`${propertyName}\` must be a non-empty string.`);
}

function orderKeys<R extends Record<string, unknown>>(result: R, template: Record<string, unknown>): R {
  const templateKeys = Object.keys(template);
  const resultEntries = orderBy(Object.entries(result), ([key]) => templateKeys.indexOf(key));
  return Object.fromEntries(resultEntries) as R;
}
