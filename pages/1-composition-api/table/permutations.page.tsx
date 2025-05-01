// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  ColumnLayout,
  Container,
  Link,
  SpaceBetween,
  StatusIndicator,
  TextContent,
} from '~components';
import Table from '~components/table/composition';

import ScreenshotArea from '../../utils/screenshot-area';
import { data } from './data';
import ExpandableTable from './expandable-table';

export default function () {
  const [truncateText, setTruncateText] = useState(false);

  return (
    <ScreenshotArea>
      <TextContent>
        <h1>Table demo</h1>
        <p>This example shows how composition allows for more specific granularity in features.</p>
        <ol>
          <li>
            The first two examples show how you can enable truncation for certain cells, making sure the most important
            text is always visible
          </li>
          <li>
            The third and fourth examples show how you can use composition to create states like loading and empty by
            adding native properties like colSpan
          </li>
          <li>
            The fifth example shows how relying on more native HTML attributes can really make a composition API come to
            life and allow you to build accessible solutions with smaller pieces
          </li>
        </ol>
        <br />
      </TextContent>

      <SpaceBetween size="l">
        {/* 1st example */}
        <Container>
          <Table.Overflow>
            <Table.Table aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <Table.Head>
                <Table.Row>
                  <Table.Header truncate={true}>
                    Product name Product name Product name Product name Product name Product name
                  </Table.Header>
                  <Table.Header truncate={true}>
                    Category Category Category Category Category Category Category
                  </Table.Header>
                  <Table.Header>Sub-category</Table.Header>
                  <Table.Header>Description</Table.Header>
                  <Table.Header textAlign="right" truncate={true}>
                    Price Price Price Price Price Price Price Price Price Price
                  </Table.Header>
                  <Table.Header>IBAN</Table.Header>
                  <Table.Header>Review</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {data.slice(0, 4).map(row => (
                  <Table.Row key={row.name}>
                    <Table.DataCell>{row.name}</Table.DataCell>
                    <Table.DataCell>{row.category}</Table.DataCell>
                    <Table.DataCell>{row.subcategory}</Table.DataCell>
                    <Table.DataCell>{row.description}</Table.DataCell>
                    <Table.DataCell textAlign="right">${row.price}</Table.DataCell>
                    <Table.DataCell>{row.iban}</Table.DataCell>
                    <Table.DataCell truncate={true}>{row.review}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>
          </Table.Overflow>
        </Container>

        <div />

        {/* 2nd example */}
        <ColumnLayout columns={2}>
          <Container>
            <Table.Overflow>
              <Table.Table style={{ tableLayout: 'fixed' }}>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Property</Table.Header>
                    <Table.Header>Type</Table.Header>
                    <Table.Header>Value</Table.Header>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  <Table.Row>
                    <Table.DataCell truncate={truncateText}>
                      <Link href="#">
                        Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                      </Link>
                    </Table.DataCell>

                    <Table.DataCell truncate={truncateText}>
                      String String String String String String String String String String String String String String
                    </Table.DataCell>

                    <Table.DataCell truncate={true}>#000000</Table.DataCell>
                  </Table.Row>

                  <Table.Row>
                    <Table.DataCell truncate={truncateText}>
                      <Link href="#">
                        Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                      </Link>
                    </Table.DataCell>

                    <Table.DataCell truncate={truncateText}>
                      Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    </Table.DataCell>

                    <Table.DataCell>100</Table.DataCell>
                  </Table.Row>

                  <Table.Row>
                    <Table.DataCell>
                      <Link href="#">
                        Height Height Height Height Height Height Height Height Height Height Height Height Height
                      </Link>
                    </Table.DataCell>

                    <Table.DataCell>
                      Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    </Table.DataCell>

                    <Table.DataCell>200</Table.DataCell>
                  </Table.Row>
                </Table.Body>
              </Table.Table>
            </Table.Overflow>
          </Container>
          <Checkbox checked={truncateText} onChange={event => setTruncateText(event.detail.checked)}>
            Truncate first two rows
          </Checkbox>
        </ColumnLayout>

        <div style={{ marginTop: '20px' }} />

        {/* 3rd example */}
        <ColumnLayout columns={2}>
          <Container>
            <Table.Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Text</Table.Header>

                  <Table.Header>Number</Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <Table.Row>
                  <Table.DataCell colSpan="2">
                    <Box margin={{ bottom: 'xxs', top: 'xs' }} textAlign="center">
                      <StatusIndicator type="loading">Loading items</StatusIndicator>
                    </Box>
                  </Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table.Table>
          </Container>

          {/* 4th example */}
          <Container>
            <Table.Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Text</Table.Header>

                  <Table.Header>Number</Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <Table.Row>
                  <Table.DataCell colSpan="2">
                    <Box margin={{ bottom: 'xxs', top: 'xs' }} textAlign="center">
                      <Box variant="strong" textAlign="center">
                        No resources
                      </Box>

                      <Box variant="p" padding={{ bottom: 's' }}>
                        No resources to display.
                      </Box>

                      <Button>Create resource</Button>
                    </Box>
                  </Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table.Table>
          </Container>
        </ColumnLayout>

        {/* 5th example */}
        <ExpandableTable />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
