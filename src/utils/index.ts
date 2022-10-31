export const isBlank = (target: any) => {
    if (typeof target === 'undefined' || target === null) {
        return true
    }
    if (typeof target === 'string' && target.trim() === '') {
        return true
    }
    return false
}

export const wait = <T>(target: T | (() => T) | Promise<T>, mills: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (typeof target === 'function') {
                    resolve((target as (() => T))())
                } else {
                    resolve(target)
                }
            } catch (e) {
                reject(e)
            }
        }, mills)
    })
}

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export const deepClone = (obj: any) => {
    if (obj === null) return null;
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
        key =>
        (clone[key] =
            typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
    );
    if (Array.isArray(obj)) {
        clone.length = obj.length;
        return Array.from(clone);
    }
    return clone;
}
export const asyncFilter = async <T>(target: T[], predicate: (arg: T) => Promise<boolean>) => {
    const results = await Promise.all(target.map(predicate));
    return target.filter((_v, index) => results[index]);
}

export const asyncMap = async <T, U>(target: T[], predicate: (arg: T) => Promise<U>) => {
    return Promise.all(target.map(predicate));
}