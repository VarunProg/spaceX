import axios from "axios";
import { API_ENDPOINT } from "../utils/constant";
// `${API_ENDPOINT}launches`

export const fetchLaunches = async (limit: number) => {
  try {
    const params: any = { limit };

    const response = await axios.get(`${API_ENDPOINT}launches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching SpaceX data', error);
    throw error;
  }
};

export const fetchUpcomingLaunches = async (limit: number) => {
  try {
    const params: any = { limit };
  
    const response = await axios.get(`${API_ENDPOINT}upcomingLaunches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const fetchPreviousLaunches = async (limit: number) => {
  try {
    const params: any = { limit };

    const response = await axios.get(`${API_ENDPOINT}previousLaunches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching SpaceX data', error);
    throw error;
  }
};
