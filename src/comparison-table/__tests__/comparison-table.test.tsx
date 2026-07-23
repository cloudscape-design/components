// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ComparisonTable, { ComparisonTableProps } from '../../../lib/components/comparison-table';
import createWrapper from '../../../lib/components/test-utils/dom';

const attributes: ComparisonTableProps['attributes'] = [
  { id: 'engine', label: 'Engine' },
  { id: 'vcpu', label: 'vCPU' },
];

const entities: ComparisonTableProps['entities'] = [
  { id: 'a', title: 'Option A', data: { engine: 'MySQL', vcpu: 2 } },
  { id: 'b', title: 'Option B', data: { engine: 'MySQL', vcpu: 4 } },
];

function renderComparisonTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findComparisonTable()!;
}

describe('ComparisonTable', () => {
  test('renders and is findable via test-utils', () => {
    const wrapper = renderComparisonTable(<ComparisonTable attributes={attributes} entities={entities} />);
    expect(wrapper).not.toBeNull();
  });

  test('renders one row per attribute (attributes as rows)', () => {
    const wrapper = renderComparisonTable(<ComparisonTable attributes={attributes} entities={entities} />);
    expect(wrapper.findRows()).toHaveLength(attributes.length);
  });

  test('renders one column header per entity plus the attribute column', () => {
    const wrapper = renderComparisonTable(<ComparisonTable attributes={attributes} entities={entities} />);
    // Attribute column header + one per entity.
    const headers = wrapper.getElement().querySelectorAll('thead th');
    expect(headers.length).toBe(entities.length + 1);
  });

  test('renders attribute labels in the sticky attribute column', () => {
    const wrapper = renderComparisonTable(<ComparisonTable attributes={attributes} entities={entities} />);
    const labels = wrapper.findAttributeLabels().map(l => l.getElement().textContent);
    expect(labels).toEqual(['Engine', 'vCPU']);
  });

  test('highlightDifferences emphasizes only differing rows', () => {
    const wrapper = renderComparisonTable(
      <ComparisonTable attributes={attributes} entities={entities} highlightDifferences={true} />
    );
    // "engine" is identical (MySQL/MySQL); "vcpu" differs (2 vs 4) => one differing row across 2 entity cells.
    expect(wrapper.findHighlightedCells()).toHaveLength(2);
  });

  test('does not highlight anything when highlightDifferences is false', () => {
    const wrapper = renderComparisonTable(
      <ComparisonTable attributes={attributes} entities={entities} highlightDifferences={false} />
    );
    expect(wrapper.findHighlightedCells()).toHaveLength(0);
  });

  test('uses the render function to customize entity values', () => {
    const wrapper = renderComparisonTable(
      <ComparisonTable
        attributes={[{ id: 'engine', label: 'Engine', render: value => <em>{`[${value}]`}</em> }]}
        entities={entities}
      />
    );
    expect(wrapper.getElement().textContent).toContain('[MySQL]');
  });

  test('renders without crashing when there are no attributes or entities', () => {
    const wrapper = renderComparisonTable(<ComparisonTable attributes={[]} entities={[]} />);
    expect(wrapper).not.toBeNull();
    expect(wrapper.findRows()).toHaveLength(0);
  });
});
