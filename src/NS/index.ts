import { leftPad, defaultTitle } from './utils';
import qr from './qrScanner';

declare global {
    interface Window {
        plugins: {
            intent: {
                setNewIntentHandler: Function,
                getCordovaIntent: Function
            }
        }
    }
}

export default (tw) => {
    var $NS = {
        qr,
        initialize: function () {
            this.intentHandler();
            return $NS
        },

        defaultTitle: defaultTitle(tw),

        /*intentFile: function (Intent) {

            window.resolveLocalFileSystemURL(Intent.data, gotFile, fail);

            function fail(e) {
                console.log("FileSystem Error");
                console.dir(e);
            }

            function gotFile(fileEntry) {

                fileEntry.file(function (file) {
                    var reader = new FileReader(file);

                    reader.onloadend = function (e) {
                        console.log("Text is: " + this.result);
                        alert('Filea readed:' + this.result);
                    }

                    reader.readAsText();
                });

            }
        },*/
        handleIntent: function (Intent) {
            console.log('Intent received', Intent);
            // With intent you'll do almost everything

            if (Intent.action === "android.intent.action.MAIN") {
                return console.log("The app was opened manually and there's no file to open");
            }
            // if (Intent.hasOwnProperty('data')) {
            //     // Do something with the File
            //     console.log('Intent has data');
            //     this.intentFile(Intent);
            // }

            if (Intent.type !== 'text/plain') {
                return alert('Sorry, only text is allowed at the momment');
            }

            var fields = {
                title: this.defaultTitle(Intent.extras["android.intent.extra.SUBJECT"]),
                text: Intent.extras["android.intent.extra.TEXT"]
            };
            var newTiddler = new tw.Tiddler(tw.wiki.getCreationFields(), tw.wiki.getModificationFields(), fields);

            tw.wiki.addTiddler(newTiddler);
            this.story = this.story || new tw.Story();
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

        }

    }
    return $NS;
}