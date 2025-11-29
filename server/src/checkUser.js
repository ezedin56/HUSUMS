const { User } = require('./models');
const sequelize = require('./config/database');

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { studentId: 'NEW001' } });
        console.log('User found:', user ? user.toJSON() : 'Not found');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
