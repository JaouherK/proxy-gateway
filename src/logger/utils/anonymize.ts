export class Anonymize {

    /**
     * @param content: the message to anonymize
     * @param maskList
     * @param mask
     */
    public anonymize(content: any, maskList: string[], mask: string | any = "********"): any {
        // this is some kind of clone so we don't modify the original message
        const copyContent = JSON.parse(JSON.stringify(content));
        if (Array.isArray(copyContent)) {
            this.arrayMask(copyContent, maskList, mask);
        } else if (copyContent === null) {
            return;
        } else {
            this.objectMask(copyContent, maskList, mask);
        }
        return copyContent;
    }

    private arrayMask(copyContent: any[], maskList: string[], mask: string) {
        return copyContent.forEach((element) => {
            Object.keys(element).map((key) => {
                this.hide(element, key, maskList, mask);
            });
        });
    }

    private objectMask(copyContent: any, maskList: string[], mask: string) {
        return Object.keys(copyContent).map((key) => {
            this.hide(copyContent, key, maskList, mask);
        });
    }

    private hide(element: any, key: string, maskList: string[], mask: string) {
        if ((maskList.indexOf(key) !== -1)) {
            return element[key] = mask;
        }
        if (typeof element[key] === 'object') {
            element[key] = this.anonymize(element[key], maskList, mask);
            return element;
        }
    }
}
