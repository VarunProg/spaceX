import { Request, Response } from "express";
import axios from "axios";

export const getLaunches = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const find: any = {};

    const query = `
      query ExampleQuery( $limit: Int) {
        launches( limit: $limit) {
          id
          details
          launch_success
          launch_date_utc
          launch_year
          upcoming
          mission_name
          rocket {
            rocket_name
          }
          links {
            flickr_images
            wikipedia
            video_link
            reddit_media
          }
        }
      }
    `;

    const { data } = await axios.post(
      "https://main--spacex-l4uc6p.apollographos.net/graphql",
      {
        query,
        variables: { limit },
      }
    );
    const launches = data.data ? data.data.launches : [];
    res.json(launches);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUpcomingLaunches = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const find: any = {};

    const query = `
      query ExampleQuery {
        launchesUpcoming {
          id
          details
          launch_success
          launch_date_utc
          launch_year
          upcoming
          mission_name
          rocket {
            rocket_name
          }
          links {
            flickr_images
            wikipedia
            video_link
            reddit_media
          }
        }
      }
    `;

    const { data } = await axios.post(
      "https://main--spacex-l4uc6p.apollographos.net/graphql",
      {
        query,
        variables: { limit },
      }
    );
    const launchesUpcoming = data.data ? data.data.launchesUpcoming : [];
    res.json(launchesUpcoming);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getPreviousLaunches = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const query = `
      query ExampleQuery( $limit: Int) {
        launchesPast( limit: $limit) {
          id
          details
          launch_success
          launch_date_utc
          launch_year
          upcoming
          mission_name
          rocket {
            rocket_name
          }
          links {
            flickr_images
            wikipedia
            video_link
            reddit_media
          }
        }
      }
    `;

    const { data } = await axios.post(
      "https://main--spacex-l4uc6p.apollographos.net/graphql",
      {
        query,
        variables: { limit },
      }
    );

    // Log the full response
    console.log("GraphQL response:", data);

    // Check for null or undefined launches property
    const pastLaunches = data.data ? data.data.launchesPast : [];
    res.json(pastLaunches);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
