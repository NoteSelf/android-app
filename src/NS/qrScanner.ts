let frame: HTMLElement;
let twDocument: HTMLElement;

interface QRScanner {
    prepare: Function
    scan: Function
    show: Function
    hide: Function
    destroy: Function
};

declare const QRScanner: QRScanner;

import { toggleStyle, passThrough } from './utils';

let destroyTimeout = null;

const info = {
    status: {
        prepared: false
    }
};

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

const setStatus = (status) => {
    info.status = status;
    console.info('Status:', status);
    return info.status;
}

const clearDestroy = () => {

    (destroyTimeout != null) && clearTimeout(destroyTimeout);
    destroyTimeout = null;
}

const destroyScanner = () => {

    clearDestroy();
    QRScanner.destroy();
    console.log('Scanner is about to be disabled');
}

const prepareScanner = () => {

    clearDestroy();
    /*     if (info.status.prepared) {
            return Promise.resolve(info.status);
        } */

    return new Promise((resolve, reject) => {

        const done = (err, status) => {

            if (err) {
                return reject(err);
            }

            console.log('QRScanner is initialized');
            resolve(setStatus(status));
        };

        QRScanner.prepare(done);
    });
}

const hideScanner = (any) => {

    destroyTimeout = setTimeout(destroyScanner, 30000);
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
    info,
    /* toggleScanner, */
    scan() {
        return prepareScanner()
            .then(scan)
    }
};