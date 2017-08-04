/*\
title: $:/plugins/noteself/android/startup/qr-scan-event-listener.js
type: application/javascript
module-type: startup

This is an startup module. Please put here a comment about what it does and why.
For more info just visit:  http://tiddlywiki.com/dev/#StartupMechanism

@preserve

\*/


/*jslint node: true, browser: true */
/*global $tw: false */


// Export name and synchronous status
exports.name = 'android-qr-scan-event-listener';
/*
You MUST export at least one startup order, so uncomment at least one
Usually you want to run your module after the startup module
but that varies depending on your intentions. choose wisely...
*/
// exports.before = ["startup"];
exports.after = ['startup'];
// Allowed options are browser, node or both
exports.platforms = ['browser'];
// If you are doing asyncrhonous tasks change this to false
exports.synchronous = true;



/**
 * @module config-startup
 */
exports.startup = function () {

    const scannerVisbileTitle = '$:/temp/noteself/android/qr-scanner-visible';
    const tiddler = $tw.wiki.getTiddler(scannerVisbileTitle);

    const showScanner = () => {

        $tw.wiki.addTiddler(new $tw.Tiddler(tiddler, { tags: ['$:/tags/Stylesheet'] }));
    };

    const hideScanner = () => {

        $tw.wiki.addTiddler(new $tw.Tiddler(tiddler, { tags: [] }));
    };


    $tw.rootWidget.addEventListener('ns-qr-scan', () => {
        if (!$NS || !window.$NS) {
            return alert('Sorry, this functionality is not available on this platform.');
        }
        showScanner();
        $NS.qr
            .scan()
            .then((scanned) => {

                hideScanner();
                $tw.wiki.addTiddler({ title: 'scanned', text: scanned });
            })
            .catch(hideScanner);
    });
};
