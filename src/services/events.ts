import { Events } from "@/types/events";
import { axiosInstance } from "./api";

export const fetchEventsData = async () => {
  try {
    const response = await axiosInstance.get<Events[]>("events");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEventData = async (id: string) => {
  try {
    const response = await axiosInstance.get<Events>(`events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const newEvent = async (event: Events) => {
  try {
    const response = await axiosInstance.post("events", event);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (event: Events) => {
  try {
    const response = await axiosInstance.put(`events/${event.id}`, event);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
