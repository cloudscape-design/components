// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Dev page: Table with DnD row reordering + form inputs in rows.
 *
 * This page demonstrates the key design requirement from AWSUI-51193:
 * rows containing interactive form controls (text input, select, checkbox)
 * must remain fully usable while drag-and-drop row reordering is enabled.
 *
 * Interactions to test:
 * - Mouse: grab the drag handle (≡ icon) and drag a row to a new position.
 * - Keyboard: Tab to a drag handle → Space/Enter to pick up → Arrow keys to move
 *   → Space/Enter to drop, or Escape to cancel.
 * - Form inputs inside rows: click/tab into them normally; the drag does NOT
 *   activate unless you explicitly grab the handle.
 */

import React, { useState } from 'react';

import { Box, Button, Checkbox, FormField, Header, Input, Select, SpaceBetween, Table } from '~components';

// ── Data ──────────────────────────────────────────────────────────────────────

interface Rule {
  id: string;
  name: string;
  action: string;
  enabled: boolean;
}

const INITIAL_RULES: Rule[] = [
  { id: 'rule-1', name: 'Block bad bots', action: 'BLOCK', enabled: true },
  { id: 'rule-2', name: 'Allow trusted IPs', action: 'ALLOW', enabled: true },
  { id: 'rule-3', name: 'Rate limit API', action: 'COUNT', enabled: false },
  { id: 'rule-4', name: 'Challenge scrapers', action: 'CHALLENGE', enabled: true },
  { id: 'rule-5', name: 'Log everything', action: 'COUNT', enabled: false },
];

const ACTION_OPTIONS = [
  { label: 'Block', value: 'BLOCK' },
  { label: 'Allow', value: 'ALLOW' },
  { label: 'Count', value: 'COUNT' },
  { label: 'Challenge', value: 'CHALLENGE' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReorderableTableWithInputsPage() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [lastMoved, setLastMoved] = useState<string | null>(null);

  const updateRule = (id: string, patch: Partial<Rule>) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <Box margin="m">
      <SpaceBetween size="m">
        <Header
          variant="h1"
          description="Drag rows to reorder rules. Form inputs inside rows remain fully interactive."
        >
          Table DnD row reordering with form inputs (AWSUI-51193)
        </Header>

        {lastMoved && <Box color="text-status-success">✓ Rule &quot;{lastMoved}&quot; was moved.</Box>}

        <Table<Rule>
          trackBy="id"
          items={rules}
          enableRowDrag={true}
          onRowReorder={({ detail }) => {
            setRules(detail.items);
            setLastMoved(detail.movedItem.name);
          }}
          ariaLabels={{
            tableLabel: 'WAF rules',
            dragHandleAriaLabel: 'Drag handle',
            dragHandleAriaDescription:
              'Use Space or Enter to activate drag, Arrow keys to move the row, Space or Enter to drop, Escape to cancel.',
            rowDragLabel: item => `Drag handle for rule: ${item.name}`,
            liveAnnouncementDndStarted: (pos, total) => `Picked up rule at position ${pos} of ${total}`,
            liveAnnouncementDndItemReordered: (init, cur, total) =>
              init === cur
                ? `Moving rule back to position ${cur} of ${total}`
                : `Moving rule to position ${cur} of ${total}`,
            liveAnnouncementDndItemCommitted: (init, final, total) =>
              init === final
                ? `Rule returned to its original position ${init} of ${total}`
                : `Rule moved from position ${init} to position ${final} of ${total}`,
            liveAnnouncementDndDiscarded: 'Reorder cancelled',
          }}
          columnDefinitions={[
            {
              id: 'name',
              header: 'Rule name',
              cell: item => (
                <FormField>
                  <Input
                    value={item.name}
                    ariaLabel={`Rule name for ${item.id}`}
                    onChange={({ detail }) => updateRule(item.id, { name: detail.value })}
                  />
                </FormField>
              ),
            },
            {
              id: 'action',
              header: 'Action',
              cell: item => (
                <FormField>
                  <Select
                    selectedOption={ACTION_OPTIONS.find(o => o.value === item.action) ?? null}
                    options={ACTION_OPTIONS}
                    ariaLabel={`Action for ${item.id}`}
                    onChange={({ detail }) => updateRule(item.id, { action: detail.selectedOption.value! })}
                  />
                </FormField>
              ),
            },
            {
              id: 'enabled',
              header: 'Enabled',
              cell: item => (
                <Checkbox
                  checked={item.enabled}
                  ariaLabel={`Enable rule ${item.name}`}
                  onChange={({ detail }) => updateRule(item.id, { enabled: detail.checked })}
                />
              ),
            },
          ]}
          header={
            <Header
              counter={`(${rules.length})`}
              actions={
                <Button onClick={() => setRules([...INITIAL_RULES].sort(() => Math.random() - 0.5))}>Shuffle</Button>
              }
            >
              WAF Rules
            </Header>
          }
          empty={<Box>No rules</Box>}
        />

        <Box variant="h2">Current order</Box>
        <ol>
          {rules.map((r, i) => (
            <li key={r.id}>
              #{i + 1} — {r.name} ({r.action}, {r.enabled ? 'enabled' : 'disabled'})
            </li>
          ))}
        </ol>
      </SpaceBetween>
    </Box>
  );
}
