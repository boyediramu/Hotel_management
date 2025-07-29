const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '242001',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting database setup...');
    
    // Create connection without specifying database
    connection = mysql.createConnection(dbConfig);
    
    // Read and execute schema file
    console.log('📋 Creating database schema...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    await new Promise((resolve, reject) => {
      connection.query(schemaSQL, (error, results) => {
        if (error) {
          console.error('❌ Error creating schema:', error);
          reject(error);
        } else {
          console.log('✅ Database schema created successfully');
          resolve(results);
        }
      });
    });
    
    console.log('✅ Database schema created successfully');
    
    // Verify the setup
    console.log('🔍 Verifying database setup...');
    
    const verificationQueries = [
      'SELECT COUNT(*) as room_count FROM hotel_management.rooms',
      'SELECT COUNT(*) as guest_count FROM hotel_management.guests',
      'SELECT COUNT(*) as booking_count FROM hotel_management.bookings',
      'SELECT COUNT(*) as history_count FROM hotel_management.booking_history',
      'SELECT COUNT(*) as admin_count FROM hotel_management.admin_users'
    ];
    
    for (const query of verificationQueries) {
      await new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
          if (error) {
            console.error('❌ Verification error:', error);
            reject(error);
          } else {
            const tableName = query.split('FROM hotel_management.')[1];
            const count = results[0][Object.keys(results[0])[0]];
            console.log(`✅ ${tableName}: ${count} records`);
            resolve(results);
          }
        });
      });
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('- Database: hotel_management');
    console.log('- Tables: rooms, guests, bookings, booking_history, room_maintenance_log, admin_users');
    console.log('- Ready for dynamic data entry through the application');
    console.log('\n🔐 Admin Credentials:');
    console.log('- Email: admin@gmail.com, Password: 123456');
    console.log('- Email: boyediramu@gmail.com, Password: 242001');
    console.log('\n✅ Database is ready for use!');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
