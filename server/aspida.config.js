require('dotenv').config();

module.exports = {
  input: 'api',
  baseURL: `${process.env.API_ORIGIN ?? ''}${process.env.API_BASE_PATH ?? ''}`,
};
