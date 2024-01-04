// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Link, TutorialPanelProps, Box } from '~components';

const tutorials = (showToolsPanel: () => void) =>
  [
    {
      id: 1,
      title: 'Transcribe audio',
      description: (
        <>
          <Box variant="p" color="text-body-secondary" padding={{ top: 'n' }}>
            In this tutorial you will learn how to:
          </Box>
          <Box variant="span" color="text-body-secondary">
            <ul>
              <li>Transcribe an audio file from Amazon S3 to text</li>
              <li>View the transcribed text</li>
            </ul>
          </Box>
        </>
      ),
      completedScreenDescription: 'You now know how to store and retrieve a file in Amazon S3.',
      completed: false,
      prerequisitesAlert: 'You need to create an S3 bucket before you can start this tutorial.',
      prerequisitesNeeded: false,
      learnMoreUrl: 'https://aws.amazon.com/getting-started/hands-on/backup-files-to-amazon-s3/',
      tasks: [
        {
          title: 'Create a bucket',
          steps: [
            {
              title: 'Name the bucket',
              content: (
                <>
                  Create a bucket name. Bucket names can consist only of lowercase letters, numbers, dots (.), and
                  hyphens(-).{' '}
                  <Link variant="info" onFollow={showToolsPanel}>
                    Info
                  </Link>
                </>
              ),
              hotspotId: 'bucket-name',
            },
            {
              title: 'Second step for the first hotspot',
              content: 'This is a step that points to the same hotspot as the previous step.',
              hotspotId: 'bucket-name',
            },
            {
              title: 'Choose a region',
              content: 'Choose the Region closest to your geographical location.',
              hotspotId: 'region-selector',
            },
            {
              title: 'Block all public access',
              content: 'Keep this checkbox selected to prevent unauthorized access to your bucket.',
              hotspotId: 'block-public-access-checkbox',
              warningAlert:
                'Selecting a different value for this checkbox from the recommendation of the tutorial can result in your data being exposed to unauthorized access.',
            },
          ],
        },
        {
          title: 'Upload an object to the bucket',
          steps: [
            {
              title: 'Read this hotspot',
              content: 'This second hotspot is used before the first (in code-order) hotspot on this page.',
              hotspotId: 'second-hotspot-on-page',
            },
            {
              title: 'Add a file',
              content: 'Go into the details page of your newly created bucket by clicking its name.',
              hotspotId: 'demo-bucket-link',
            },
          ],
        },
        {
          title: 'View information about your object',
          steps: [
            {
              title: 'View object information',
              content: 'View the information about the file that you just uploaded.',
              hotspotId: 'view-object-information',
            },
            {
              title: 'Second step for the final hotspot',
              content: 'This is a step that points to the same hotspot as the previous step.',
              hotspotId: 'view-object-information',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Second tutorial',
      description:
        'In this tutorial you will learn how to:\n- Create a bucket\n- Upload an object to the bucket\n- View and download your object',
      completedScreenDescription: 'You now know how to store and retrieve a file in Amazon S3.',
      completed: false,
      tasks: [],
      prerequisitesAlert: 'You need to create an S3 bucket before you can start this tutorial.',
      prerequisitesNeeded: true,
    },
  ] as Array<TutorialPanelProps.Tutorial & { id: number }>;
export default tutorials;
