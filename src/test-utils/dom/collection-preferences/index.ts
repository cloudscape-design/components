// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button/index.js';
import CheckboxWrapper from '../checkbox/index.js';
import ModalWrapper from '../modal/index.js';
import ContentDisplayPreferenceWrapper from './content-display-preference.js';
import PageSizePreferenceWrapper from './page-size-preference.js';
import StickyColumnsPreferenceWrapper from './sticky-columns-preference.js';
import VisibleContentPreferenceWrapper from './visible-content-preference.js';

import styles from '../../../collection-preferences/styles.selectors.js';

class PreferencesModalWrapper extends ModalWrapper {
  static rootSelector = styles['modal-root'];

  findCancelButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['cancel-button']}`, ButtonWrapper);
  }

  findConfirmButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['confirm-button']}`, ButtonWrapper);
  }

  findWrapLinesPreference(): CheckboxWrapper | null {
    return this.findComponent(`.${styles['wrap-lines']}`, CheckboxWrapper);
  }

  findStripedRowsPreference(): CheckboxWrapper | null {
    return this.findComponent(`.${styles['striped-rows']}`, CheckboxWrapper);
  }

  findContentDensityPreference(): CheckboxWrapper | null {
    return this.findComponent(`.${styles['content-density']}`, CheckboxWrapper);
  }

  findPageSizePreference(): PageSizePreferenceWrapper | null {
    return this.findComponent(`.${PageSizePreferenceWrapper.rootSelector}`, PageSizePreferenceWrapper);
  }

  findVisibleContentPreference(): VisibleContentPreferenceWrapper | null {
    return this.findComponent(`.${VisibleContentPreferenceWrapper.rootSelector}`, VisibleContentPreferenceWrapper);
  }

  findStickyColumnsPreference(firstOrLast: 'first' | 'last' = 'first'): StickyColumnsPreferenceWrapper | null {
    const rootSelector = firstOrLast === 'first' ? 'firstRootSelector' : 'lastRootSelector';
    return this.findComponent(`.${StickyColumnsPreferenceWrapper[rootSelector]}`, StickyColumnsPreferenceWrapper);
  }

  findContentDisplayPreference(): ContentDisplayPreferenceWrapper | null {
    return this.findComponent(`.${ContentDisplayPreferenceWrapper.rootSelector}`, ContentDisplayPreferenceWrapper);
  }

  findCustomPreference(): ElementWrapper | null {
    return this.findByClassName(styles.custom);
  }

  findContentBefore(): ElementWrapper | null {
    return this.findByClassName(styles['content-before']);
  }
}

export default class CollectionPreferencesWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findModal(): PreferencesModalWrapper | null {
    return createWrapper().findComponent(`.${styles['modal-root']}`, PreferencesModalWrapper);
  }

  findTriggerButton(): ButtonWrapper {
    return this.findComponent(`.${styles['trigger-button']}`, ButtonWrapper)!;
  }
}
