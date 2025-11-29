const sequelize = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

const fixMemberPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const user = await User.findOne({ where: { studentId: 'MEM001' } });
        if (!user) {
            console.log('User not found');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        user.password = hashedPassword;
        await user.save();

        console.log('Password updated for MEM001');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixMemberPassword();
