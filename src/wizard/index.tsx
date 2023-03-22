// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getExternalProps } from '../internal/utils/external-props';
import { WizardProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalWizard from './internal';
import { useTrackComponentLifecycle, WithContext } from '../internal/context/analytics-context';

export { WizardProps };

function Wizard(props: WizardProps) {
  const baseComponentProps = useBaseComponent('Wizard');
  const externalProps = getExternalProps(props);

  const funnel = (props as any)['data-analytics-funnel'] || props.id || 'csa_funnel'; // Get funnel name from breadcrumb
  useTrackComponentLifecycle({ funnel, componentName: 'Wizard' });

  return (
    <WithContext value={{ componentName: 'Wizard', funnel, funnelType: 'wizard' }}>
      <InternalWizard {...externalProps} {...baseComponentProps} />
    </WithContext>
  );
}

applyDisplayName(Wizard, 'Wizard');

export default Wizard;
