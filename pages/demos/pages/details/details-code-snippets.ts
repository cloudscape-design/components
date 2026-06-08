// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DistributionConfig>
   <Aliases>
      <Quantity>1</Quantity>
      <Items>
         <CNAME>example.com</CNAME>
      </Items>
   </Aliases>
   <DefaultCacheBehavior>
      <Compress>true</Compress>
      <DefaultTTL>3600</DefaultTTL>
   </DefaultCacheBehavior>
   <Enabled>true</Enabled>
   <Origins>
      <Quantity>1</Quantity>
      <Items>
         <Origin>
            <DomainName>S3-aws-phoenix.example.com</DomainName>
         </Origin>
      </Items>
   </Origins>
</DistributionConfig>`;

const json = `{
  "DistributionConfig": {
    "Aliases": {
      "Quantity": 1,
      "Items": [
        {
          "CNAME": "example.com"
        }
      ]
    },
    "DefaultCacheBehavior": {
      "Compress": true,
      "DefaultTTL": 3600
    },
    "Enabled": true,
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Origin": {
            "DomainName": "S3-aws-phoenix.example.com"
          }
        }
      ]
    }
  }
}`;

const yaml = `DistributionConfig:
  Aliases:
    Quantity: 1
    Items:
      - CNAME: example.com
  DefaultCacheBehavior:
    Compress: true
    DefaultTTL: 3600
  Enabled: true
  Origins:
    Quantity: 1
    Items:
      - Origin:
          DomainName: S3-aws-phoenix.example.com`;

export const codeSnippets = {
  json,
  yaml,
  xml,
};
