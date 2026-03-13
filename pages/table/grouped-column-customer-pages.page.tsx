// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { FormField, Header, Input, SpaceBetween, StatusIndicator, Table, TableProps, Toggle } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type DemoContext = React.Context<
  AppContextType<{
    resizable: boolean;
    firstSticky: number;
    lastSticky: number;
    customGap: boolean;
    gap: number;
  }>
>;

// ============================================================================
// 1. Patching Findings Summary (Mirador Team)
// 2 levels, 3-9 sub-columns, sorting, resizing, sticky columns
// ============================================================================

interface PatchingHost {
  owner: string;
  totalHosts: number;
  hostsNotReporting: number;
  redHosts: number;
  yellowHosts: number;
  greenHosts: number;
  compliancePercent: number;
}

const patchingData: PatchingHost[] = [
  {
    owner: "Divya Gaur's team",
    totalHosts: 10,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 10,
    compliancePercent: 100,
  },
  {
    owner: 'Divya Gaur (gaurdiv)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Akshay Bapat (aksbapat)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Alex Kochurov (alexko)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Ayden Carter (aycart)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Jannik Altenhofer (jhofr)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Moon Lee (moonlee)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Mihir Pavuskar (pavuskar)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
  {
    owner: 'Jeffrey Rohlman (rohlmanj)',
    totalHosts: 2,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 2,
    compliancePercent: 100,
  },
  {
    owner: 'Tushar Jain (tusjain)',
    totalHosts: 1,
    hostsNotReporting: 0,
    redHosts: 0,
    yellowHosts: 0,
    greenHosts: 1,
    compliancePercent: 100,
  },
];

const patchingColumns: TableProps.ColumnDefinition<PatchingHost>[] = [
  { id: 'owner', header: 'Owners', cell: item => item.owner, sortingField: 'owner', isRowHeader: true },
  { id: 'totalHosts', header: 'Total hosts', cell: item => item.totalHosts, sortingField: 'totalHosts' },
  {
    id: 'hostsNotReporting',
    header: 'Hosts not reporting',
    cell: item => (item.hostsNotReporting === 0 ? '-' : item.hostsNotReporting),
  },
  {
    id: 'redHosts',
    header: 'Red hosts',
    cell: item => (item.redHosts === 0 ? '-' : item.redHosts),
  },
  {
    id: 'yellowHosts',
    header: 'Yellow hosts',
    cell: item => (item.yellowHosts === 0 ? '-' : item.yellowHosts),
  },
  {
    id: 'greenHosts',
    header: 'Green hosts',
    cell: item => (item.greenHosts === 0 ? '-' : item.greenHosts),
  },
];

const patchingGroups: TableProps.GroupDefinition<PatchingHost>[] = [
  { id: 'hostsReporting', header: 'Hosts reporting' },
];

const patchingColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  { id: 'owner', visible: true },
  { id: 'totalHosts', visible: true },
  { id: 'hostsNotReporting', visible: true },
  {
    type: 'group',
    id: 'hostsReporting',
    children: [
      { id: 'redHosts', visible: true },
      { id: 'yellowHosts', visible: true },
      { id: 'greenHosts', visible: true },
    ],
  },
];

// ============================================================================
// 2. Supply Chain Forecast Explainability
// 2-3 levels, 3-5 sub-columns per time period, resizing, horizontal scroll,
// sticky header, sticky first column
// ============================================================================

interface ForecastItem {
  ipn: string;
  metric: string;
  apr23snap1: number;
  apr23snap2: number;
  apr23change: string;
  apr30snap1: number;
  apr30snap2: number;
  apr30change: string;
  may7snap1: number;
  may7snap2: number;
  may7change: string;
}

