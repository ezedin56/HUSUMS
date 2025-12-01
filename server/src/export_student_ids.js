const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./models/User');

async function exportStudentIds() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');

        const users = await User.find({}, 'studentId firstName lastName email role');

        let output = '========================================\n';
        output += '    ALL STUDENT IDs IN DATABASE\n';
        output += '========================================\n';
        output += `Total users: ${users.length}\n\n`;

        if (users.length === 0) {
            output += 'No users found in database!\n';
        } else {
            users.forEach((user, index) => {
                output += `${index + 1}. Student ID: "${user.studentId}"\n`;
                output += `   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}\n`;
                output += `   Email: ${user.email || 'No email'}\n`;
                output += `   Role: ${user.role}\n`;
                output += `   ---\n`;
            });
        }

        output += '========================================\n';

        // Write to file
        fs.writeFileSync('student_ids_list.txt', output);
        console.log('✅ Student IDs exported to: student_ids_list.txt');
        console.log(output);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

exportStudentIds();
