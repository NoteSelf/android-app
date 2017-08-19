/*\
title: $:/plugins/noteself/android/sidebar
type: application/javascript
module-type: widget

Android sidebar widget.
It will render it's content as a sidebar menu.
It should only exist one instance. If more than one is rendered, they will do nothing

@preserve

\*/

/*jslint node: true, browser: true */
/*global $tw: false */

'use strict';

const Widget = require('$:/core/modules/widgets/widget.js').widget;

let menu = null;
let panel = null;
let pageWrapper = null;

class Sidebar extends Widget {

    constructor(parseTreeNode, options) {
        super();
        this.initialise(parseTreeNode, options);
    }

    /*
        Render this widget into the DOM
    */
    render(parent, nextSibling) {

        const Slideout = require('$:/plugins/noteself/android/slideout');
        // Compute attributes and execute state
        this.computeAttributes();
        this.execute();

        if (!menu || !panel) {
            //We only allow one instance of this widget, so if the domNodes exist already we do not render it again
            console.info('Sidebar already existing!!');

            // Dom nodes
            pageWrapper = this.document.getElementsByClassName('tc-page-container-wrapper')[0];
            panel = this.document.getElementsByClassName('tc-page-container')[0];
            menu = this.document.createElement('div');
            // Insert element
            pageWrapper.appendChild(menu);
            this.domNodes.push(menu);
            var slideout = new Slideout({
                panel,
                menu,
                'padding': 256,
                'tolerance': 70
            });

            $NS.menu = $NS.menu || slideout;

        }
        this.renderChildren(menu, null);

    }

    execute() {
        // Get attributes
        //this["class"] = this.getAttribute("class","");
        // Make child widgets
        this.makeChildWidgets();
    }

    /*
    * Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
    */
    refresh(changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        /*
        if (changedAttributes["class"]) {
            this.refreshSelf();
            return true;
        } */
        return this.refreshChildren(changedTiddlers);
    };


}

exports.sidebar = Sidebar;
