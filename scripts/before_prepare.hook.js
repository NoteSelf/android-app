module.exports = function (context) {
    console.log(context);
    const fs = require('fs');
    const _ = require('lodash');

    const scheme = 'flowkey';
    const insertIntent = `
        <intent-filter>
            <action android:name="android.intent.action.SEND" />
            <action android:name="android.intent.action.SEND_MULTIPLE" />
            <category android:name="android.intent.category.DEFAULT" />
            <data android:mimeType="*/*" />
        </intent-filter>
    `;
    const manifestPath = context.opts.projectRoot + '/platforms/android/AndroidManifest.xml';
    const androidManifest = fs.readFileSync(manifestPath).toString();
    if (!androidManifest.includes(`android:scheme="${scheme}"`)) {
        const manifestLines = androidManifest.split(/\r?\n/);
        const lineNo = _.findIndex(manifestLines, (line) => line.includes('@string/activity_name'));
        manifestLines.splice(lineNo + 1, 0, insertIntent);
        fs.writeFileSync(manifestPath, manifestLines.join('\n'));
    }
};