import { Request, Response } from "express";
import axios from "axios";

export const getLaunches = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      query ExampleQuery($limit: Int, $offset: Int) {
        launches(limit: $limit, offset: $offset) {
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
        variables: { limit, offset },
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
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      query ExampleQuery($limit: Int, $offset: Int) {
        launchesUpcoming(limit: $limit, offset: $offset) {
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
        variables: { limit, offset },
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
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      query ExampleQuery($limit: Int, $offset: Int) {
        launchesPast(limit: $limit, offset: $offset) {
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
        variables: { limit, offset },
      }
    );
    const pastLaunches = data.data ? data.data.launchesPast : [];
    res.json(pastLaunches);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
