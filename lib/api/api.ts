import axios from 'axios';

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_NEXT_URL}/api`,
  withCredentials: true,
});
