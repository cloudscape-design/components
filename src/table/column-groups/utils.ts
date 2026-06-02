// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TableProps } from '../interfaces';
import { getVisibleColumnDefinitions } from '../utils';

export interface HeaderRowColumn<T> {
  id: string;
  header?: React.ReactNode;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
  columnDefinition?: TableProps.ColumnDefinition<T>;
  groupDefinition?: TableProps.GroupDefinition;
  parentGroupIds: string[];
  colIndex: number;
}

export interface HeaderRow<T> {
  columns: HeaderRowColumn<T>[];
}

export interface ColumnGroupsLayout<T> {
  rows: HeaderRow<T>[];
  maxDepth: number;
  columnToParentIds: Map<string, string[]>;
}

export interface TableHeaderNodeProps<T> {
  columnDefinition?: TableProps.ColumnDefinition<T>;
  groupDefinition?: TableProps.GroupDefinition;
  isRoot?: boolean;
  colSpan?: number;
  rowSpan?: number;
  rowIndex?: number;
  colIndex?: number;
}

/**
 * A node in the table header tree.
 * - Leaf nodes map to column definitions.
 * - Internal nodes map to group definitions.
 * - The root is a virtual container (never rendered).
 */
export class TableHeaderNode<T> {
  public readonly id: string;
  public readonly isRoot: boolean;
  public readonly columnDefinition?: TableProps.ColumnDefinition<T>;
  public readonly groupDefinition?: TableProps.GroupDefinition;

  public colSpan: number;
  public rowSpan: number;
  public rowIndex: number;
  public colIndex: number;
  public subTreeHeight: number = 1;

  public children: TableHeaderNode<T>[] = [];
  public parent?: TableHeaderNode<T>;

  constructor(id: string, props: TableHeaderNodeProps<T> = {}) {
    this.id = id;
    this.isRoot = props.isRoot ?? false;
    this.columnDefinition = props.columnDefinition;
    this.groupDefinition = props.groupDefinition;
    this.colSpan = props.colSpan ?? 1;
    this.rowSpan = props.rowSpan ?? 1;
    this.rowIndex = props.rowIndex ?? -1;
    this.colIndex = props.colIndex ?? -1;
  }

  get isGroup(): boolean {
    return !!this.groupDefinition;
  }

  get isLeaf(): boolean {
    return !this.isRoot && this.children.length === 0;
  }

  addChild(child: TableHeaderNode<T>): void {
    this.children.push(child);
    child.parent = this;
  }
}

/**
 * Builds the tree from the nested columnDisplay structure.
 * Groups are only attached if they contain at least one visible descendant.
 */
function buildTreeFromColumnDisplay<T>(
  displayItems: ReadonlyArray<TableProps.ColumnDisplayProperties>,
  nodeMap: Map<string, TableHeaderNode<T>>,
  parent: TableHeaderNode<T>
): void {
  for (const item of displayItems) {
    if (item.type === 'group') {
      const groupNode = nodeMap.get(item.id);
      if (!groupNode) {
        warnOnce('[Table]', `Group "${item.id}" referenced in columnDisplay not found in groupDefinitions. Skipping.`);
        continue;
      }
      buildTreeFromColumnDisplay(item.children, nodeMap, groupNode);
      // Only attach group if it has visible descendants. The recursive call above
      // only adds children that are either visible columns or nested groups with
      // their own visible descendants, so this check handles all nesting levels.
      if (groupNode.children.length > 0) {
        parent.addChild(groupNode);
      }
    } else {
      if (!item.visible) {
        continue;
      }
      const colNode = nodeMap.get(item.id);
      if (colNode) {
        parent.addChild(colNode);
      }
    }
  }
}

/**
 * Fallback when no columnDisplay is provided: all visible columns attach directly to root.
 */
function buildTreeFromVisibleColumns<T>(
  visibleColumns: Readonly<TableProps.ColumnDefinition<T>[]>,
  nodeMap: Map<string, TableHeaderNode<T>>,
  root: TableHeaderNode<T>
): void {
  for (const col of visibleColumns) {
    // Columns without IDs cannot participate in grouping, they have no key
    // to match against columnDisplay entries or groupDefinitions.
    if (!col.id) {
      continue;
    }
    const node = nodeMap.get(col.id);
    if (node) {
      root.addChild(node);
    }
  }
}

function computeSubTreeHeights<T>(node: TableHeaderNode<T>): number {
  if (node.isLeaf || node.children.length === 0) {
    node.subTreeHeight = 1;
    return 1;
  }
  const maxChildHeight = Math.max(...node.children.map(child => computeSubTreeHeights(child)));
  node.subTreeHeight = maxChildHeight + 1;
  return node.subTreeHeight;
}

