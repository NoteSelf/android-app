    // Application Constructor
    // Require TW boot engine and notify it that we are on a browser environment
    var tw = Object.create(null);
    tw.boot = tw.boot || Object.create(null);
    tw.boot.suppressBoot = true
    tw.browser = Object.create(null);
    tw.node = null;
    
    const {TiddlyWiki:tw_boot} = require('./boot');
    const {bootprefix:tw_bootprefix} = require('./bootprefix');

    export default tw_boot(tw_bootprefix(tw));