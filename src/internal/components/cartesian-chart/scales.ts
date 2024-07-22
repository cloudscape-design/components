// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  ScaleBand,
  scaleBand,
  ScaleContinuousNumeric,
  scaleLinear,
  scaleLog,
  ScaleTime,
  scaleTime,
} from '../../vendor/d3-scale';
import { ChartDataTypes, ChartDomain, ScaleRange, ScaleType } from './interfaces';

export interface NumericD3Scale {
  type: 'numeric';
  scale: ScaleContinuousNumeric<number, number>;
}

export interface TimeD3Scale {
  type: 'time';
  scale: ScaleTime<number, number>;
}

export interface CategoricalD3Scale {
  type: 'categorical';
  scale: ScaleBand<ChartDataTypes>;
}

export type D3Scale = NumericD3Scale | TimeD3Scale | CategoricalD3Scale;

type InternalScale = ScaleContinuousNumeric<number, number> | ScaleBand<ChartDataTypes> | ScaleTime<number, number>;

function isNumericDomain(domain: ChartDomain<ChartDataTypes>): domain is number[] {
  return domain.length > 0 && typeof domain[0] === 'number';
}

function isDateDomain(domain: ChartDomain<ChartDataTypes>): domain is Date[] {
  return domain.length > 0 && domain[0] instanceof Date;
}

function createNumericScale(type: ScaleType, domain: ChartDomain<ChartDataTypes>) {
  let scale: ScaleContinuousNumeric<number, number>;
  switch (type) {
    case 'log':
      scale = scaleLog();
      break;
    default:
      scale = scaleLinear();
  }

  if (isNumericDomain(domain)) {
    scale.domain(domain);
  }

  return scale;
}

function createTimeScale(domain: ChartDomain<ChartDataTypes>) {
  const scale = scaleTime();
  if (isDateDomain(domain)) {
    scale.domain(domain);
  }
  return scale;
}

function createBandScale(domain: ChartDomain<ChartDataTypes>) {
  const scale = scaleBand<ChartDataTypes>().padding(0.1);
  scale.domain(domain);
  return scale;
}

export function createScale(type: ScaleType, domain: ChartDomain<ChartDataTypes>, range: ScaleRange): D3Scale {
  switch (type) {
    case 'linear':
    case 'log':
      return { type: 'numeric', scale: createNumericScale(type, domain).range(range) };

    case 'time':
      return { type: 'time', scale: createTimeScale(domain).range(range) };

    case 'categorical':
      return { type: 'categorical', scale: createBandScale(domain).range(range) };
  }
}

export class ChartScale {
  public readonly scale: D3Scale;
  public readonly d3Scale: InternalScale;

  constructor(
    public readonly scaleType: ScaleType,
    public readonly domain: ChartDomain<ChartDataTypes>,
    public readonly range: ScaleRange,
    noCategoricalOuterPadding = false
  ) {
    this.scale = createScale(this.scaleType, this.domain, this.range);
    this.d3Scale = this.scale.scale;

    if (this.isCategorical()) {
      if (noCategoricalOuterPadding) {
        // Categorical charts with only line (or threshold) series don't need as much out padding
        // compared to a bar series. Increasing the inner padding to push more data points to the outside.
        this.d3Scale.paddingInner(0.7);
        this.d3Scale.paddingOuter(0);
      } else {
        this.d3Scale.paddingInner(0.2);
        this.d3Scale.paddingOuter(0.05);
      }
    }
  }

  cloneScale(newScaleType?: ScaleType, newDomain?: ChartDomain<ChartDataTypes>, newRange?: ScaleRange) {
    return new ChartScale(newScaleType || this.scaleType, newDomain || this.domain, newRange || this.range);
  }

  isNumeric(): this is { d3Scale: ScaleContinuousNumeric<number, number>; domain: ChartDomain<number> } {
    return this.scale.type === 'numeric';
  }

  isTime(): this is { d3Scale: ScaleTime<number, number>; domain: ChartDomain<Date> } {
    return this.scale.type === 'time';
  }

  isCategorical(): this is { d3Scale: ScaleBand<ChartDataTypes>; domain: ChartDomain<string> } {
    return this.scale.type === 'categorical';
  }
}

export class NumericChartScale {
  public readonly scale: NumericD3Scale;
  public readonly d3Scale: ScaleContinuousNumeric<number, number>;

  constructor(
    public readonly scaleType: 'linear' | 'log',
    domain: ChartDomain<number>,
    range: ScaleRange,
    adjustDomain: null | number
  ) {
    const scale = createNumericScale(scaleType, domain).range(range);
    if (adjustDomain !== null) {
      scale.nice(adjustDomain);
    }
    this.scale = { type: 'numeric', scale };
    this.d3Scale = this.scale.scale;
  }

  isCategorical() {
    return false;
  }
}
