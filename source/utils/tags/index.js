export const getPrimaryUnit = (measurementDomain) => {
  if (measurementDomain.indexOf("activities") > -1) {
    return "count";
  }

  if (
    [
      "fundraising:donations_made",
      "fundraising:offline_donations_count",
    ].indexOf(measurementDomain) > -1
  ) {
    return "count";
  }

  if (measurementDomain.indexOf("donations") > -1) {
    return "gbp";
  }

  if (measurementDomain.indexOf("elapsed_time") > -1) {
    return "seconds";
  }

  return "meters";
};

export const formatMeasurementDomain = (sortBy) => {
  switch (sortBy) {
    case "raised":
      return "donations_received";
    case "offline":
      return "offline_donations";
    case "donations":
      return "donations_made";
    case "duration":
      return "elapsed_time";
    case "elevation":
      return "elevation_gain";
    default:
      return sortBy;
  }
};

export const fundraisingDomains = [
  "fundraising:donations_received",
  "fundraising:donations_made",
  "fundraising:offline_donations",
  "fundraising:offline_donations_count",
];

export const fitnessDomains = [
  "any:activities",
  "any:distance",
  "any:elapsed_time",
  "any:elevation_gain",
  "hike:activities",
  "hike:distance",
  "hike:elapsed_time",
  "hike:elevation_gain",
  "ride:activities",
  "ride:distance",
  "ride:elapsed_time",
  "ride:elevation_gain",
  "swim:activities",
  "swim:distance",
  "swim:elapsed_time",
  "swim:elevation_gain",
  "walk:activities",
  "walk:distance",
  "walk:elapsed_time",
  "walk:elevation_gain",
];

export const measurementDomains = [...fundraisingDomains, ...fitnessDomains];

export const defaultPageTags = (page, timeBox, campaignGuidOverride) => {
  const tags = [
    {
      tagDefinition: {
        id: "page:totals",
        label: "Page Totals",
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains: ["all"],
          segment: "page:totals",
          timeBox,
        },
      ],
    },
    {
      tagDefinition: {
        id: "CommsFitness",
        label: "CommsFitness",
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains,
          segment: "AllCommsFitness",
        },
        ...(timeBox
          ? [
              {
                measurementDomains,
                segment: "BeforeEventCommsFitness",
                timeBox: {
                  notAfter: timeBox.notBefore,
                },
              },
              {
                measurementDomains,
                segment: "DuringEventCommsFitness",
                timeBox,
              },
              {
                measurementDomains,
                segment: "AfterEventCommsFitness",
                timeBox: {
                  notBefore: timeBox.notAfter,
                },
              },
            ]
          : []),
      ],
    },
    {
      tagDefinition: {
        id: "page:charity",
        label: "Charity Link",
      },
      value: `page:charity:${page.charityId}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:charity:${page.charityId}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:charity:${page.charityId}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:charity:${page.charityId}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: `page:charity:${page.charityId}`,
        label: "Page Charity Link",
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:charity:${page.charityId}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:charity:${page.charityId}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:charity:${page.charityId}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: "page:event",
        label: "Event Link",
      },
      value: `page:event:${page.event}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:event:${page.event}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:event:${page.event}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:event:${page.event}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: `page:event:${page.event}`,
        label: "Page Event Link",
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:event:${page.event}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:event:${page.event}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:event:${page.event}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: "eventId",
        label: "Event Id",
      },
      value: page.event,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:event:${page.event}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:event:${page.event}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:event:${page.event}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: "charityId",
        label: "Charity Id",
      },
      value: page.charityId,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:charity:${page.charityId}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:charity:${page.charityId}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:charity:${page.charityId}:all`,
        },
      ],
    },
  ];

  const campaignTags = [
    {
      tagDefinition: {
        id: "campaignGuid",
        label: "Campaign Guid",
      },
      value: page.campaign,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:campaign:${page.campaign}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:campaign:${page.campaign}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:campaign:${page.campaign}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: "page:campaign",
        label: "Campaign Link",
      },
      value: `page:campaign:${page.campaign}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:campaign:${page.campaign}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:campaign:${page.campaign}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:campaign:${page.campaign}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        id: "page:campaign:charity",
        label: "Charity Campaign Link",
      },
      value: `page:campaign:${page.campaign}:charity:${page.charityId}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        label: "Page Campaign Link",
        id: campaignGuidOverride || `page:campaign:${page.campaign}`,
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: campaignGuidOverride || `page:campaign:${page.campaign}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: campaignGuidOverride || `page:campaign:${page.campaign}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: campaignGuidOverride
            ? `${campaignGuidOverride}:all`
            : `page:campaign:${page.campaign}:all`,
        },
      ],
    },
    {
      tagDefinition: {
        label: "Page Charity Campaign Link",
        id: `page:campaign:${page.campaign}:charity:${page.charityId}`,
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [
        {
          measurementDomains: fundraisingDomains,
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}`,
        },
        {
          measurementDomains: fitnessDomains,
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}`,
          timeBox,
        },
        {
          measurementDomains: ["all"],
          segment: `page:campaign:${page.campaign}:charity:${page.charityId}:all`,
        },
      ],
    },
  ];

  return page.campaign ? campaignTags.concat(tags) : tags;
};
