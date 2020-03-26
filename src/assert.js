export const OK = async (desc, op) => {
    const succeed = (tx) => {
        const txInfo = '[' + ((tx || {}).blockNumber || '') + ' :: ' + ((tx || {}).hash || '') + ']'
        console.log('OK =>', desc, tx ? txInfo : '')
    }

    const fail = (e) => {
        console.error('OK => ', desc, (e || {}).message || '')
        throw new Error('assertion failed')
    }

    try {
        const check = async (res) => {
            if (res === undefined) {
                succeed()
            } else if (typeof res === typeof true) {
                if (res) {
                    succeed()
                } else {
                    fail()
                }
            } else if (res instanceof Promise) {
                await check(await res)
            } else {
                succeed(res)
            }
        }

        await check(op())
    } catch (e) {
        fail(e)
    }
}

export const FAIL = async (desc, op, err) => {
    const succeed = () => {
        console.log('FAIL =>', desc)
    }

    const fail = (e) => {
        console.error('FAIL => ', desc, (e || {}).message || '')
        throw new Error('assertion failed')
    }

    try {
        await op()
    } catch (e) {
        if (err) {
            if (e.message.includes(err)) {
                succeed()
            } else {
                fail(e.message)
            }
        } else {
            succeed()
        }
    }
}
