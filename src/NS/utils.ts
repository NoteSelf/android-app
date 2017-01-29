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