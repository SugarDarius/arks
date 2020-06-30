const path = require('path');

require('ts-node').register({
    project: path.resolve(__dirname, './tools/gulp/tsconfig.json'),
});
require('./tools/gulp/gulpfile');