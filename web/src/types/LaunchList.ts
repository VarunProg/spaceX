export interface Rocket {
    rocket_name: string;
    rocket_type: string;
    description: string;
    country: string;
    type: string;
    name: string;
  }
  
  export interface Launch {
    mission_name: string;
    launch_year: string;
    launch_date_local: string;
    launch_date_utc: string;
    id: string;
    details: string;
    rocket: {
      rocket_name: string;
      rocket_type: string;
      rocket: Rocket;
    };
    upcoming: boolean;
    launch_success: boolean | null;
    links: {
      wikipedia: string | undefined;
      video_link: string | undefined;
      reddit_media: string | undefined;
      flickr_images: string[];
    };
  }
  export interface FilterState {
    launchStatus: String;
    sort: string;
    limit: number;
  }
  
  export type ILaunch = {
    [key: string]: string;
  };