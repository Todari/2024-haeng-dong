export const BASE_URL = {
  HD: process.env.NODE_ENV === 'development' ? '' : process.env.API_BASE_URL,
  S3: process.env.S3_URL,
};
