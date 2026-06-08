// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import INSTANCES from '../../resources/ec2-instances';
import { EC2Instance } from '../../resources/types';
import fakeDelay from '../commons/fake-delay';
import useLocationHash from '../delete-with-simple-confirmation/use-location-hash';
import useNotifications from '../delete-with-simple-confirmation/use-notifications';
import { DeleteModal } from './components/delete-modal';
import { InstanceDetailsPage } from './components/instance-details-page';
import { InstancesPage } from './components/instances-page';

const delay = 3000;
const failingInstances = [INSTANCES[0]];

export function App() {
  const [instances, setInstances] = useState(INSTANCES);
  const [selectedItems, setSelectedItems] = useState<EC2Instance[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(true);

  const locationHash = useLocationHash();
  const locationInstance = instances.find(it => it.id === locationHash);
  const { clearFailed, notifications, notifyDeleted, notifyFailed, notifyInProgress } = useNotifications({
    resourceName: 'instance',
  });

  const deletionWillFail = (instance: EC2Instance) => {
    return !!failingInstances.find(item => item.id === instance.id);
  };

  const onDeleteInit = () => setShowDeleteModal(true);
  const onDeleteDiscard = () => setShowDeleteModal(false);
  const onDeleteConfirm = async () => {
    const itemsToDelete = locationInstance ? [locationInstance] : selectedItems;
    const itemsThatWillSucceed = itemsToDelete.filter(item => !deletionWillFail(item));
    const itemsThatWillFail = itemsToDelete.filter(deletionWillFail);
    setSelectedItems([]);
    setShowDeleteModal(false);
    notifyInProgress(itemsToDelete);
    await fakeDelay(delay);
    const deletedIds = new Set(itemsThatWillSucceed.map(({ id }) => id));
    setInstances(instances => instances.filter(({ id }) => !deletedIds.has(id)));
    notifyInProgress(itemsThatWillFail);
    notifyDeleted(itemsThatWillSucceed);
    await fakeDelay(delay / 2);
    notifyFailed(itemsThatWillFail, {
      retry: async instance => {
        notifyInProgress([instance]);
        clearFailed(instance);
        await fakeDelay(delay);
        setInstances(instances => instances.filter(({ id }) => id !== instance.id));
        notifyInProgress([]);
        notifyDeleted([instance]);
      },
    });
    notifyInProgress([]);
  };

  useEffect(() => {
    setSelectedItems([]);
  }, [locationHash]);

  useEffect(() => {
    setSelectedItems(INSTANCES.slice(0, 3));
  }, []);

  return (
    <>
      {locationInstance ? (
        <InstanceDetailsPage instance={locationInstance} onDeleteInit={onDeleteInit} notifications={notifications} />
      ) : (
        <InstancesPage
          instances={instances}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          onDeleteInit={onDeleteInit}
          notifications={notifications}
        />
      )}
      <DeleteModal
        visible={showDeleteModal}
        onDiscard={onDeleteDiscard}
        onDelete={onDeleteConfirm}
        instances={locationInstance ? [locationInstance] : selectedItems}
      />
    </>
  );
}
