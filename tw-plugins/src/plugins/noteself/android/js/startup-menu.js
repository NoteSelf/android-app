/*\
title: $:/plugins/noteself/android/startup/slidemenu.js
type: application/javascript
module-type: startup

Adds hooks to close the menu

@preserve

\*/


/*jslint node: true, browser: true */
/*global $tw: false */


// Export name and synchronous status
exports.name = 'slide-menu';

exports.after = ['startup'];
// Allowed options are browser, node or both
exports.platforms = ['browser'];
// If you are doing asyncrhonous tasks change this to false
exports.synchronous = true;



/**
 * @module config-startup
 */
exports.startup = function () {

    const addTiddler = (original, ...extras) => {

        $tw.wiki.addTiddler(new $tw.Tiddler(original, ...extras));
    };

    const overrideTags = (title, newTags) => {
        addTiddler($tw.wiki.getTiddler(title), newTags)
    };

    $tw.hooks.addHook('th-navigating', (evt) => {

        $NS.menu && $NS.menu.close();
        return evt;
    });

};
