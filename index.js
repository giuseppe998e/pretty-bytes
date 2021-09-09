let Obj = Object

/*
Formats the given number using `Number#toLocaleString`.
- If loc is a string, the value is expected to be a loc-key (for example: `de`).
- If loc is true, the system default locale is used for translation.
- If no value for loc is specified, the number is returned unmodified.
*/
let toLocaleString = (num, loc, opts) => {
    if (typeof loc == 'string' || Array.isArray(loc))
        return num.toLocaleString(loc, opts)
    if (loc == true || Obj.keys(opts).length)
        return num.toLocaleString(undefined, opts)
    return num
}

module.exports = (num, opts) => {
    if (!Number.isFinite(num))
        throw new TypeError(`Expected a finite num, got ${typeof num}: ${num}`)

    opts = Obj.assign({bits: false, binary: false}, opts)

	let bitByteUnit = opts.bits ? 'bit' : 'B'

    if (opts.signed && !num) // num == 0
        return ` 0 ${bitByteUnit[0]}`

	let binSiKilo = 'k', binPostfix = '', log = Math.log10, valUnit = 1000
	if (opts.binary) {
		binSiKilo = 'K'
		binPostfix = 'i'
		log = Math.log
		valUnit += 24
	}

    let UNITS = `${bitByteUnit[0]}${binSiKilo}MGTPEZY`

    let prefix = num < 0 ? '-' : (opts.signed ? '+' : '')
    num = Math.abs(num)

    let locOpts = Obj.fromEntries(
        Obj.entries(opts).filter(e => e[0].includes('ionDig'))
    )

    if (num < 1) {
        let numStr = toLocaleString(num, opts.locale, locOpts)
        return `${prefix}${numStr} ${UNITS[0]}`
    }

    let exp = Math.min(Math.floor(log(num) / log(valUnit)), UNITS.length - 1)
    num /= Math.pow(valUnit, exp)

    if (!Obj.keys(locOpts).length)
        num = num.toPrecision(3)

    let postfix = UNITS[exp]
    if (exp) // exp > 0
        postfix += binPostfix + bitByteUnit

    let numStr = toLocaleString(Number(num), opts.locale, locOpts)
    return `${prefix}${numStr} ${postfix}`
}
