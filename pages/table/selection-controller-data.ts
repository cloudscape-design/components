// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type FunctionRuntime = 'Node.js 22.x' | 'Node.js 20.x' | 'Python 3.13' | 'Python 3.9' | 'Java 21' | 'Go 1.x';
export type PackageType = 'Zip' | 'Image';
export type FunctionType = 'Standard' | 'Edge';

export interface LambdaFunction {
  name: string;
  description: string;
  packageType: PackageType;
  runtime: FunctionRuntime;
  type: FunctionType;
  lastModified: string;
}

export const allFunctions: LambdaFunction[] = [
  {
    name: 'PipelineWebsiteFallbackde-CustomCrossRegionExportW-X6JwH8BLHWUF',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '59 minutes ago',
  },
  {
    name: 'PipelineCloudformationLog-CustomCrossRegionExportR-ZdYplOmIB5oy',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '55 minutes ago',
  },
  {
    name: 'PipelineCertsdevrefreshDE-CustomCrossRegionExportW-HbANvB1Wu6wq',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '60 minutes ago',
  },
  {
    name: 'PipelineCertsdevcoreCE42E-CustomCrossRegionExportW-PsS8Wpw9X38p',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '59 minutes ago',
  },
  {
    name: 'PipelineWebsiteFallbackde-CustomCrossRegionExportW-ZFfCIzbCgpEx',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '59 minutes ago',
  },
  {
    name: 'PipelineCloudformationLog-CustomCrossRegionExportR-l0V0g3Gws3fl',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '51 minutes ago',
  },
  {
    name: 'PipelineCertsdevexternal1-CustomCrossRegionExportW-E7fpgzyT9l4V',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '1 hour ago',
  },
  {
    name: 'PipelineCloudformationLog-CustomCrossRegionExportR-n8HdHqjDgbN7',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '52 minutes ago',
  },
  {
    name: 'PipelineWebsiteFallbackde-CustomCrossRegionExportW-H06gmzu73vqO',
    description: '-',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Standard',
    lastModified: '1 hour ago',
  },
  {
    name: 'DevScreenshotTestingSite-ScreenshotTestingSiteGene-7ULlVLcCWla4',
    description: 'Copies the static resources from one spot to another',
    packageType: 'Zip',
    runtime: 'Python 3.9',
    type: 'Standard',
    lastModified: '4 hours ago',
  },
  {
    name: 'PipelineWebsiteFallbackde-CustomCDKBucketDeploymen-onuB2t8k3yAI',
    description: '-',
    packageType: 'Zip',
    runtime: 'Python 3.13',
    type: 'Standard',
    lastModified: '59 minutes ago',
  },
  {
    name: 'PipelineWebsiteFallbackde-CustomCDKBucketDeploymen-1oAvAlypJFhu',
    description: '-',
    packageType: 'Zip',
    runtime: 'Python 3.13',
    type: 'Standard',
    lastModified: '1 hour ago',
  },
  {
    name: 'AuthServiceStack-UserPoolTriggerHandler-a9Bx2kLm',
    description: 'Handles Cognito user pool triggers',
    packageType: 'Zip',
    runtime: 'Node.js 20.x',
    type: 'Standard',
    lastModified: '2 hours ago',
  },
  {
    name: 'DataProcessingPipeline-TransformFunction-Qw3rTy8z',
    description: 'Transforms incoming data records',
    packageType: 'Zip',
    runtime: 'Java 21',
    type: 'Standard',
    lastModified: '3 hours ago',
  },
  {
    name: 'ApiGatewayStack-AuthorizerFunction-Mn4pLk9x',
    description: 'Custom API Gateway authorizer',
    packageType: 'Zip',
    runtime: 'Node.js 22.x',
    type: 'Edge',
    lastModified: '5 hours ago',
  },
  {
    name: 'MonitoringStack-AlarmHandlerFunction-Yz7wVb2c',
    description: 'Processes CloudWatch alarm notifications',
    packageType: 'Zip',
    runtime: 'Python 3.13',
    type: 'Standard',
    lastModified: '1 day ago',
  },
  {
    name: 'ImageProcessingStack-ThumbnailGenerator-Hj6kRt5n',
    description: 'Generates thumbnails for uploaded images',
    packageType: 'Image',
    runtime: 'Python 3.13',
    type: 'Standard',
    lastModified: '2 days ago',
  },
  {
    name: 'NotificationService-EmailSenderFunction-Wx8mNp3q',
    description: 'Sends transactional email notifications',
    packageType: 'Zip',
    runtime: 'Node.js 20.x',
    type: 'Standard',
    lastModified: '6 hours ago',
  },
  {
    name: 'ScheduledTasksStack-DailyCleanupFunction-Bc4vFg7j',
    description: 'Runs daily cleanup of expired resources',
    packageType: 'Zip',
    runtime: 'Go 1.x',
    type: 'Standard',
    lastModified: '12 hours ago',
  },
];
