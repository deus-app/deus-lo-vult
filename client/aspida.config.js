require('dotenv').config({ path: '../server/.env' });

module.exports = {
  input: 'api',
  baseURL: `${process.env.API_ORIGIN ?? ''}${process.env.API_BASE_PATH ?? ''}`,
};
