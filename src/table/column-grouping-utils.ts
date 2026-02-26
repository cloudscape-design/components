// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { isDevelopment } from '../internal/is-development';
import { TableProps } from './interfaces';
import { getVisibleColumnDefinitions } from './utils';

export namespace TableGroupedTypes {
  export interface ColumnInRow<T> {
    id: string;
    header?: React.ReactNode;
    colspan: number;
    rowspan: number;
    isGroup: boolean;
    isHidden: boolean; // True for placeholder cells that fill gaps where rowspan > 1 would have been
    // TODO: I could find a better way to make this modular instead of 2 props
    // for column and column-group
    columnDefinition?: TableProps.ColumnDefinition<T>;
    groupDefinition?: TableProps.ColumnGroupsDefinition<T>;
    parentGroupIds: string[]; // Chain of parent group IDs for ARIA headers attribute
    rowIndex: number;
    colIndex: number;
  }

  export interface HeaderRow<T> {
    columns: ColumnInRow<T>[];
  }

  export interface HierarchicalStructure<T> {
    rows: HeaderRow<T>[];
    maxDepth: number;
    columnToParentIds: Map<string, string[]>; // Maps leaf column IDs to their parent group IDs
  }
}

// namespace TableTreeTypes {
//     export interface TableHeaderNode<T> {
//         id: string;
//         header?: React.ReactNode;
//         colspan?: number; // -1 for phantom
//         rowspan?: number;  /// same -1 for phantom
//         columnDefinition?: TableProps.ColumnDefinition<T>;
//         subtreeHeight?: number;
//         groupDefinition?: TableProps.ColumnGroupsDefinition<T>;
//         parentNode?: TableHeaderNode<T>;
//         children?: TableHeaderNode<T>[]; // order here implies actual render order
//         colIndex?: number; // Absolute column index for aria-colindex
//     }
// }

// creates the connection between nodes going from child to root
function createNodeConnections<T>(
  visibleLeafColumns: Readonly<TableProps.ColumnDefinition<T>[]>,
  idToNodeMap: Map<string, TableHeaderNode<T>>,
  rootNode: TableHeaderNode<T>
): void {
  const visitedNodesIdSet = new Set<string>();

  visibleLeafColumns.forEach(column => {
    if (!column.id) {
      return;
    }

    let currentNode = idToNodeMap.get(column.id);
    if (!currentNode) {
      return;
    }

    // Track nodes visited in this single leaf-to-root path to detect cycles
    const pathVisited = new Set<string>();

    while (currentNode) {
      // Cycle detection: if we've seen this node in the current path, we have a circular reference
      if (pathVisited.has(currentNode.id)) {
        warnOnceInDev(`Circular reference detected in column group definitions involving "${currentNode.id}".`);
        // Connect the node to root to prevent orphaning
        if (!visitedNodesIdSet.has(currentNode.id)) {
          rootNode.addChild(currentNode);
          visitedNodesIdSet.add(currentNode.id);
        }
        break;
      }
      pathVisited.add(currentNode.id);

      const groupDef = currentNode.groupDefinition;
      const colDef = currentNode.columnDefinition;

      // Find parent ID from either groupDefinition or columnDefinition
      const parentId = groupDef?.groupId || colDef?.groupId;

      if (!parentId) {
        // No parent means this connects to root
        if (!visitedNodesIdSet.has(currentNode.id)) {
          rootNode.addChild(currentNode);
          visitedNodesIdSet.add(currentNode.id);
        }
        break;
      }

      const parentNode = idToNodeMap.get(parentId);
      if (!parentNode) {
        // Parent not found, connect to root
        warnOnceInDev(
          `Group "${currentNode.id}" references non-existent parent group "${parentId}". Treating as top-level.`
        );
        if (!visitedNodesIdSet.has(currentNode.id)) {
          rootNode.addChild(currentNode);
          visitedNodesIdSet.add(currentNode.id);
        }
        break;
      }

      // Connect child to parent (only if not already connected)
      if (!visitedNodesIdSet.has(currentNode.id)) {
        parentNode.addChild(currentNode);
        visitedNodesIdSet.add(currentNode.id);
      }

      // Move up the tree
      currentNode = parentNode;
    }
  });
}

export class TableHeaderNode<T> {
  id: string;
  colspan: number = 1;
  rowspan: number = 1;
  subtreeHeight: number = 1;
  columnDefinition?: TableProps.ColumnDefinition<T>;
  groupDefinition?: TableProps.ColumnGroupsDefinition<T>;
  parentNode?: TableHeaderNode<T>;
  children: TableHeaderNode<T>[] = [];
  rowIndex: number = -1;
  colIndex: number = -1;
  isRoot: boolean = false;
  isHidden: boolean = false;

  constructor(
    id: string,
    options?: {
      colspan?: number;
      rowspan?: number;
      columnDefinition?: TableProps.ColumnDefinition<T>;
      groupDefinition?: TableProps.ColumnGroupsDefinition<T>;
      parentNode?: TableHeaderNode<T>;
      rowIndex?: number;
      colIndex?: number;
      isRoot?: boolean;
      isHidden?: boolean;
    }
  ) {
    this.id = id;
    Object.assign(this, options);
    this.children = [];
  }

