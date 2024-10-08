import { replace, times, get, flatten, find } from "lodash";
import slugify from "slugify";
import * as client from "../../utils/client";
import { fetchPages, deserializePage } from "../pages";
import { required } from "../../utils/params";
import { baseUrl, imageUrl, parseText } from "../../utils/justgiving";
import { deserializeTotals, getMonetaryValue } from "../../utils/totals";
import { encodeBase64String } from "../../utils/base64";

export const teamNameRegex = /[^\w\s'"!?£$€¥.,-]/gi;

export const deserializeTeam = (team) => {
  const members = get(team, "membership.members", []);
  const membersFitness = get(team, "fitness.pages", []);

  return {
    active: team.status ? team.status.toUpperCase() === "ACTIVE" : false,
    campaign: get(team, "campaign.title"),
    campaignId: get(team, "campaign.campaignGuid") || get(team, "campaignGuid"),
    charity: get(team, "charity.name"),
    charityId: get(team, "charity.charityId"),
    event: team.eventId,
    fitnessDistanceTotal: get(team, "fitness.totalAmount", 0),
    fitnessDurationTotal: get(team, "fitness.totalAmountTaken", 0),
    id: team.teamGuid,
    image: imageUrl(team.coverPhotoImageId || team.coverImageName),
    leader: [
      get(team, "captain.firstName"),
      get(team, "captain.lastName"),
    ].join(" "),
    members: members.map((member) => {
      const page = deserializePage(member);
      const pageFitness = find(membersFitness, (p) => p.ID === page.uuid) || {};
      const teamMember = {
        donationUrl: `${baseUrl("www")}/${
          member.fundraisingPageShortName
        }/donate`,
        image: member.profileImage,
        name: `${member.fundraisingPageName}`,
        url: `${baseUrl()}/${member.fundraisingPageShortName}`,
      };

      return {
        ...page,
        ...teamMember,
        fitnessDistanceTotal: pageFitness.TotalValue || 0,
      };
    }),
    name: team.title || team.name,
    owner: get(team, "captain.userGuid"),
    pages: members.map((page) => page.fundraisingPageGuid || page.pageGuid),
    raised: get(team, "donationSummary.totalAmount"),
    slug: team.shortName && team.shortName,
    story: team.story && parseText(team.story),
    target: get(team, "fundraisingConfiguration.targetAmount"),
    url:
      team.shortName &&
      `${baseUrl()}/team/${team.shortName.replace("team/", "")}`,
    uuid: team.teamGuid,
  };
};

export const deserializeTeamPage = (page) => {
  const currencyCode = get(page, "targetWithCurrency.currencyCode");
  const totals = deserializeTotals(
    get(page, "totals.timeline", []),
    currencyCode
  );

  return {
    ...totals,
    active: page.status === "ACTIVE",
    createdAt: page.createDate,
    currencyCode,
    donationUrl: `${baseUrl("www")}/fundraising/${page.slug}/donate`,
    id: page.eventGivingGroupId,
    image: get(page, "cover.url")
      ? `${get(page, "cover.url")}?template=Size186x186Crop`
      : "https://assets.blackbaud-sites.com/images/supporticon/user.svg",
    name: page.title,
    owner: get(page, "owner.name"),
    raised: getMonetaryValue(get(page, "donationSummary.totalAmount")),
    slug: page.slug,
    status: page.status.toLowerCase(),
    subtitle: get(page, "owner.name"),
    story: page.story,
    target: getMonetaryValue(page.targetWithCurrency),
    totalDonations: get(page, "donationSummary.numberOfDonations"),
    url: page.url,
    type: "individual",
    uuid: page.legacyId,
  };
};

export const searchTeams = ({ campaign, endCursor, limit }) => {
  const params = {
    take: limit,
    nextPageToken: endCursor,
  };

  return client.servicesAPI
    .get(`/v1/campaign/${campaign}/teams`, { params })
    .then(({ data }) => data)
    .then((res) => {
      const formattedTeams = res.results.map((team) => ({
        ...team,
        shortName: team.slug,
      }));
      return { results: formattedTeams, pageInfo: res.pagination };
    });
};

const recursivelyFetchTeams = ({
  campaign,
  limit,
  endCursor,
  results = [],
}) => {
  return searchTeams({ campaign, endCursor, limit }).then((data) => {
    const updatedResults = [...results, ...data.results];
    if (data.pageInfo.hasNextPage) {
      return recursivelyFetchTeams({
        campaign,
        limit,
        endCursor: data.pageInfo.endCursor,
        results: updatedResults,
      });
    } else {
      return updatedResults;
    }
  });
};

export const fetchTeams = (options = required()) => {
  const { allTeams, campaign = required(), limit = 25 } = options;
  const campaigns = Array.isArray(campaign) ? campaign : campaign.split(",");

  return Promise.all(
    campaigns.map((campaign) =>
      allTeams
        ? recursivelyFetchTeams({ campaign, limit })
        : searchTeams({ campaign, limit }).then((data) => data.results)
    )
  ).then(flatten);
};

export const fetchTeam = (id = required(), options) => {
  const query = `query getTeamSlugById ($id: ID) {
    page(type: TEAM, id: $id) {
      slug
    }
  }`;

  return client.servicesAPI
    .post("/v1/justgiving/graphql", { query, variables: { id } })
    .then((res) => res.data)
    .then((data) => {
      const { slug } = data.data.page;
      return fetchTeamBySlug(slug, undefined);
    });
};

const getPaginatedMembers = (team) => {
  return new Promise((resolve) => {
    if (team.membership.members?.length < team.membership.numberOfMembers) {
      return client.servicesAPI
        .get(`/v1/team/${replace(team.shortName, "team/", "")}`, {
          params: { nextPageKey: team.pagination.endCursor },
        })
        .then(({ data }) => data)
        .then((res) => {
          const updatedTeam = {
            ...team,
            membership: {
              ...team.membership,
              members: [...team.membership.members, ...res.membership.members],
            },
            pagination: {
              ...res.pagination,
            },
          };

          return resolve(getPaginatedMembers(updatedTeam));
        });
    }

    return resolve(team);
  });
};

export const fetchTeamBySlug = (slug, options = {}) => {
  return client.servicesAPI
    .get(`/v1/team/${replace(slug, "team/", "")}`)
    .then(({ data }) => data)
    .then((team) => {
      if (options.includeFitness) {
        return fetchTeamFitness(team.teamGuid, options.fitnessParams).then(
          (fitness) => ({ ...team, fitness })
        );
      }

      return team;
    })
    .then((team) => {
      if (options.includePages && team.membership.members?.length) {
        return getPaginatedMembers(team).then((updatedTeam) => {
          if (options.includeFullPages) {
            const ids = updatedTeam.membership.members.map(
              (p) => p.fundraisingPageGuid
            );
            return fetchPages({ allPages: true, ids }).then((members) => {
              return Promise.resolve({
                ...updatedTeam,
                membership: { ...updatedTeam.membership, members },
              });
            });
          }

          return Promise.resolve({
            ...updatedTeam,
          });
        });
      }

      return Promise.resolve(team);
    });
};

export const fetchTeamFitness = (slug, options = {}) => {
  const params = {
    limit: options.fitnesslimit || 100,
    start: options.startDate,
    end: options.endDate,
  };

  return client.servicesAPI
    .get(`v1/fitness/team/${slug}`, { params })
    .then(({ data }) => data);
};

export const fetchTeamPages = (slug, options = {}) => {
  const limit = options.limit || 250;

  const query = `
    query fetchTeamPages ($slug: Slug, $after: String) {
      page(type: TEAM, slug: $slug) {
        title
        id
        legacyId
        type
        membershipPolicy
        relationships {
          members (first: 10, after: $after) {
            totalCount
            nodes {
              createDate
              eventGivingGroupId
              legacyId
              slug
              status
              story
              title
              url
              owner {
                name
                legacyId
              }
              donationSummary {
                donationCount
                offlineAmount {
                  value
                  currencyCode
                }
                totalAmount {
                  value
                  currencyCode
                }
              }
              targetWithCurrency {
                value
                currencyCode
              }
              totals {
                timeline {
                  measurementDomain
                  amounts {
                    value
                    unit
                  }
                }
              }
              cover {
                ... on ImageMedia {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  return client.servicesAPI
    .post("/v1/justgiving/graphql", { query, variables: { slug } })
    .then((response) => get(response.data, "data.page.relationships.members"))
    .then((data) => {
      if (data.totalCount > 10) {
        // The maximum page size supported by this query is 10, so we're
        // generating a base64 encoded integer for page cursors up to the
        // total number of pages within the team (or a hard upper limit).
        // N.B. The cursor is zero-based, hence for 10-20 the cursor is 9.
        const pageCursors = times(
          Math.ceil(Math.min(data.totalCount, limit) / 10) - 1,
          (integer) => encodeBase64String(integer * 10 + 9)
        );

        return Promise.all(
          pageCursors.map((after) =>
            client.servicesAPI
              .post("/v1/justgiving/graphql", {
                query,
                variables: { slug, after },
              })
              .then((response) =>
                get(response.data, "data.page.relationships.members")
              )
              .then((data) => data.nodes)
          )
        ).then((pages) => flatten([data.nodes, ...pages]));
      }

      return data.nodes;
    });
};

export const checkTeamSlugAvailable = (slug = required()) => {
  return client.servicesAPI
    .get(`/v1/team/${slug}/suggest`)
    .then((res) => {
      if (res.status === 200) return appendIdToSlug(slug);
    })
    .catch(() => {
      return slug;
    });
};

// Take an existing slug
// Trim it down it size so it does not exceed to limit of 50
// Append a small generated unique id
const appendIdToSlug = (slug) => {
  const trimmedSlug = slug.slice(0, 43);
  const randomId = Math.random().toString(36).slice(-6);

  return `${trimmedSlug}-${randomId}`;
};

export const createTeam = (params) => {
  const {
    authType = "Bearer",
    name = required(),
    campaignId = required(),
    story = required(),
    captainSlug = required(),
    coverPhotoId,
    slug,
    target = 1000,
    targetCurrency = "GBP",
    teamType = "Open",
    token = required(),
  } = params;

  if (authType === "Basic") {
    throw new Error("Teams does not support basic authentication");
  }

  const payload = {
    Name: name.replace(/’/g, "'").replace(teamNameRegex, "").substring(0, 255),
    Story: story,
    TargetCurrency: targetCurrency,
    TeamShortName: slug || slugify(params.name, { lower: true, strict: true }),
    TeamTarget: target,
    TeamType: teamType,
    CampaignGuid: campaignId,
    CaptainPageShortName: captainSlug,
    CoverPhotoId: coverPhotoId,
  };

  const options = {
    headers: {
      Authorization: `${authType} ${token}`,
    },
  };

  return checkTeamSlugAvailable(payload.TeamShortName, { authType, token })
    .then((cleanShortName) =>
      client.servicesAPI.put(
        "/v1/team",
        { ...payload, TeamShortName: cleanShortName },
        options
      )
    )
    .then(({ data }) => data)
    .then((res) =>
      res.errorMessage ? Promise.reject(new Error(res.errorMessage)) : res
    )
    .then((res) => fetchTeam(res.teamGuid));
};

export const joinTeam = ({
  authType = "Bearer",
  pageId,
  pageSlug = required(),
  teamId,
  teamSlug = required(),
  token = required(),
}) => {
  if (authType === "Basic") {
    throw new Error("Teams does not support basic authentication");
  }

  const payload = {
    pageId,
    pageSlug,
    teamId,
    teamSlug,
  };

  const options = {
    headers: {
      Authorization: `${authType} ${token}`,
    },
  };

  return client.servicesAPI
    .post("/v1/justgiving/teams/join", payload, options)
    .then((response) => response.data);
};

export const leaveTeam = ({
  authType = "Bearer",
  pageSlug = required(),
  teamSlug = required(),
  token = required(),
}) => {
  if (authType === "Basic") {
    throw new Error("Teams does not support basic authentication");
  }

  const options = {
    headers: {
      Authorization: `${authType} ${token}`,
    },
  };

  return client.servicesAPI
    .post("/v1/justgiving/teams/leave", { pageSlug, teamSlug }, options)
    .then((response) => response.data);
};

export const updateTeam = (
  id = required(),
  {
    name = required(),
    token = required(),
    currency = "GBP",
    image,
    target,
    story,
  }
) => {
  const headers = { Authorization: `Bearer ${token}` };

  const payload = {
    teamGuid: id,
    coverPhotoId: image,
    currency,
    name: name.replace(teamNameRegex, "").substring(0, 255),
    story,
    targetAmount: target,
  };

  return client.servicesAPI
    .put(`/v1/team/${id}`, payload, { headers })
    .then(({ data }) => data);
};

export const fetchTeamsToFilter = (campaignGuid, endCursor, results = []) => {
  return fetchTeamsByCampaign(campaignGuid, endCursor).then((data) => {
    const updatedResults = [...results, ...data.results];
    if (data.pageInfo.hasNextPage) {
      return fetchTeamsToFilter(
        campaignGuid,
        data.pageInfo.endCursor,
        updatedResults
      );
    } else {
      return updatedResults;
    }
  });
};

const fetchTeamsByCampaign = (campaignGuid, endCursor) => {
  const payload = {
    nextPageToken: endCursor,
  };

  return client.servicesAPI
    .get(`/v1/campaign/${campaignGuid}/teams`, payload)
    .then(({ data }) => data)
    .then((res) => ({ results: res.results, pageInfo: res.pagination }))
    .catch((err) => console.error(err));
};
