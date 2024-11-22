// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge, Box, Button, Container, Icon, Link, SpaceBetween } from '~components';

import logo1 from './1.png';
import logo2 from './2.png';
import logo3 from './3.png';
import logo4 from './4.png';
import logo5 from './5.png';
import cardLogo from './image-placeholder.png';

export function generateCarousels() {
  const style = {
    color: 'white',
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    height: 'calc(100% - 30px)',
    alignItems: 'end',
    padding: '30px',
  };

  return [
    {
      content: (
        <div style={style}>
          <SpaceBetween size="s">
            <Box variant="h1" color="inherit">
              Dec. 2–6 | Tune in for free to get all the biggest AWS updates this year
            </Box>
            <div>
              <Link href="#" color="inverted" variant="secondary">
                Find out more <Icon name="arrow-right" />
              </Link>
            </div>
          </SpaceBetween>
        </div>
      ),
      backgroundStyle: `url(${logo1})`,
    },
    {
      content: (
        <div style={style}>
          <SpaceBetween size="s">
            <Box variant="h1" color="inherit">
              Become a cloud app developer in 9 months with AWS Cloud Institute
            </Box>
            <div>
              <Link href="#" color="inverted">
                Enroll today <Icon name="arrow-right" />
              </Link>
            </div>
          </SpaceBetween>
        </div>
      ),
      backgroundStyle: `url(${logo2})`,
    },
    {
      content: (
        <div style={style}>
          <SpaceBetween size="s">
            <Box variant="h1" color="inherit">
              Amazon Q Business: Your generative AI–powered assistant
            </Box>
            <div>
              <Link href="#" color="inverted">
                Explore more <Icon name="arrow-right" />
              </Link>
            </div>
          </SpaceBetween>
        </div>
      ),
      backgroundStyle: `url(${logo3})`,
    },
    {
      content: (
        <div style={style}>
          <SpaceBetween size="s">
            <Box variant="h1" color="inherit">
              Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
            </Box>
            <div>
              <Link href="#" color="inverted">
                Learn more <Icon name="arrow-right" />
              </Link>
            </div>
          </SpaceBetween>
        </div>
      ),
      backgroundStyle: `url(${logo4})`,
    },
    {
      content: (
        <div style={style}>
          <SpaceBetween size="s">
            <Box variant="h1" color="inherit">
              AWS is a Leader in the Gartner Magic Quadrant
            </Box>
            <div>
              <Link href="#" color="inverted">
                Read the report <Icon name="arrow-right" />
              </Link>
            </div>
          </SpaceBetween>
        </div>
      ),
      backgroundStyle: `url(${logo5})`,
    },
  ];
}

function ProductCard({
  title,
  vendor,
  logo,
  category,
  description,
  isNew = false,
}: {
  title: string;
  vendor: string;
  logo: string;
  category: string;
  description: string;
  isNew?: boolean;
}) {
  return (
    <Container fitHeight={true}>
      <img src={logo} alt={`${title} logo`} width="50" height="50" />

      <SpaceBetween direction="vertical" size="s">
        <SpaceBetween direction="vertical" size="xxs">
          <Box variant="h3">
            <Link fontSize="inherit">{title}</Link>
          </Box>

          <Box variant="small">By {vendor}</Box>

          <Box color="text-body-secondary">{category}</Box>

          {isNew && <Badge color="green">New</Badge>}
        </SpaceBetween>

        <Box variant="p">{description}</Box>

        <Button ariaLabel={`Shop now for ${title}`}>Shop now</Button>
      </SpaceBetween>
    </Container>
  );
}

export function generateCardCarousels() {
  return [
    {
      content: (
        <ProductCard
          title="Cloud Data Operating System"
          vendor="Cloud Data"
          logo={cardLogo}
          category="Professional services"
          description="An operating system that is tailored for the cloud. This offering includes a free, full featured 30-day trial."
          isNew={true}
        />
      ),
    },
    {
      content: (
        <ProductCard
          title="Cloud Data Deep Security"
          vendor="Cloud Data"
          logo={cardLogo}
          category="AMI | v20.0.833"
          description="Security built for all your cloud services. Apply rules and policies to your services and make this as strict as necessary."
          isNew={true}
        />
      ),
    },
    {
      content: (
        <ProductCard
          title="Cloud Data Deep Security"
          vendor="Cloud Data"
          logo={cardLogo}
          category="AMI | v20.0.833"
          description="Security built for all your cloud services. Apply rules and policies to your services and make this as strict as necessary."
          isNew={true}
        />
      ),
    },
    {
      content: (
        <ProductCard
          title="Cloud Data Deep Security"
          vendor="Cloud Data"
          logo={cardLogo}
          category="AMI | v20.0.833"
          description="Security built for all your cloud services. Apply rules and policies to your services and make this as strict as necessary."
          isNew={true}
        />
      ),
    },
    {
      content: (
        <ProductCard
          title="Cloud Data Deep Security"
          vendor="Cloud Data"
          logo={cardLogo}
          category="AMI | v20.0.833"
          description="Security built for all your cloud services. Apply rules and policies to your services and make this as strict as necessary."
          isNew={true}
        />
      ),
    },
  ];
}
