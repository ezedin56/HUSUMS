require('dotenv').config();

console.log('Checking MONGO_URI...');
if (process.env.MONGO_URI) {
    console.log('MONGO_URI is set.');
    console.log('Value starts with:', process.env.MONGO_URI.substring(0, 15) + '...');
    if (process.env.MONGO_URI.includes('mongodb.net')) {
        console.log('Looks like an Atlas URI.');
    } else {
        console.log('Does NOT look like an Atlas URI (missing mongodb.net).');
    }
} else {
    console.log('MONGO_URI is NOT set.');
}
