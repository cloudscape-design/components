// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export default [
  {
    group: 'AppLayout',
    name: 'Basic',
    code: `
        <AppLayout
          navigation={
            <SideNavigation
              header={{ text: "Playroom" }}
              items={[{ type: "link", text: "Home", href: "#" }]}
            />
          }
          content={<Box>Here is some content!</Box>}
        />
      `,
  },
  {
    group: 'Alert',
    name: 'info',
    code: `
    <Alert
        statusIconAriaLabel="Info"
        header="Known issues/limitations"
      >
        Review the documentation to learn about potential
        compatibility issues with specific database
        versions.
      </Alert>
      `,
  },
  {
    group: 'Alert',
    name: 'Dismissable success',
    code: `
    <Alert
        dismissAriaLabel="Close alert"
        dismissible
        statusIconAriaLabel="Success"
        type="success"
      >
        Your instance has been created successfully.
      </Alert>
      `,
  },
  {
    group: 'Badge',
    name: 'Blue',
    code: `
      <Badge color="blue">52430</Badge>
      `,
  },
  {
    group: 'Badge',
    name: 'Red',
    code: `
      <Badge color="red">52430</Badge>
      `,
  },
  {
    group: 'Breadcrumb Group',
    name: 'Default',
    code: `
    <BreadcrumbGroup
      items={[
        { text: "System", href: "#" },
        { text: "Components", href: "#components" },
        {
          text: "Breadcrumb group",
          href: "#components/breadcrumb-group"
        }
      ]}
      ariaLabel="Breadcrumbs"
    />
      `,
  },
  {
    group: 'Button',
    name: 'Primary',
    code: `
        <Button variant="primary">
          Button
        </Button>
      `,
  },
  {
    group: 'Button Dropdown',
    name: 'Default',
    code: `
    <ButtonDropdown
    items={[
      { text: "Delete", id: "rm", disabled: false },
      { text: "Move", id: "mv", disabled: false },
      { text: "Rename", id: "rn", disabled: true },
      {
        text: "View metrics",
        href: "https://example.com",
        external: true,
        externalIconAriaLabel: "(opens in new tab)"
      }
    ]}
  >
    Short
  </ButtonDropdown>
  `,
  },
  {
    group: 'Chart',
    name: 'Bar Chart',
    code: `
    <BarChart
      series={[
        {
          title: "Site 1",
          type: "bar",
          data: [
            { x: new Date(1601103600000), y: 34503 },
            { x: new Date(1601110800000), y: 25832 },
            { x: new Date(1601118000000), y: 4012 },
            { x: new Date(1601125200000), y: -5602 },
            { x: new Date(1601132400000), y: 17839 }
          ],
          valueFormatter: e =>
            "$" + e.toLocaleString("en-US")
        },
        {
          title: "Average revenue",
          type: "threshold",
          y: 19104,
          valueFormatter: e =>
            "$" + e.toLocaleString("en-US")
        }
      ]}
      xDomain={[
        new Date(1601103600000),
        new Date(1601110800000),
        new Date(1601118000000),
        new Date(1601125200000),
        new Date(1601132400000)
      ]}
      yDomain={[-10000, 40000]}
      i18nStrings={{
        filterLabel: "Filter displayed data",
        filterPlaceholder: "Filter data",
        filterSelectedAriaLabel: "selected",
        detailPopoverDismissAriaLabel: "Dismiss",
        legendAriaLabel: "Legend",
        chartAriaRoleDescription: "line chart",
        xTickFormatter: e =>
          e
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: !1
            })
            .split(",")
            .join(""),
        yTickFormatter: function o(e) {
          return Math.abs(e) >= 1e9
            ? (e / 1e9).toFixed(1).replace(/.0$/, "") +
                "G"
            : Math.abs(e) >= 1e6
            ? (e / 1e6).toFixed(1).replace(/.0$/, "") +
              "M"
            : Math.abs(e) >= 1e3
            ? (e / 1e3).toFixed(1).replace(/.0$/, "") +
              "K"
            : e.toFixed(2);
        }
      }}
      ariaLabel="Single data series line chart"
      errorText="Error loading data."
      height={300}
      loadingText="Loading chart"
      recoveryText="Retry"
      xScaleType="categorical"
      xTitle="Time (UTC)"
      yTitle="Revenue (USD)"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />
    `,
  },
  {
    group: 'Chart',
    name: 'Pie chart',
    code: `
    <PieChart
      data={[
        {
          title: "Running",
          value: 60,
          lastUpdate: "Dec 7, 2020"
        },
        {
          title: "Failed",
          value: 30,
          lastUpdate: "Dec 6, 2020"
        },
        {
          title: "In-progress",
          value: 10,
          lastUpdate: "Dec 6, 2020"
        },
        {
          title: "Pending",
          value: 0,
          lastUpdate: "Dec 7, 2020"
        }
      ]}
      detailPopoverContent={(datum, sum) => [
        { key: "Resource count", value: datum.value },
        {
          key: "Percentage",
          value: \`\${((datum.value / sum) * 100).toFixed(
            0
          )}%\`
        },
        { key: "Last update on", value: datum.lastUpdate }
      ]}
      segmentDescription={(datum, sum) =>
        \`\${datum.value} units, \${(
          (datum.value / sum) *
          100
        ).toFixed(0)}%\`
      }
      i18nStrings={{
        detailsValue: "Value",
        detailsPercentage: "Percentage",
        filterLabel: "Filter displayed data",
        filterPlaceholder: "Filter data",
        filterSelectedAriaLabel: "selected",
        detailPopoverDismissAriaLabel: "Dismiss",
        legendAriaLabel: "Legend",
        chartAriaRoleDescription: "pie chart",
        segmentAriaRoleDescription: "segment"
      }}
      ariaDescription="Pie chart showing how many resources are currently in which state."
      ariaLabel="Pie chart"
      errorText="Error loading data."
      loadingText="Loading chart"
      recoveryText="Retry"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />`,
  },

  // etc...
];
