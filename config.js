const config = {
  appConfig: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  dbConfig: {
    host: process.env.DB_USER,
    port: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
}
module.exports = config
