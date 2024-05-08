// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { colorBackgroundContainerHeader } from '~design-tokens';
import { useContainerBreakpoints } from '~components/internal/hooks/container-queries';
import { Breakpoint } from '~components/internal/breakpoints';
import { SegmentedControl } from '~components';

const boxStyles: React.CSSProperties = {
  boxSizing: 'border-box',
  marginBlockEnd: 15,
  backgroundColor: colorBackgroundContainerHeader,
};

function MeasureReporter(props: { id?: string; style?: React.CSSProperties; type: 'width' | 'height' }) {
  const [value, ref] = useContainerQuery(
    entry => (props.type === 'width' ? entry.contentBoxWidth : entry.contentBoxHeight),
    [props.type]
  );
  if (value === null) {
    return <div ref={ref}>Loading...</div>;
  }
  return (
    <div id={props.id} ref={ref} style={{ ...boxStyles, ...props.style }}>
      <code>
        {props.type}: {value}
      </code>
    </div>
  );
}

function BreakpointReporter(props: { id?: string; filter?: Breakpoint[]; style?: React.CSSProperties }) {
  const [breakpoint, ref] = useContainerBreakpoints(props.filter);
  if (breakpoint === null) {
    return <div ref={ref}>Loading...</div>;
  }

  return (
    <div id={props.id} ref={ref} style={{ ...boxStyles, ...props.style }}>
      <code>{breakpoint}</code>
    </div>
  );
}

export default function ColumnLayoutPage() {
  const [measureType, setMeasureType] = useState<'width' | 'height'>('width');

  return (
    <>
      <h1>Container queries</h1>

      <SegmentedControl
        id="measure-type"
        selectedId={measureType}
        options={[
          { id: 'width', text: 'width' },
          { id: 'height', text: 'height' },
        ]}
        onChange={e => setMeasureType(e.detail.selectedId as 'width' | 'height')}
      />

      <h2>Reports dimensions correctly</h2>
      <MeasureReporter id="test-dimensions" style={{ inlineSize: 300, blockSize: 50 }} type={measureType} />

      <h2>Reports content-box dimensions when padding is present</h2>
      <MeasureReporter
        id="test-content-box"
        style={{ inlineSize: 300, blockSize: 50, padding: 10 }}
        type={measureType}
      />

      <h2>Adjusts as the element changes size (resize browser)</h2>
      <MeasureReporter id="test-updates" style={{ blockSize: 50 }} type={measureType} />

      <h2>Returns correct breakpoints</h2>
      <BreakpointReporter id="test-breakpoints" style={{ blockSize: 50 }} />

      <h2>Skips &quot;m&quot; when not provided in the filter</h2>
      <BreakpointReporter
        id="test-breakpoints-filter"
        style={{ blockSize: 50 }}
        filter={['default', 'xxs', 'xs', 's', 'l', 'xl']}
      />

      <h2>Returns default if all breakpoints are filtered</h2>
      <BreakpointReporter id="test-breakpoints-filter-all" style={{ blockSize: 50 }} filter={[]} />
    </>
  );
}
