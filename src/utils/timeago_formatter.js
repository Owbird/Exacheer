export default function (value, time) {

    time = time.replace("minute", "m")
        .replace("second", "s")
        .replace("hour", "h")
        .replace("day", "d")

    return `${value}${time} ago`
}