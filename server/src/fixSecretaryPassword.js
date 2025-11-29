const sequelize = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

const fixPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const user = await User.findOne({ where: { studentId: 'SEC001' } });
        if (!user) {
            console.log('User not found');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        user.password = hashedPassword;
        await user.save();

        console.log('Password updated for SEC001');

        // Verify immediately
        const isMatch = await bcrypt.compare('123456', user.password);
        console.log('Immediate verification match:', isMatch);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixPassword();
