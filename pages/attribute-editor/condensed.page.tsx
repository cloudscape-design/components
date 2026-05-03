// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayoutToolbar from '~components/app-layout-toolbar';
import AttributeEditor from '~components/attribute-editor';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button/internal';
import Container from '~components/container';
import Header from '~components/header';
import Select from '~components/select';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
interface LabelFilter {
  label: string;
  operator: string;
  value: string;
}
const LABEL_OPTIONS = [
  {
    value: 'alertname',
  },
  {
    value: 'alertstate',
  },
  {
    value: 'job',
  },
  {
    value: 'namespace',
  },
  {
    value: 'severity',
  },
  {
    value: 'instance',
  },
];
const OPERATOR_OPTIONS = [
  {
    label: '=',
    value: '=',
  },
  {
    label: '!=',
    value: '!=',
  },
  {
    label: '=~',
    value: '=~',
  },
  {
    label: '!~',
    value: '!~',
  },
];
const VALUE_OPTIONS = [
  {
    value: 'pending',
  },
  {
    value: 'firing',
  },
  {
    value: 'resolved',
  },
  {
    value: 'inactive',
  },
];
function LabelFilters() {
  const [filters, setFilters] = useState<LabelFilter[]>([
    {
      label: 'alertstate',
      operator: '=',
      value: 'pending',
    },
  ]);
  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        label: '',
        operator: '=',
        value: '',
      },
    ]);
  };
  const handleRemoveFilter = (itemIndex: number) => {
    const newFilters = filters.filter((_, index) => index !== itemIndex);
    setFilters(newFilters);
  };
  const updateFilter = (index: number, field: keyof LabelFilter, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = {
      ...newFilters[index],
      [field]: value,
    };
    setFilters(newFilters);
  };
  const attributeEditorDefinition = [
    {
      // label: 'Label',
      control: (item: LabelFilter, itemIndex: number) => (
        <Select
          variant="group-start"
          options={LABEL_OPTIONS}
          selectedOption={LABEL_OPTIONS.find(opt => opt.value === item.label) || LABEL_OPTIONS[0]}
          onChange={({ detail }) => updateFilter(itemIndex, 'label', detail.selectedOption.value ?? '')}
        />
      ),
    },
    {
      // label: 'Operator',
      control: (item: LabelFilter, itemIndex: number) => (
        <Select
          variant="group-middle"
          options={OPERATOR_OPTIONS}
          selectedOption={OPERATOR_OPTIONS.find(opt => opt.value === item.operator) || OPERATOR_OPTIONS[0]}
          onChange={({ detail }) => updateFilter(itemIndex, 'operator', detail.selectedOption.value || '=')}
        />
      ),
    },
    {
      control: (item: LabelFilter, itemIndex: number) => (
        <Select
          variant="group-middle"
          options={VALUE_OPTIONS}
          selectedOption={VALUE_OPTIONS.find(opt => opt.value === item.value) || VALUE_OPTIONS[0]}
          onChange={({ detail }) => updateFilter(itemIndex, 'value', detail.selectedOption.value ?? '')}
        />
      ),
    },
  ];
  return (
    <AppLayoutToolbar
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            {
              href: '#',
              text: 'Home',
            },
            {
              href: '#',
              text: 'Label filters',
            },
          ]}
        />
      }
      content={
        <SpaceBetween size="l">
          <Header description="Define label-based filters to match and route alerts." variant="h1">
            Label filters
          </Header>
          <Container
            header={
              <Header
                description="Specify label key-value pairs to filter alerts. Only alerts matching all filters are shown."
                variant="h2"
              >
                Label filters
              </Header>
            }
            data-venue="true"
          >
            <AttributeEditor
              direction="horizontal"
              variant="condensed"
              addButtonText="Add filter"
              definition={attributeEditorDefinition}
              empty={
                <Box color="inherit" textAlign="center">
                  No filters added. Choose &#34;Add filter&#34; to add a label filter.
                </Box>
              }
              gridLayout={[
                {
                  removeButton: {
                    width: 'auto',
                  },
                  rows: [[3, 1, 3]],
                },
              ]}
              items={filters}
              removeButtonText="Remove"
              onAddButtonClick={handleAddFilter}
              onRemoveButtonClick={({ detail }) => handleRemoveFilter(detail.itemIndex)}
              customRowActions={() => {
                return <Button iconName="close" variant="condensed-filter"></Button>;
              }}
            />
          </Container>
        </SpaceBetween>
      }
      contentType="form"
      navigation={
        <SideNavigation
          header={{
            href: '#',
            text: 'Monitoring',
          }}
          items={[
            {
              href: '#label-filters-01',
              text: 'Label filters',
              type: 'link',
            },
          ]}
        />
      }
      toolsHide={true}
    />
  );
}
export default LabelFilters;
