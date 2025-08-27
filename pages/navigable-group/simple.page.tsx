// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import Link from '~components/link';
import NavigableGroup from '~components/navigable-group';
import SpaceBetween from '~components/space-between';

export default function NavigableGroupSimplePage() {
  return (
    <article>
      <h1>NavigableGroup simple example</h1>
      <SpaceBetween direction="vertical" size="l">
        <div>
          <h2>Basic NavigableGroup with buttons</h2>
          <div role="toolbar" aria-label="Simple toolbar">
            <NavigableGroup getItemKey={element => element.id}>
              <Button id="1">First</Button>
              <Button id="2">Second</Button>
              <Button id="3">Third</Button>
            </NavigableGroup>
          </div>
        </div>

        <div>
          <h2>NavigableGroup with mixed elements</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} role="toolbar" aria-label="Mixed toolbar">
            <NavigableGroup getItemKey={e => e.id}>
              <Button id="1" variant="primary">
                Save
              </Button>
              <Button id="2">Cancel</Button>
              <Button id="3" variant="link">
                Help
              </Button>
              <ButtonDropdown
                id="4"
                items={[
                  { id: '1', text: 'Item 1' },
                  { id: '2', text: 'Item 2' },
                ]}
              >
                Dropdown
              </ButtonDropdown>
              <Checkbox id="5" checked={false}>
                Checkbox
              </Checkbox>
              <Link id="7" href="#">
                Link
              </Link>
            </NavigableGroup>
          </div>
        </div>

        <div>
          <h2>NavigableGroup with custom styling</h2>
          <NavigableGroup navigationDirection="horizontal" getItemKey={e => e.innerText}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
              }}
              role="toolbar"
              aria-label="Compact toolbar"
            >
              <Button
                iconName="add-plus"
                style={{ root: { borderRadius: '8px 0 0 8px' } }}
                nativeButtonAttributes={{ style: { outlineOffset: '-2px' } }}
              >
                Add
              </Button>
              <Button iconName="edit" style={{ root: { borderRadius: '0', borderWidth: '2px 0 2px 0' } }}>
                Edit
              </Button>
              <Button iconName="remove" style={{ root: { borderRadius: '0 8px 8px 0' } }}>
                Delete
              </Button>
            </div>
          </NavigableGroup>
        </div>
      </SpaceBetween>
    </article>
  );
}
