let frame: HTMLElement;
let twDocument: HTMLElement;

interface QRScanner {
    prepare: Function
    scan: Function
    show: Function,
    hide: Function
};

declare const QRScanner: QRScanner;

import { toggleStyle, passThrough } from './utils';

const getScannerDomNode = (): HTMLElement => {

    if (frame) {
        return frame;
    }
    frame = document.getElementById('ns-qr-scanner');
    return frame;
};

const getTwDomNode = (): HTMLElement => {

    if (twDocument) {
        return twDocument;
    }
    twDocument = document.getElementsByClassName('tc-page-container-wrapper')[0] as HTMLElement;
    return twDocument;
}

const toggleFrame = toggleStyle(getScannerDomNode, 'display', '');

const toggleBackground = toggleStyle(getTwDomNode, 'display', 'none');

const toggleBodyColor = toggleStyle(() => document.body, 'backgroundColor', 'transparent');

const toggleScanner = passThrough((): void => {

    toggleFrame();
    toggleBackground();
    toggleBodyColor();
});


const prepareScanner = () => {

    return new Promise((resolve, reject) => {

        const done = (err, status) => {
            if (err) {
                return reject(err);
            }

            console.log('QRScanner is initialized. Status:');
            console.log(status);
            resolve(status);
        };

        QRScanner.prepare(done);
    });
}

const hideScanner = (any) => {

    QRScanner.hide();
    return any;
}

const scan = () => {

    const promisedScan = new Promise(
        (resolve, reject) => {

            QRScanner.scan((err, text) => {

                if (err) {
                    return reject(err);
                }
                resolve(text);
            });
        });

    QRScanner.show();

    return promisedScan.then(hideScanner);
}

export default {
    toggleScanner,
    scan() {
        return prepareScanner()
            .then(scan)
    }
};