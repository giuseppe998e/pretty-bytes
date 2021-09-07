/*
Formats the given number using `Number#toLocaleString`.
- If loc is a string, the value is expected to be a loc-key (for example: `de`).
- If loc is true, the system default locale is used for translation.
- If no value for loc is specified, the number is returned unmodified.
*/
let toLocaleString = (num, loc, opts) => {
    if (typeof loc == 'string' || Array.isArray(loc))
        return num.toLocaleString(loc, opts)
    if (loc == true || Object.keys(opts).length)
        return num.toLocaleString(undefined, opts)
    return num
}

module.exports = (num, opts) => {
    if (!Number.isFinite(num))
        throw new TypeError(`Expected a finite num, got ${typeof num}: ${num}`)

    opts = Object.assign({bits: false, binary: false}, opts)

    let UNITS = `${opts.bits ? 'b' : 'B'}${opts.binary ? 'K' : 'k'}MGTPEZY`

    if (opts.signed && !num) // num == 0
        return ` 0 ${UNITS[0]}`

    let prefix = num < 0 ? '-' : (opts.signed ? '+' : '')
    num = Math.abs(num)

    let locOpts = Object.fromEntries(
        Object.entries(opts).filter(([k, _]) => k.includes('ionDig'))
    )

    if (num < 1) {
        let numStr = toLocaleString(num, opts.loc, locOpts)
        return `${prefix}${numStr} ${UNITS[0]}`
    }

    let exp = Math.min(
        Math.floor(opts.binary ? Math.log(num) / Math.log(1024) : Math.log10(num) / 3 /* log(1000) */),
        UNITS.length - 1)
    num /= Math.pow(opts.binary ? 1024 : 1000, exp)

    if (!Object.keys(locOpts).length)
        num = num.toPrecision(3)

    let postfix = UNITS[exp]
    if (exp) { // exp > 0
        postfix += opts.binary ? 'i' : ''
        postfix += opts.bits ? 'bit' : 'B'
    }

    let numStr = toLocaleString(Number(num), opts.loc, locOpts)
    return `${prefix}${numStr} ${postfix}`
}
