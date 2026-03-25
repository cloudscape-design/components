// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayoutToolbar from '~components/app-layout-toolbar';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Token from '~components/token';
interface FieldValue {
  value: string;
}
interface FieldPopoverProps {
  fieldName: string;
  fieldValues: FieldValue[];
  onAddValue: (value: string) => void;
  onAggregation: (aggregationType: string) => void;
}
function AggregationButtons({ onAggregation }: { onAggregation: (type: string) => void }) {
  return (
    <SpaceBetween size="xs">
      <SpaceBetween direction="horizontal" size="xs">
        <Button iconAlign="left" iconName="insert-row" variant="normal" onClick={() => onAggregation('sum')}>
          Sum by
        </Button>
        <Button iconAlign="left" iconName="insert-row" variant="normal" onClick={() => onAggregation('count')}>
          Count by
        </Button>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs">
        <Button iconAlign="left" iconName="insert-row" variant="normal" onClick={() => onAggregation('avg')}>
          Avg by
        </Button>
        <Button iconAlign="left" iconName="insert-row" variant="normal" onClick={() => onAggregation('max')}>
          Max by
        </Button>
      </SpaceBetween>
      <Button iconAlign="left" iconName="close" variant="normal" onClick={() => onAggregation('none')}>
        Group without
      </Button>
    </SpaceBetween>
  );
}
function FieldPopover({ fieldName, fieldValues, onAddValue, onAggregation }: FieldPopoverProps) {
  return (
    <Popover
      content={
        <SpaceBetween size="s">
          {fieldValues.map((field, index) => (
            <SpaceBetween key={index} alignItems="center" direction="horizontal" size="xs">
              <Box fontSize="body-m" variant="span">
                {field.value}
              </Box>
              <Button iconName="add-plus" variant="inline-icon" onClick={() => onAddValue(field.value)} />
            </SpaceBetween>
          ))}
          <Box
            margin={{
              vertical: 'xs',
            }}
            variant="div"
          />
          <AggregationButtons onAggregation={onAggregation} />
        </SpaceBetween>
      }
      dismissButton={true}
      header={fieldName}
      position="bottom"
      size="medium"
      triggerType="custom"
    >
      <Token
        dismissLabel="Dismiss token"
        variant="inline"
        label={`${fieldName} (${fieldValues.length})`}
        clickable={true}
      />
    </Popover>
  );
}
function QueryBuilder() {
  const handleAddValue = (fieldName: string, value: string) => {
    console.log(`Adding value "${value}" from field "${fieldName}"`);
  };
  const handleAggregation = (fieldName: string, aggregationType: string) => {
    console.log(`Applying "${aggregationType}" aggregation to field "${fieldName}"`);
  };
  const statusCodeValues: FieldValue[] = [
    {
      value: '200',
    },
    {
      value: '503',
    },
    {
      value: '500',
    },
  ];
  const serverAddressValues: FieldValue[] = [
    {
      value: '192.168.1.1',
    },
    {
      value: '10.0.0.1',
    },
    {
      value: '172.16.0.5',
    },
  ];
  return (
    <AppLayoutToolbar
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            {
              href: '#',
              text: 'Service',
            },
            {
              href: '#',
              text: 'Query builder',
            },
          ]}
        />
      }
      content={
        <SpaceBetween size="l">
          <Header description="Group and aggregate fields to build your query." variant="h1">
            Query builder
          </Header>
          <Container
            header={
              <Header description="Choose a field token to apply an aggregation function." variant="h2">
                Group by fields
              </Header>
            }
            data-venue="true"
          >
            <SpaceBetween alignItems="center" direction="horizontal" size="s">
              <FieldPopover
                fieldName="http.status_code"
                fieldValues={statusCodeValues}
                onAddValue={value => handleAddValue('http.status_code', value)}
                onAggregation={type => handleAggregation('http.status_code', type)}
              />
              <FieldPopover
                fieldName="server address"
                fieldValues={serverAddressValues}
                onAddValue={value => handleAddValue('server address', value)}
                onAggregation={type => handleAggregation('server address', type)}
              />
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      }
      contentType="default"
      navigationHide={true}
      toolsHide={true}
    />
  );
}
export default QueryBuilder;
