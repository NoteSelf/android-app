/*\
title: $:/plugins/noteself/android/startup/core-overrider.js
type: application/javascript
module-type: startup

This module has only one purpose: Override default tw tiddlers.
Instead of including the tiddlers on the plugin as shadow tiddlers
we dynamically require them here and remove/add any required functionality

@preserve

\*/


/*jslint node: true, browser: true */
/*global $tw: false */


// Export name and synchronous status
exports.name = 'core-overrider';

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

    //overrideTags('$:/core/ui/PageTemplate/sidebar', []);

};