function computeRowSpansAndIndices<T>(node: TableHeaderNode<T>, treeHeight: number, ancestorRows: number = 0): void {
  const maxChildHeight = Math.max(...node.children.map(c => c.subTreeHeight), 0);
  node.rowSpan = treeHeight - ancestorRows - maxChildHeight;

  if (node.parent) {
    node.rowIndex = node.parent.rowIndex + node.parent.rowSpan;
  }

  for (const child of node.children) {
    computeRowSpansAndIndices(child, treeHeight, ancestorRows + node.rowSpan);
  }
}

function computeColSpansAndIndices<T>(node: TableHeaderNode<T>, startCol: number = 0): number {
  node.colIndex = startCol;

  if (node.isLeaf) {
    node.colSpan = 1;
    return startCol + 1;
  }

  let nextCol = startCol;
  for (const child of node.children) {
    nextCol = computeColSpansAndIndices(child, nextCol);
  }

  node.colSpan = nextCol - startCol;
  return nextCol;
}

export function calculateHierarchyTree<T>(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  visibleColumnIds: readonly string[],
  groupDefinitions: ReadonlyArray<TableProps.GroupDefinition>,
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>
): ColumnGroupsLayout<T> {
  const visibleColumns = getVisibleColumnDefinitions({
    columnDisplay,
    visibleColumns: visibleColumnIds,
    columnDefinitions,
  });

  const nodeMap = new Map<string, TableHeaderNode<T>>();

  for (const col of visibleColumns) {
    if (col.id) {
      nodeMap.set(col.id, new TableHeaderNode<T>(col.id, { columnDefinition: col }));
    }
  }

  for (const group of groupDefinitions) {
    nodeMap.set(group.id, new TableHeaderNode<T>(group.id, { groupDefinition: group }));
  }

  const root = new TableHeaderNode<T>('*', { isRoot: true });

  if (columnDisplay && columnDisplay.length > 0) {
    buildTreeFromColumnDisplay(columnDisplay, nodeMap, root);
  } else {
    buildTreeFromVisibleColumns(visibleColumns, nodeMap, root);
  }

  computeSubTreeHeights(root);

  const treeHeight = root.subTreeHeight - 1;
  root.rowIndex = -1;
  root.rowSpan = 1;
  root.colSpan = visibleColumns.length;

  for (const child of root.children) {
    computeRowSpansAndIndices(child, treeHeight);
  }

  computeColSpansAndIndices(root);

  return buildOutput(root, treeHeight);
}

function getParentChain<T>(node: TableHeaderNode<T>): string[] {
  const chain: string[] = [];
  let current = node.parent;
  while (current && !current.isRoot) {
    chain.unshift(current.id);
    current = current.parent;
  }
  return chain;
}

function buildOutput<T>(root: TableHeaderNode<T>, maxDepth: number): ColumnGroupsLayout<T> {
  const rowsMap = new Map<number, HeaderRowColumn<T>[]>();
  const columnToParentIds = new Map<string, string[]>();

  const queue: TableHeaderNode<T>[] = [...root.children];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const parentChain = getParentChain(node);

    const entry: HeaderRowColumn<T> = {
      id: node.id,
      header: node.groupDefinition?.header ?? node.columnDefinition?.header,
      colSpan: node.colSpan,
      rowSpan: node.rowSpan,
      isGroup: node.isGroup,
      columnDefinition: node.columnDefinition,
      groupDefinition: node.groupDefinition,
      parentGroupIds: parentChain,
      colIndex: node.colIndex,
    };

    if (!rowsMap.has(node.rowIndex)) {
      rowsMap.set(node.rowIndex, []);
    }
    rowsMap.get(node.rowIndex)!.push(entry);

    if (node.isLeaf && node.columnDefinition && parentChain.length > 0) {
      columnToParentIds.set(node.id, parentChain);
    }

    queue.push(...node.children);
  }

  // Sort row indices to ensure rows are ordered top-to-bottom,
  // then sort columns within each row by their horizontal position.
  const rows: HeaderRow<T>[] = Array.from(rowsMap.keys())
    .sort((a, b) => a - b)
    .map(key => ({ columns: rowsMap.get(key)!.sort((a, b) => a.colIndex - b.colIndex) }));

  return { rows, maxDepth, columnToParentIds };
}

export function getColumnGroupsDepth(columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>): number {
  if (!columnDisplay) {
    return 0;
  }
  let maxDepth = 0;
  for (const item of columnDisplay) {
    if (item.type === 'group') {
      maxDepth = Math.max(maxDepth, 1 + getColumnGroupsDepth(item.children));
    }
  }
  return maxDepth;
}
