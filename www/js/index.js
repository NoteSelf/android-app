
var $NS = ( function ( ) {

    // Application Constructor
    // Require TW boot engine and notify it that we are on a browser environment
    var tw = window.$tw || Object.create(null);
    tw.boot = tw.boot || Object.create(null);
    tw.boot.suppressBoot = true
    tw.browser = Object.create(null);
    window.$tw = tw;

    /**
     * Add padding zeroes to the left
     */
    function leftPad(num) {

        return ("0" + num).slice(-2)
    }

    /**
     * Create a default title for clips being imported (share with android menu)
     */
    function defaultTitle(title) {

        if (typeof title === 'string' && !!title) {
            return tw
                .wiki
                .generateNewTitle(title);
        }
        var d = new Date();
        return tw
            .wiki
            .generateNewTitle([
                "Clip ", d.getFullYear(),
                leftPad(d.getMonth() + 1),
                leftPad(d.getDate()),
                // leftPad(d.getHours()), leftPad(d.getMinutes()), leftPad(d.getSeconds())
            ].join(""));
    }

var $NS = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    utils: {
        leftPad: leftPad,
        defaultTitle: defaultTitle
    },

    intentFile: function (Intent) {

        window.resolveLocalFileSystemURL(Intent.data , gotFile, fail);

        function fail(e) {
            console.log("FileSystem Error");
            console.dir(e);
        }

        function gotFile(fileEntry) {

            fileEntry.file(function(file) {
                var reader = new FileReader(file);

                reader.onloadend = function(e) {
                    console.log( "Text is: " + this.result );
                    alert( 'Filea readed:' + this.result );
                }

                reader.readAsText();
            });

        }
    },
    handleIntent: function (Intent) {
        console.log('Intent received', Intent);
        // With intent you'll do almost everything

        if (Intent.action === "android.intent.action.MAIN"){
            return console.log("The app was opened manually and there's not file to open");
        }
        if (Intent.hasOwnProperty('data')) {
            // Do something with the File
            console.log('Intent has data');
            this.intentFile(Intent);

        }

        if (Intent.type !== 'text/plain') {

            return alert('Sorry, only text is allowed at the momment');
        }

        var fields = {
            title: defaultTitle(Intent.extras["android.intent.extra.SUBJECT"]),
            text: Intent.extras["android.intent.extra.TEXT"]
        };
        var newTiddler = new tw.Tiddler(tw.wiki.getCreationFields(), tw.wiki.getModificationFields(), fields);

        tw
            .wiki
            .addTiddler(newTiddler);
         this.story =  this.story || new tw.Story();
         this.story.navigateTiddler(fields.title);
    },
    intentHandler: function () {

        var handler = this
            .handleIntent
            .bind(this);
        /* Handle the intent when the app is open
        * If the app is running in the background, this function
        * will handle the opened file
        */
        window
            .plugins
            .intent
            .setNewIntentHandler(handler);
        /**
         * Handle the intent when the app is not open
         * This will be executed only when the app starts or wasn't active
         * in the background
        */
        window
            .plugins
            .intent
            .getCordovaIntent(handler, function () {
                alert("Error: Cannot handle open with file intent");
            });

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are: 'pause', 'resume', etc.
    onDeviceReady: function () {
        'use strict';

        /***** Base TiddlyPouch module creation ****/
        var $TPouch = window.$TPouch || Object.create(null);
        if ($TPouch.supressBoot) {/** Allow external JS to avoid boot */
            return
        }
        $TPouch._configDb = $TPouch._configDb || new PouchDB('__TP_config');
        $TPouch.splashScreen = $TPouch.splashScreen || Object.create(null);
        /*** The version section is automatically updated by build scripts,  Dont delete the below comment */
        $TPouch.VERSION =/***TPOUCH_VER*/'0.19.2-0'/*TPOUCH_VER***/;

        window.$TPouch = $TPouch;

        /** Creates a new message node to be used on the splashScreen*/
        function createSplashMessageNode(message) {

            var h1 = document.createElement("h1");
            h1.setAttribute("data-text", message);
            var text = document.createTextNode(message);
            h1.appendChild(text);
            return h1;
        }

        function createSplashScreen(message) {

            /* This function waits until document.body exists*/
            function tryToAppend(node) {
                if (!document.body) {
                    return setTimeout(tryToAppend.bind(null, node), 1);
                }
                document
                    .body
                    .appendChild(node, document.body.firstChild);
            }

            var splash = document.getElementById('TP_splash_screen');
            if (splash === null) {
                splash = document.createElement("div");
                splash.setAttribute("id", "TP_splash_screen");
                splash.appendChild(createSplashMessageNode(message));
                tryToAppend(splash);
            } else {
                splashMessage(message);
            }

            $TPouch.splashScreen.node = splash;
        }
        /** Hides the splash screen allowing the cool css animation to execute*/
        $TPouch.splashScreen.hide = function hideSplashScreen() {
            /** We first set opacity to 0 to allow the css animations kick in
             * Two seconds later , when animation has finished
             * we set display to none so it does not takes space on the page.
             * Display none can not be animated, that's why we use opacity first.
            */
            $TPouch.splashScreen.node.style.opacity = 0;
            setTimeout(function () {

                $TPouch.splashScreen.node.style.display = "none";
            }, 2000);

        };
        $TPouch.splashScreen.showMessage = function splashMessage(message) {

            var node = $TPouch.splashScreen.node;
            node.replaceChild(createSplashMessageNode(message), node.firstChild)
            node.style.display = "block";
            node.style.opacity = 1;
        };

        /**
         * Checks if the current version on the database is lower than the current version
         * if so, it deletes all the indexes so they can be recreated
         * @param {string} version - The version of TiddlyPouch that the database being updated has
         * @param {PouchDB} db - The actual Pouch database that we are updating
         * @returns {promise} - promise that fulfills when all the indexes have been processed, removed or failed removing
         */
        function updater(version, db) {

            var documentsToRemove = [
                '_design/by_type',
                '_design/skinny_tiddlers',
                '_design/by_plugin_type',
                '_design/filtered_replication',
                '_design/TiddlyPouch',
                '_design/startup_tiddlers'
            ];

            if (version && !(parseInt(version.split('.').join('')) < parseInt($TPouch.VERSION.split('.').join('')))) {
                return Promise.resolve();
            }
            console.log('Starting update process...');
            $TPouch
                .splashScreen
                .showMessage('Updating database');
            return Promise.all(documentsToRemove.map(function (doc) {

                return db
                    .get(doc)
                    .then(function (docu) {
                        console.log('Removing index ', doc);
                        return db.remove(docu)
                    })
                        .catch(console.log.bind(console, 'Error removing ', doc))
                }))
                .then(function () {
                    console.log('Update process complete');
                })
                .catch(alert);
        }

        createSplashScreen('Loading');

        $TPouch
            ._configDb
            .get('configuration') // we read the configuration to know which database shuld be loaded
            .then(function (config) {

                if (!config.selectedDbId) {
                    throw new Error('There is no DB selected, nothing to inject')
                }
                /** Create the default db, it should be wrapped later on the boot proces in a {@link DbStore} */
                $TPouch._db = new PouchDB(config.selectedDbId);
                var oldVer = config.databases[config.selectedDbId].version;
                return updater(oldVer, $TPouch._db).then(function () {/** After the update process, flag the db with latest version */
                    config.databases[config.selectedDbId].version = $TPouch.VERSION;
                    return $TPouch
                        ._configDb
                        .put(config);
                })
            })
            .then(function () {

                return $TPouch
                    ._db
                    .query('startup_tiddlers', {include_docs: true})
            })
            .then(function (all) { //Actual docs are contained in the rows array

                console.log('Injecting ', all.total_rows, ' startup tiddlers into tw');
                var startupTids = all
                    .rows
                    .map(function (row) {

                        return row.doc.fields
                    });
                window.$tw.preloadTiddlers = startupTids;
            })
            .catch(function (reason) { // catch any possible error and continue the chain

                console.log('Something went wrong during plugin injection ', reason);
            })
            .then(function () {
                try {
                    $tw.boot.boot(); // boot when chain completes, even if we got some errors
                    $NS.intentHandler();
                } catch (err) {
                    console.error('Something went wrong booting tiddlywiki ', err);
                    alert(err);
                }

            });

    }
}

    return $NS;
})(Object.create(null));

$NS.initialize();