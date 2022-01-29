const glob = require('glob');
const path = require("path");

module.exports = (dirPath) => {
    const absPath = path.resolve(dirPath)

    glob(absPath + '/*.js', {}, (err, files) => {
        files.map(file => {
            require(file)()
        })
    })
}