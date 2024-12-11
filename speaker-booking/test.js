const pool = require('./src/models/db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SHOW DATABASES');
        console.log('Databases:', rows);
    } catch (error) {
        console.error('Error querying the database:', error);
    }
}

testConnection();
