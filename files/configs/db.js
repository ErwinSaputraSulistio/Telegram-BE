const { Pool } = require('pg')
const connectionString = 'postgres://yyhjynincomjoy:595e134dab3aeb1beb3a86757db7d1db1ab262d627fb37c27dd96c17f7fbead0@ec2-52-0-114-209.compute-1.amazonaws.com:5432/d7egltob0tvvi3'

const db = new Pool({
   connectionString,
   ssl: {
      rejectUnauthorized: false
   }
})

module.exports = db