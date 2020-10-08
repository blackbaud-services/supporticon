export const singleCampaign = {
  status: 200,
  response: {
    campaign: {
      fitness_activity_overview: {
        bike: { duration_in_seconds: 10, calories: 10, distance_in_meters: 10 },
        gym: { duration_in_seconds: 20, calories: 20, distance_in_meters: 20 },
        hike: { duration_in_seconds: 30, calories: 30, distance_in_meters: 30 },
        run: { duration_in_seconds: 40, calories: 40, distance_in_meters: 40 },
        sport: { duration_in_seconds: 5, calories: 5, distance_in_meters: 5 },
        swim: { duration_in_seconds: 60, calories: 60, distance_in_meters: 60 },
        walk: { duration_in_seconds: 75, calories: 75, distance_in_meters: 75 }
      }
    }
  }
}

export const singleJGCampaign = {
  status: 200,
  response: {
    data: {
      totals: [
        {
          measurementDomain: 'any:distance',
          amounts: [
            {
              value: 328.084,
              unit: 'feet'
            },
            {
              value: 100,
              unit: 'meters'
            },
            {
              value: 0.0621371,
              unit: 'miles'
            },
            {
              value: 0.1,
              unit: 'kilometers'
            }
          ]
        },
        {
          measurementDomain: 'any:elevation_gain',
          amounts: [
            {
              value: 328.084,
              unit: 'feet'
            },
            {
              value: 100,
              unit: 'meters'
            },
            {
              value: 0.0621371,
              unit: 'miles'
            },
            {
              value: 0.1,
              unit: 'kilometers'
            }
          ]
        },
        {
          measurementDomain: 'any:elapsed_time',
          amounts: [
            {
              value: 60,
              unit: 'seconds'
            },
            {
              value: 0.00069444444,
              unit: 'days'
            },
            {
              value: 0.01666666667,
              unit: 'hours'
            }
          ]
        }
      ]
    }
  }
}

export const multipleCampaigns = {
  status: 200,
  response: {
    campaigns: [
      {
        fitness_activity_overview: {
          bike: {
            duration_in_seconds: 10,
            calories: 10,
            distance_in_meters: 10
          },
          gym: {
            duration_in_seconds: 20,
            calories: 20,
            distance_in_meters: 20
          },
          hike: {
            duration_in_seconds: 30,
            calories: 30,
            distance_in_meters: 30
          },
          run: {
            duration_in_seconds: 40,
            calories: 40,
            distance_in_meters: 40
          },
          sport: { duration_in_seconds: 5, calories: 5, distance_in_meters: 5 },
          swim: {
            duration_in_seconds: 60,
            calories: 60,
            distance_in_meters: 60
          },
          walk: {
            duration_in_seconds: 75,
            calories: 75,
            distance_in_meters: 75
          }
        }
      },
      {
        fitness_activity_overview: {
          bike: {
            duration_in_seconds: 10,
            calories: 10,
            distance_in_meters: 10
          },
          run: {
            duration_in_seconds: 40,
            calories: 40,
            distance_in_meters: 40
          },
          walk: {
            duration_in_seconds: 75,
            calories: 75,
            distance_in_meters: 75
          }
        }
      }
    ]
  }
}
