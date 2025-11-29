// Test script to verify database and authentication
const sequelize = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connected!');

        console.log('\n🔍 Testing User model...');
        const users = await User.findAll({ limit: 5 });
        console.log(`✅ Found ${users.length} users`);

        console.log('\n🔍 Testing President user...');
        const president = await User.findOne({ where: { studentId: 'PRES001' } });
        if (president) {
            console.log('✅ President found:', president.firstName, president.lastName);
            console.log('   Role:', president.role);
            console.log('   Student ID:', president.studentId);

            // Test password
            const isMatch = await bcrypt.compare('123456', president.password);
            console.log('   Password test:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
        } else {
            console.log('❌ President not found!');
        }

        console.log('\n✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testDatabase();
