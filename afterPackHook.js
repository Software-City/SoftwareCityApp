'use strict'
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
exports.default = async context => {
    let data = {
        owner: "Davis-Software",
        repo: "SoftwareCityApp",
        provider: "github",
        publishAutoUpdate: true,
        releaseType: "release",
    }
    if(process.platform == "linux") {
        data.updaterCacheDirName = 'softwarecity_app-updater'
        fs.writeFileSync(
            path.join(__dirname, 'dist','linux-unpacked','resources','app-update.yml')
            , yaml.safeDump(data)
            , 'utf8'
        )
    }
}