const forecastData: ForecastItem[] = [
  {
    ipn: '100-001853-003',
    metric: 'Net Demand',
    apr23snap1: 40000,
    apr23snap2: 60000,
    apr23change: '+50%',
    apr30snap1: 40000,
    apr30snap2: 60000,
    apr30change: '+50%',
    may7snap1: 40000,
    may7snap2: 60000,
    may7change: '+50%',
  },
  {
    ipn: '100-001853-003',
    metric: 'Currently with ODM',
    apr23snap1: 20000,
    apr23snap2: 20000,
    apr23change: '0%',
    apr30snap1: 20000,
    apr30snap2: 20000,
    apr30change: '0%',
    may7snap1: 20000,
    may7snap2: 20000,
    may7change: '0%',
  },
  {
    ipn: '100-001853-003',
    metric: 'In Transit',
    apr23snap1: 20000,
    apr23snap2: 10000,
    apr23change: '-100%',
    apr30snap1: 20000,
    apr30snap2: 10000,
    apr30change: '-100%',
    may7snap1: 20000,
    may7snap2: 10000,
    may7change: '-100%',
  },
  {
    ipn: '100-001853-003',
    metric: 'Gross Demand',
    apr23snap1: 60000,
    apr23snap2: 90000,
    apr23change: '+50%',
    apr30snap1: 60000,
    apr30snap2: 90000,
    apr30change: '+50%',
    may7snap1: 60000,
    may7snap2: 90000,
    may7change: '+50%',
  },
  {
    ipn: '100-001853-003',
    metric: 'Current RTF',
    apr23snap1: 29405,
    apr23snap2: 29405,
    apr23change: '0%',
    apr30snap1: 29405,
    apr30snap2: 29405,
    apr30change: '0%',
    may7snap1: 29405,
    may7snap2: 29405,
    may7change: '0%',
  },
  {
    ipn: '100-001853-003',
    metric: 'Variance VS RTF',
    apr23snap1: -852,
    apr23snap2: -852,
    apr23change: '0%',
    apr30snap1: -852,
    apr30snap2: -852,
    apr30change: '0%',
    may7snap1: -852,
    may7snap2: -852,
    may7change: '0%',
  },
];

const fmt = (n: number) => n.toLocaleString();

const forecastColumns: TableProps.ColumnDefinition<ForecastItem>[] = [
  { id: 'ipn', header: 'IPN', cell: item => item.ipn, isRowHeader: true },
  { id: 'metric', header: 'Data', cell: item => item.metric },
  { id: 'apr23snap1', header: 'Snapshot day 1', cell: item => fmt(item.apr23snap1) },
  { id: 'apr23snap2', header: 'Snapshot day 2', cell: item => fmt(item.apr23snap2) },
  { id: 'apr23change', header: '% Change', cell: item => item.apr23change },
  { id: 'apr30snap1', header: 'Snapshot day 1', cell: item => fmt(item.apr30snap1) },
  { id: 'apr30snap2', header: 'Snapshot day 2', cell: item => fmt(item.apr30snap2) },
  { id: 'apr30change', header: '% Change', cell: item => item.apr30change },
  { id: 'may7snap1', header: 'Snapshot day 1', cell: item => fmt(item.may7snap1) },
  { id: 'may7snap2', header: 'Snapshot day 2', cell: item => fmt(item.may7snap2) },
  { id: 'may7change', header: '% Change', cell: item => item.may7change },
];

const forecastGroups: TableProps.GroupDefinition<ForecastItem>[] = [
  { id: 'apr23', header: 'April 23' },
  { id: 'apr30', header: 'April 30' },
  { id: 'may7', header: 'May 7' },
];

const forecastColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  { id: 'ipn', visible: true },
  { id: 'metric', visible: true },
  {
    type: 'group',
    id: 'apr23',
    children: [
      { id: 'apr23snap1', visible: true },
      { id: 'apr23snap2', visible: true },
      { id: 'apr23change', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'apr30',
    children: [
      { id: 'apr30snap1', visible: true },
      { id: 'apr30snap2', visible: true },
      { id: 'apr30change', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'may7',
    children: [
      { id: 'may7snap1', visible: true },
      { id: 'may7snap2', visible: true },
      { id: 'may7change', visible: true },
    ],
  },
];

// ============================================================================
// 3. Grocery Management Tech (GMT) — Performance
// 2 levels, 3 sub-columns per metric (current, comparison, diff), sorting, resizing, sticky
// ============================================================================

interface GroceryItem {
  store: string;
  salesCoreRanking: string;
  salesReference: string;
  salesDelta: string;
  salesDeltaPct: string;
  unitsCoreRanking: string;
  unitsReference: string;
  unitsDelta: string;
  unitsDeltaPct: string;
}

const groceryData: GroceryItem[] = [
  {
    store: 'West Orange (WOP)',
    salesCoreRanking: '$1.0M',
    salesReference: '$1.0M',
    salesDelta: '-$9.5K',
    salesDeltaPct: '-0.94%',
    unitsCoreRanking: '145.1K',
    unitsReference: '150.4K',
    unitsDelta: '-5.4K',
    unitsDeltaPct: '-3.58%',
  },
  {
    store: 'Trolley Square (TSQ)',
    salesCoreRanking: '$583.7K',
    salesReference: '$512.6K',
    salesDelta: '+$71.1K',
    salesDeltaPct: '13.87%',
    unitsCoreRanking: '82.1K',
    unitsReference: '75.4K',
    unitsDelta: '+6.7K',
    unitsDeltaPct: '8.96%',
  },
  {
    store: 'Downtown Market (DTM)',
    salesCoreRanking: '$2.1M',
    salesReference: '$1.9M',
    salesDelta: '+$200K',
    salesDeltaPct: '10.5%',
    unitsCoreRanking: '310.2K',
    unitsReference: '295.8K',
    unitsDelta: '+14.4K',
    unitsDeltaPct: '4.87%',
  },
  {
    store: 'Harbor View (HBV)',
    salesCoreRanking: '$750K',
    salesReference: '$780K',
    salesDelta: '-$30K',
    salesDeltaPct: '-3.85%',
    unitsCoreRanking: '98.5K',
    unitsReference: '102.1K',
    unitsDelta: '-3.6K',
    unitsDeltaPct: '-3.53%',
  },
];

const groceryColumns: TableProps.ColumnDefinition<GroceryItem>[] = [
  { id: 'store', header: 'Store', cell: item => item.store, sortingField: 'store', isRowHeader: true },
  { id: 'salesCoreRanking', header: 'Core Ranking - Recommended Assortment', cell: item => item.salesCoreRanking },
  { id: 'salesReference', header: 'Reference Assortment Process', cell: item => item.salesReference },
  { id: 'salesDelta', header: 'Delta', cell: item => item.salesDelta },
  { id: 'salesDeltaPct', header: 'Delta %', cell: item => item.salesDeltaPct },
  { id: 'unitsCoreRanking', header: 'Core Ranking - Recommended Assortment', cell: item => item.unitsCoreRanking },
  { id: 'unitsReference', header: 'Reference Assortment Process', cell: item => item.unitsReference },
  { id: 'unitsDelta', header: 'Delta', cell: item => item.unitsDelta },
  { id: 'unitsDeltaPct', header: 'Delta %', cell: item => item.unitsDeltaPct },
];

const groceryGroups: TableProps.GroupDefinition<GroceryItem>[] = [
  { id: 'sales', header: 'Sales' },
  { id: 'units', header: 'Units' },
];

const groceryColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  { id: 'store', visible: true },
  {
    type: 'group',
    id: 'sales',
    children: [
      { id: 'salesCoreRanking', visible: true },
      { id: 'salesReference', visible: true },
      { id: 'salesDelta', visible: true },
      { id: 'salesDeltaPct', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'units',
    children: [
      { id: 'unitsCoreRanking', visible: true },
      { id: 'unitsReference', visible: true },
      { id: 'unitsDelta', visible: true },
      { id: 'unitsDeltaPct', visible: true },
    ],
  },
];

// ============================================================================
// 4. Infra Supply Chain — Items at Risk
// 2 levels, 3-8 sub-columns, sorting, resizing, sticky columns
// ============================================================================

interface RiskItem {
  priority: number;
  impactedBom: string;
  riskType: string;
  bomItemAtRisk: string;
  materialClass: string;
  internalRackType: string;
  externalRackType: string;
  findNo: number;
  alternateItem: string;
  parentItem: string;
}

const riskData: RiskItem[] = [
  {
    priority: 1,
    impactedBom: '100-019716-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '504-002133-001',
    materialClass: 'CABLE',
    internalRackType: 'PATAGONIA-WEBBER18',
    externalRackType: 'PATAGONIA-WEBBER18',
    findNo: 10,
    alternateItem: '111-019718-001',
    parentItem: '100-019718-001',
  },
  {
    priority: 1,
    impactedBom: '504-002133-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '100-019716-001',
    materialClass: 'CABLE',
    internalRackType: '12.8T-BR',
    externalRackType: '12.8T-BR',
    findNo: 205,
    alternateItem: '111-019718-001',
    parentItem: '111-019718-001',
  },
  {
    priority: 3,
    impactedBom: '504-002133-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '100-019716-001',
    materialClass: 'MOTHERBOARD',
    internalRackType: '3PPS480.1X75.0',
    externalRackType: '3PPS480.1X75.0',
    findNo: 30,
    alternateItem: '111-019718-001',
    parentItem: '111-019718-001',
  },
  {
    priority: 4,
    impactedBom: '504-002133-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '100-019716-001',
    materialClass: 'SHELL',
    internalRackType: 'AWS.NW.VEGETRON',
    externalRackType: 'AWS.NW.VEGETRON',
    findNo: 20,
    alternateItem: '111-019718-001',
    parentItem: '111-019718-001',
  },
  {
    priority: 4,
    impactedBom: '504-002133-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '100-019716-001',
    materialClass: 'CONNECTOR',
    internalRackType: 'AWS.NW.VEGETRON',
    externalRackType: 'AWS.NW.VEGETRON',
    findNo: 50,
    alternateItem: '111-019718-001',
    parentItem: '111-019718-001',
  },
  {
    priority: 5,
    impactedBom: '504-002133-001',
    riskType: 'Multi-source',
    bomItemAtRisk: '100-019716-001',
    materialClass: 'SWITCH PANEL',
    internalRackType: 'BF.BLACKFOOT.15',
    externalRackType: 'BF.BLACKFOOT.15',
    findNo: 20,
    alternateItem: '111-019718-001',
    parentItem: '111-019718-001',
  },
];

const riskColumns: TableProps.ColumnDefinition<RiskItem>[] = [
  { id: 'priority', header: 'Priority', cell: item => item.priority, sortingField: 'priority' },
  { id: 'impactedBom', header: 'Impacted BOM', cell: item => item.impactedBom, sortingField: 'impactedBom' },
  { id: 'riskType', header: 'Risk type', cell: item => item.riskType, sortingField: 'riskType' },
  { id: 'bomItemAtRisk', header: 'BOM item at risk', cell: item => item.bomItemAtRisk, sortingField: 'bomItemAtRisk' },
  { id: 'materialClass', header: 'Material class', cell: item => item.materialClass, sortingField: 'materialClass' },
  {
    id: 'internalRackType',
    header: 'Internal Rack Type',
    cell: item => item.internalRackType,
    sortingField: 'internalRackType',
  },
  {
    id: 'externalRackType',
    header: 'External Rack Type',
    cell: item => item.externalRackType,
    sortingField: 'externalRackType',
  },
  { id: 'findNo', header: 'Find No', cell: item => item.findNo, sortingField: 'findNo' },
  { id: 'alternateItem', header: 'Alternate item', cell: item => item.alternateItem },
  { id: 'parentItem', header: 'Parent item', cell: item => item.parentItem },
];

const riskGroups: TableProps.GroupDefinition<RiskItem>[] = [
  { id: 'itemAtRisk', header: 'Item at risk' },
  { id: 'suggestedAlternate', header: 'Suggested alternate' },
];

const riskColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  {
    type: 'group',
    id: 'itemAtRisk',
    children: [
      { id: 'priority', visible: true },
      { id: 'impactedBom', visible: true },
      { id: 'riskType', visible: true },
      { id: 'bomItemAtRisk', visible: true },
      { id: 'materialClass', visible: true },
      { id: 'internalRackType', visible: true },
      { id: 'externalRackType', visible: true },
      { id: 'findNo', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'suggestedAlternate',
    children: [
      { id: 'alternateItem', visible: true },
      { id: 'parentItem', visible: true },
    ],
  },
];

// ============================================================================
// 5. AWS WWCO — ML Product Cost
// 2 levels, 3 sub-columns, sorting
// ============================================================================

interface MLCostItem {
  product: string;
  onDemandCost: string;
  reservedCost: string;
  spotCost: string;
}

const mlCostData: MLCostItem[] = [
  { product: 'SageMaker Training', onDemandCost: '$12,450.00', reservedCost: '$8,715.00', spotCost: '$3,735.00' },
  { product: 'SageMaker Inference', onDemandCost: '$8,200.00', reservedCost: '$5,740.00', spotCost: '$2,460.00' },
  { product: 'Bedrock Foundation Models', onDemandCost: '$15,800.00', reservedCost: '$11,060.00', spotCost: 'N/A' },
  { product: 'Comprehend', onDemandCost: '$3,100.00', reservedCost: '$2,170.00', spotCost: 'N/A' },
  { product: 'Rekognition', onDemandCost: '$5,600.00', reservedCost: '$3,920.00', spotCost: 'N/A' },
];

const mlCostColumns: TableProps.ColumnDefinition<MLCostItem>[] = [
  { id: 'product', header: 'ML Product', cell: item => item.product, sortingField: 'product', isRowHeader: true },
  { id: 'onDemandCost', header: 'On-Demand', cell: item => item.onDemandCost, sortingField: 'onDemandCost' },
  { id: 'reservedCost', header: 'Reserved', cell: item => item.reservedCost, sortingField: 'reservedCost' },
  { id: 'spotCost', header: 'Spot', cell: item => item.spotCost, sortingField: 'spotCost' },
];

const mlCostGroups: TableProps.GroupDefinition<MLCostItem>[] = [{ id: 'cost', header: 'Cost by pricing type' }];

const mlCostColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  { id: 'product', visible: true },
  {
    type: 'group',
    id: 'cost',
    children: [
      { id: 'onDemandCost', visible: true },
      { id: 'reservedCost', visible: true },
      { id: 'spotCost', visible: true },
    ],
  },
];

// ============================================================================
// 6. AWS Region Services — Availability Zones with Partitions
// 2 levels, column visibility
// ============================================================================

interface RegionService {
  service: string;
  usEast1aPartition1: string;
  usEast1aPartition2: string;
  usEast1bPartition1: string;
  usEast1bPartition2: string;
  usEast1cPartition1: string;
  usEast1cPartition2: string;
}

const regionData: RegionService[] = [
  {
    service: 'EC2',
    usEast1aPartition1: 'Available',
    usEast1aPartition2: 'Available',
    usEast1bPartition1: 'Available',
    usEast1bPartition2: 'Available',
    usEast1cPartition1: 'Available',
    usEast1cPartition2: 'Available',
  },
  {
    service: 'S3',
    usEast1aPartition1: 'Available',
    usEast1aPartition2: 'Available',
    usEast1bPartition1: 'Available',
    usEast1bPartition2: 'Degraded',
    usEast1cPartition1: 'Available',
    usEast1cPartition2: 'Available',
  },
  {
    service: 'RDS',
    usEast1aPartition1: 'Available',
    usEast1aPartition2: 'Unavailable',
    usEast1bPartition1: 'Available',
    usEast1bPartition2: 'Available',
    usEast1cPartition1: 'Degraded',
    usEast1cPartition2: 'Available',
  },
  {
    service: 'Lambda',
    usEast1aPartition1: 'Available',
    usEast1aPartition2: 'Available',
    usEast1bPartition1: 'Available',
    usEast1bPartition2: 'Available',
    usEast1cPartition1: 'Available',
    usEast1cPartition2: 'Available',
  },
  {
    service: 'DynamoDB',
    usEast1aPartition1: 'Available',
    usEast1aPartition2: 'Available',
    usEast1bPartition1: 'Degraded',
    usEast1bPartition2: 'Available',
    usEast1cPartition1: 'Available',
    usEast1cPartition2: 'Available',
  },
];

function StatusCell({ status }: { status: string }) {
  const type = status === 'Available' ? 'success' : status === 'Degraded' ? 'warning' : 'error';
  return <StatusIndicator type={type}>{status}</StatusIndicator>;
}

const regionColumns: TableProps.ColumnDefinition<RegionService>[] = [
  { id: 'service', header: 'Service', cell: item => item.service, isRowHeader: true },
  { id: 'usEast1aP1', header: 'Partition 1', cell: item => <StatusCell status={item.usEast1aPartition1} /> },
  { id: 'usEast1aP2', header: 'Partition 2', cell: item => <StatusCell status={item.usEast1aPartition2} /> },
  { id: 'usEast1bP1', header: 'Partition 1', cell: item => <StatusCell status={item.usEast1bPartition1} /> },
  { id: 'usEast1bP2', header: 'Partition 2', cell: item => <StatusCell status={item.usEast1bPartition2} /> },
  { id: 'usEast1cP1', header: 'Partition 1', cell: item => <StatusCell status={item.usEast1cPartition1} /> },
  { id: 'usEast1cP2', header: 'Partition 2', cell: item => <StatusCell status={item.usEast1cPartition2} /> },
];

const regionGroups: TableProps.GroupDefinition<RegionService>[] = [
  { id: 'usEast1a', header: 'us-east-1a' },
  { id: 'usEast1b', header: 'us-east-1b' },
  { id: 'usEast1c', header: 'us-east-1c' },
];

const regionColumnDisplay: TableProps.ColumnDisplayProperties[] = [
  { id: 'service', visible: true },
  {
    type: 'group',
    id: 'usEast1a',
    children: [
      { id: 'usEast1aP1', visible: true },
      { id: 'usEast1aP2', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'usEast1b',
    children: [
      { id: 'usEast1bP1', visible: true },
      { id: 'usEast1bP2', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'usEast1c',
    children: [
      { id: 'usEast1cP1', visible: true },
      { id: 'usEast1cP2', visible: true },
    ],
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function CustomerPagesDemo() {
  const {
    urlParams: { resizable = true, firstSticky = 1, lastSticky = 0, customGap = false, gap = 0 },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const tableWrapperStyle: React.CSSProperties = customGap
    ? ({ '--awsui-table-resizer-block-gap': `${gap}px` } as React.CSSProperties)
    : {};

  const stickyColumns = { first: +firstSticky, last: +lastSticky };

  return (
    <SimplePage title="Column Grouping Customer Use Cases" i18n={{}} screenshotArea={{}}>
      <SpaceBetween size="xxl">
        <SpaceBetween size="m" direction="horizontal" alignItems="end">
          <Toggle onChange={({ detail }) => setUrlParams({ resizable: detail.checked })} checked={resizable}>
            Resizable
          </Toggle>
          <FormField label="Sticky First">
            <Input
              ariaLabel="First sticky column count"
              onChange={({ detail }) => setUrlParams({ firstSticky: +detail.value })}
              value={String(firstSticky)}
              name="first"
              inputMode="numeric"
              type="number"
            />
          </FormField>
          <FormField label="Sticky Last">
            <Input
              ariaLabel="Last sticky column count"
              onChange={({ detail }) => setUrlParams({ lastSticky: +detail.value })}
              value={String(lastSticky)}
              name="last"
              inputMode="numeric"
              type="number"
            />
          </FormField>
          <Toggle onChange={({ detail }) => setUrlParams({ customGap: detail.checked })} checked={customGap}>
            Experiment with resizer gap
          </Toggle>
          {customGap && (
            <FormField label="Resizer gap (px)">
              <Input
                ariaLabel="Resizer block gap in pixels"
                onChange={({ detail }) => setUrlParams({ gap: Math.min(Math.max(0, +detail.value), 25) })}
                value={String(gap)}
                name="gap"
                inputMode="numeric"
                type="number"
              />
            </FormField>
          )}
        </SpaceBetween>

        {/* 1. Patching Findings Summary */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={patchingColumns}
            groupDefinitions={patchingGroups}
            columnDisplay={patchingColumnDisplay}
            items={patchingData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            sortingDisabled={false}
            enableKeyboardNavigation={true}
            header={
              <Header
                variant="h2"
                description="All OS Patching findings grouped by hosts not reporting, hosts out of SLA (Red), hosts within SLA (Yellow) and green hosts."
              >
                Patching findings summary
              </Header>
            }
          />
        </div>

        {/* 2. Supply Chain Forecast Explainability */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={forecastColumns}
            groupDefinitions={forecastGroups}
            columnDisplay={forecastColumnDisplay}
            items={forecastData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            enableKeyboardNavigation={true}
            header={
              <Header variant="h2" description="Supply Chain forecast metrics across weekly time periods.">
                Forecast Explainability
              </Header>
            }
          />
        </div>

        {/* 3. Grocery Management — Performance */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={groceryColumns}
            groupDefinitions={groceryGroups}
            columnDisplay={groceryColumnDisplay}
            items={groceryData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            sortingDisabled={false}
            enableKeyboardNavigation={true}
            header={
              <Header variant="h2" description="Metrics with current, comparison and diff sub-columns.">
                Performance
              </Header>
            }
          />
        </div>

        {/* 4. Infra Supply Chain — Items at Risk */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={riskColumns}
            groupDefinitions={riskGroups}
            columnDisplay={riskColumnDisplay}
            items={riskData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            sortingDisabled={false}
            enableKeyboardNavigation={true}
            header={
              <Header variant="h2" description="Items at risk with sub-categories and suggested alternates.">
                Items at Risk
              </Header>
            }
          />
        </div>

        {/* 5. AWS WWCO — ML Product Cost */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={mlCostColumns}
            groupDefinitions={mlCostGroups}
            columnDisplay={mlCostColumnDisplay}
            items={mlCostData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            sortingDisabled={false}
            enableKeyboardNavigation={true}
            header={
              <Header variant="h2" description="Cost of different pricing types for ML products.">
                ML Product Costs
              </Header>
            }
          />
        </div>

        {/* 6. AWS Region Services */}
        <div style={tableWrapperStyle}>
          <Table
            variant="stacked"
            columnDefinitions={regionColumns}
            groupDefinitions={regionGroups}
            columnDisplay={regionColumnDisplay}
            items={regionData}
            resizableColumns={resizable}
            stickyColumns={stickyColumns}
            enableKeyboardNavigation={true}
            header={
              <Header variant="h2" description="Availability zones with partition-level service status.">
                AWS Region Services
              </Header>
            }
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
