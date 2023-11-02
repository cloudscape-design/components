// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ButtonWrapper from '../button';
import styles from '../../../internal/components/chart-popover/styles.selectors.js';
import popoverStyles from '../../../popover/styles.selectors.js';
import chartSeriesDetails from '../../../internal/components/chart-series-details/styles.selectors.js';

export class ChartPopoverSeriesItemWrapper extends ComponentWrapper {
  findKey(): ElementWrapper | null {
    return this.findByClassName(chartSeriesDetails.key);
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(chartSeriesDetails.value);
  }
}

export class ChartPopoverSeriesWrapper extends ChartPopoverSeriesItemWrapper {
  findSubItems(): Array<ChartPopoverSeriesItemWrapper> {
    return this.findAll(`.${chartSeriesDetails['inner-list-item']}`).map(
      wrapper => new ChartPopoverSeriesItemWrapper(wrapper.getElement())
    );
  }
}

export default class ChartPopoverWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.content);
  }

  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${popoverStyles['dismiss-control']}`, ButtonWrapper);
  }

  findSeries(): ChartPopoverSeriesWrapper[] | null {
    return this.findAll(`.${chartSeriesDetails['list-item']}`).map(
      wrapper => new ChartPopoverSeriesWrapper(wrapper.getElement())
    );
  }
}