  get isGroup(): boolean {
    return !!this.groupDefinition;
  }

  get isRootNode(): boolean {
    return this.isRoot;
  }

  public addChild(child: TableHeaderNode<T>): void {
    this.children.push(child);
    child.parentNode = this;
  }

  get isLeaf(): boolean {
    return !this.isRoot && this.children.length === 0;
  }
}

export function warnOnceInDev(message: string): void {
  if (isDevelopment) {
    warnOnce(`[Table]`, message);
  }
}

// function to evaluate validity of the grouping and if the ordering via column display splits it
// should give dev warning ...

// from
// column defininitions
// column grouping definitions
// columnDisplay : array of colprops (id: string; visible: boolean;) - only child columns

// output the hierarchical tree:

export function CalculateHierarchyTree<T>(
  columnDefinitions: TableProps.ColumnDefinition<T>[],
  visibleColumnIds: string[],
  columnGroupingDefinitions: TableProps.ColumnGroupsDefinition<T>[],
  columnDisplayProperties?: TableProps.ColumnDisplayProperties[]
): TableGroupedTypes.HierarchicalStructure<T> {
  // filtering by visible columns
  const visibleColumns: Readonly<TableProps.ColumnDefinition<T>[]> = getVisibleColumnDefinitions({
    columnDisplay: columnDisplayProperties,
    visibleColumns: visibleColumnIds,
    columnDefinitions: columnDefinitions,
  });

  // creating hashmap from id to node
  const idToNodeMap: Map<string, TableHeaderNode<T>> = new Map();

  visibleColumns.forEach((columnDefinition: TableProps.ColumnDefinition<T>) => {
    if (columnDefinition.id === undefined) {
      return;
    }

    idToNodeMap.set(
      columnDefinition.id,
      new TableHeaderNode<T>(columnDefinition.id, { columnDefinition: columnDefinition })
    );
  });

  columnGroupingDefinitions.forEach((groupDefinition: TableProps.ColumnGroupsDefinition<T>) => {
    if (groupDefinition.id === undefined) {
      return;
    }

    idToNodeMap.set(
      groupDefinition.id,
      new TableHeaderNode<T>(groupDefinition.id, { groupDefinition: groupDefinition })
    );
  });

  // traverse from root to parent to create a

  const rootNode = new TableHeaderNode<T>('*', { isRoot: true });

  // create connection 0(N)ish pass leaf to root
  createNodeConnections(visibleColumns, idToNodeMap, rootNode);

  // traversal for SubTreeHeight
  traverseForSubtreeHeight(rootNode);

  rootNode.colspan = visibleColumnIds.length;
  rootNode.rowIndex = -1; // Root starts at -1 so children start at 0
  rootNode.rowspan = 1; // Root takes one row (not rendered)

  // bfs for row span and row index
  rootNode.children.forEach(node => {
    traverseForRowSpanAndRowIndex(node, rootNode.subtreeHeight - 1);
  });

  // Expand nodes with rowspan > 1 into chains of hidden nodes in the tree
  expandRowspansToHiddenNodes(rootNode);

  // Re-compute subtree heights after hidden node insertion
  traverseForSubtreeHeight(rootNode);

  // dfs for colspan and col index
  traverseForColSpanAndColIndex(rootNode);

  return buildHierarchicalStructure(rootNode);
}

function traverseForSubtreeHeight<T>(node: TableHeaderNode<T>) {
  node.subtreeHeight = 1;

  for (const child of node.children) {
    node.subtreeHeight = Math.max(node.subtreeHeight, traverseForSubtreeHeight(child) + 1);
  }

  return node.subtreeHeight;
}

function traverseForRowSpanAndRowIndex<T>(
  node: TableHeaderNode<T>,
  allTreesMaxHeight: number,
  rowsTakenByAncestors: number = 0
) {
  // formula: rowSpan = totalTreeHeight - rowsTakenByAncestors - maxSubtreeHeight
  const maxSubtreeHeight = Math.max(...node.children.map(child => child.subtreeHeight as number), 0);
  node.rowspan = allTreesMaxHeight - rowsTakenByAncestors - maxSubtreeHeight;

  // rowIndex = parentRowIndex + parentRowSpan
  if (node.parentNode) {
    node.rowIndex = node.parentNode.rowIndex + node.parentNode.rowspan;
  }

  node.children.forEach(childNode => {
    traverseForRowSpanAndRowIndex(childNode, allTreesMaxHeight, rowsTakenByAncestors + node.rowspan);
  });
}

/**
 * Expands nodes with rowspan > 1 into a chain of hidden placeholder nodes ABOVE
 * the real node, so the visible cell appears at the bottom (aligned with leaf columns).
 *
 * For a node at rowIndex=R with rowspan=N, we:
 *   1. Create (N-1) hidden placeholder nodes at rows R, R+1, ..., R+N-2
 *   2. Move the real node to row R+N-1 (the bottom of its span) with rowspan=1
 *   3. The hidden nodes form a parent chain: parent→hidden(R)→hidden(R+1)→...→realNode(R+N-1)
 *   4. The real node keeps its original children.
 */
