const sequelize = require('./config/database');
const { User, Candidate, Election, Vote, Department, Message } = require('./models');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync with alter: true to update schema without dropping tables
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully (Schema updated)');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

syncDatabase();
