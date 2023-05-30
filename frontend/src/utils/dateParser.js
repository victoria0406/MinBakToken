
function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

export function toStringByFormatting(date, delimiter = '-') {
    const source = new Date(date);
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
}