function expandRowspansToHiddenNodes<T>(node: TableHeaderNode<T>): void {
  // Process children first (bottom-up so we don't interfere with our own expansion)
  for (const child of [...node.children]) {
    expandRowspansToHiddenNodes(child);
  }

  if (node.isRoot) {
    return;
  }

  if (node.rowspan <= 1) {
    return;
  }

  // Only expand leaf columns — groups keep their natural HTML rowspan
  if (node.isGroup) {
    return;
  }

  const originalRowspan = node.rowspan;
  const originalRowIndex = node.rowIndex;
  const parentNode = node.parentNode!;

  // Remove this node from its parent's children
  const indexInParent = parentNode.children.indexOf(node);
  parentNode.children.splice(indexInParent, 1);

  // Build a chain of hidden nodes at the top rows
  let currentParent = parentNode;
  for (let r = 0; r < originalRowspan - 1; r++) {
    const hiddenNode = new TableHeaderNode<T>(node.id, {
      rowIndex: originalRowIndex + r,
      rowspan: 1,
      colspan: node.colspan,
      columnDefinition: node.columnDefinition,
      groupDefinition: node.groupDefinition,
      isHidden: true,
    });
    // Insert at the same position in parent to maintain column order
    if (currentParent === parentNode) {
      currentParent.children.splice(indexInParent, 0, hiddenNode);
    } else {
      currentParent.addChild(hiddenNode);
    }
    hiddenNode.parentNode = currentParent;
    currentParent = hiddenNode;
  }

  // Move the real node to the bottom row
  node.rowIndex = originalRowIndex + originalRowspan - 1;
  node.rowspan = 1;
  currentParent.addChild(node);
  node.parentNode = currentParent;
}

// takes currColIndex from where to start from
// and returns the starting colindex for next node
function traverseForColSpanAndColIndex<T>(node: TableHeaderNode<T>, currColIndex = 0): number {
  node.colIndex = currColIndex;

  if (node.isLeaf) {
    return currColIndex + 1;
  }

  let runningColIndex = currColIndex;
  for (const childNode of node.children) {
    runningColIndex = traverseForColSpanAndColIndex(childNode, runningColIndex);
  }

  node.colspan = runningColIndex - currColIndex;
  return runningColIndex;
}

function buildParentChain<T>(node: TableHeaderNode<T>): string[] {
  const chain: string[] = [];
  let current = node.parentNode;

  while (current && !current.isRoot) {
    // Skip hidden placeholder nodes — they are not real group parents
    if (!current.isHidden) {
      chain.push(current.id);
    }
    current = current.parentNode;
  }

  // Already in order: immediate parent to root
  return chain.reverse();
}

function buildHierarchicalStructure<T>(rootNode: TableHeaderNode<T>): TableGroupedTypes.HierarchicalStructure<T> {
  const maxDepth = rootNode.subtreeHeight - 1;
  const rowsMap = new Map<number, TableGroupedTypes.ColumnInRow<T>[]>();
  const columnToParentIds = new Map<string, string[]>();

  // BFS traversal - naturally gives column order per row
  const queue: TableHeaderNode<T>[] = [...rootNode.children]; // Skip root

  while (queue.length > 0) {
    const node = queue.shift()!;
    const parentChain = buildParentChain(node);

    const columnInRow: TableGroupedTypes.ColumnInRow<T> = {
      id: node.id,
      header: node.groupDefinition?.header || node.columnDefinition?.header,
      colspan: node.colspan,
      rowspan: node.rowspan,
      isGroup: node.isGroup,
      isHidden: node.isHidden,
      columnDefinition: node.columnDefinition,
      groupDefinition: node.groupDefinition,
      parentGroupIds: parentChain,
      rowIndex: node.rowIndex,
      colIndex: node.colIndex,
    };

    // Add to appropriate row
    if (!rowsMap.has(node.rowIndex)) {
      rowsMap.set(node.rowIndex, []);
    }
    rowsMap.get(node.rowIndex)!.push(columnInRow);

    // Track parent chain for leaf columns (skip hidden placeholder nodes)
    if (node.isLeaf && node.columnDefinition && !node.isHidden) {
      const parentChainForTracking = buildParentChain(node);
      if (parentChainForTracking.length > 0) {
        columnToParentIds.set(node.id, parentChainForTracking);
      }
    }

    // Add children to queue (already in correct order)
    queue.push(...node.children);
  }

  // Convert map to sorted array
  const rows: TableGroupedTypes.HeaderRow<T>[] = Array.from(rowsMap.keys())
    .sort((a, b) => a - b)
    .map(key => ({
      columns: rowsMap.get(key)!.sort((a, b) => a.colIndex - b.colIndex),
    }));

  return { rows, maxDepth, columnToParentIds };
}
