// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Icon from '~components/icon';
import Select, { SelectProps } from '~components/select';
import TreeView, { TreeViewProps } from '~components/tree-view';

import ScreenshotArea from '../utils/screenshot-area';
import { Actions } from './common';
import { items } from './items/basic-page-items';

import styles from './styles.scss';

export default function BasicTreeView() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>(['1', '4.1']);
  const [toggleIconType, setToggleIconType] = useState<SelectProps.Option>({
    label: 'Default',
    value: 'default',
  });
  const [showConnectorLines, setShowConnectorLines] = useState(false);

  const renderItemToggleIcon = ({ expanded }: TreeViewProps.ItemToggleRenderIconData) => {
    if (toggleIconType.value === 'custom') {
      return <Icon size="small" name={expanded ? 'treeview-collapse' : 'treeview-expand'} ariaLabel="Toggle" />;
    }

    if (toggleIconType.value === 'custom-with-slow-animation') {
      return (
        <Icon
          size="small"
          name="angle-down"
          className={clsx(styles.animation, expanded && styles['animation-expanded'])}
        />
      );
    }
  };

  return (
    <ScreenshotArea>
      <h1>Basic tree view</h1>

      <Grid gridDefinition={[{ colspan: { m: 7, xs: 12 } }]}>
        <div>
          <Checkbox checked={showConnectorLines} onChange={({ detail }) => setShowConnectorLines(detail.checked)}>
            Show connector lines
          </Checkbox>

          <br />

          <FormField label="Toggle icon" stretch={true}>
            <Select
              selectedOption={toggleIconType}
              onChange={({ detail }) => setToggleIconType(detail.selectedOption)}
              options={[
                {
                  label: 'Default',
                  value: 'default',
                },
                {
                  label: 'Custom',
                  value: 'custom',
                },
                {
                  label: 'Custom with slow animation',
                  value: 'custom-with-slow-animation',
                },
              ]}
            />
          </FormField>

          <br />

          <Container>
            <TreeView
              ariaLabel="Basic tree view"
              items={items}
              renderItem={item => {
                return {
                  icon: item.hideIcon ? undefined : (
                    <Icon name={expandedItems.includes(item.id) ? 'folder-open' : 'folder'} ariaLabel="folder" />
                  ),
                  content: item.content,
                  secondaryContent: item.details && <Box color="text-status-inactive">{item.details}</Box>,
                  actions: item.hasActions ? (
                    <Actions
                      actionType="inline-button-dropdown"
                      itemLabel={item.announcementLabel ?? (item.content as string)}
                    />
                  ) : undefined,
                };
              }}
              getItemId={item => item.id}
              getItemChildren={item => item.children}
              onItemToggle={({ detail }: any) =>
                setExpandedItems(prev =>
                  detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                )
              }
              expandedItems={expandedItems}
              i18nStrings={{
                expandButtonLabel: () => 'Expand item',
                collapseButtonLabel: () => 'Collapse item',
              }}
              renderItemToggleIcon={renderItemToggleIcon}
              connectorLines={showConnectorLines ? 'vertical' : undefined}
            />
          </Container>
        </div>
      </Grid>

      <div style={{ marginTop: '10px' }}>Expanded items: {expandedItems.map(id => `Item ${id}`).join(', ')}</div>

      <Button>Element to focus for testing single tab stop</Button>
    </ScreenshotArea>
  );
}
