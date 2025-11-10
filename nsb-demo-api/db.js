const sql = require('mssql');
const hasInstance = !!process.env.SQL_INSTANCE;

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: hasInstance ? undefined : parseInt(process.env.SQL_PORT || '1433', 10),
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_CERT === 'true',
    instanceName: hasInstance ? process.env.SQL_INSTANCE : undefined,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let poolPromise;
function getPool(){ if(!poolPromise) poolPromise = sql.connect(config); return poolPromise; }
module.exports = { sql, getPool };
