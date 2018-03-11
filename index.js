if (process.env.DEV) {
    require('./src/app');
} else {
    require('./lib');
};
