import axios from "axios";
import { API_ENDPOINT } from "../utils/constant";

export const fetchLaunches = async (limit: number, page: number) => {
  try {
    const params = { limit, offset: (page - 1) * limit };
    const response = await axios.get(`${API_ENDPOINT}launches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching SpaceX data', error);
    throw error;
  }
};

export const fetchUpcomingLaunches = async (limit: number, page: number) => {
  try {
    const params = { limit, offset: (page - 1) * limit };
    const response = await axios.get(`${API_ENDPOINT}upcomingLaunches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const fetchPreviousLaunches = async (limit: number, page: number) => {
  try {
    const params = { limit, offset: (page - 1) * limit };
    const response = await axios.get(`${API_ENDPOINT}previousLaunches`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching SpaceX data', error);
    throw error;
  }
};
