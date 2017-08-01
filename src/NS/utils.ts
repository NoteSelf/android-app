import * as Memoize from 'lodash.memoize';
/**
 * Add padding zeroes to the left
 */
export function leftPad(num): string {

    return ("0" + num).slice(-2)
}

export function defaultTitle(tw): Function {
    /**
     * Create a default title for clips being imported (share with android menu)
     */
    return (title: string) => {

        if (typeof title === 'string' && !!title) {
            return tw.wiki.generateNewTitle(title);
        }
        var d = new Date();
        return tw.wiki.generateNewTitle(
            [
                "Clip ", d.getFullYear(),
                leftPad(d.getMonth() + 1),
                leftPad(d.getDate()),
                // leftPad(d.getHours()), leftPad(d.getMinutes()), leftPad(d.getSeconds())
            ].join(""));
    }
}

export const getValue = (val) => {

    if (typeof val === 'function') {
        return val();
    }

    return val;
}

export const toggleBetween = (a, b) => {

    let flag = true;

    return () => {

        if (flag) {
            flag = false;
            return getValue(a);
        }
        flag = true;
        return getValue(b);
    }
}

export function passThrough(fn) {

    return (...args) => {

        const result = args.length > 1 ? args : args[0];
        return fn() || result;
    }
}

export const toggleStyle = (domNode, name: string, value: any) => {

    const toggleValue = toggleBetween(Memoize(() => getValue(domNode).style[name]), value);

    return () => {

        getValue(domNode).style[name] = toggleValue();
    }

}

export const getDomBy = (selector) => {

    return (name) => document[`getElementBy${selector}`](name);
}

export const setAt = (where, path) => {

    return (value) => {

        if (typeof value === 'function') {
            value = value();
        }

        where[path] = value;
        return where[path];
    }
}