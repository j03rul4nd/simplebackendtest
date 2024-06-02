export function isJsonString(str) {
    try {
        const obj = JSON.parse(str);
        return obj && typeof obj === 'object';
    } catch (e) {
        return false;
    }
}
