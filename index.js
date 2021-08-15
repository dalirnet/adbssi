import chalk from 'chalk'
import spawn from 'cross-spawn'
import { resolve, extname, basename } from 'path'

const log = (input) => {
    console.log(chalk.gray('●'), input)
}

const getDevice = (use) => {
    const tag = 'Get device'
    return new Promise((resolve, reject) => {
        log(chalk.cyan(tag))
        let devices = []
        const command = spawn('adb', ['devices'])
        command.stdout.on('data', (output) => {
            devices = [...String(output).matchAll(/^([a-z0-9.:]+)\s+(device|bootloader|offline)$/gim)].reduce((keep, device) => {
                if (use === (device[1].match(/[.:]/g) ? 'tcp' : 'usb') && device[2] === 'device') {
                    keep.push(device[1])
                }

                return keep
            }, [])
        })
        command.stderr.on('data', (output) => {
            log(chalk.yellow(String(output)))
        })
        command.on('close', (code) => {
            if (devices.length > 1) {
                log(chalk.yellow('Multiple devices available'))
            } else if (devices.length === 0) {
                log(chalk.yellow('No available devices'))
            }

            if (code === 0 && devices.length === 1) {
                resolve(devices[0])
            } else {
                reject(tag)
            }
        })
    })
}

const takeScreenshot = ({ device, fileName }) => {
    const tag = 'Take screenshot'
    return new Promise((resolve, reject) => {
        log(chalk.cyan(tag))
        const path = '/sdcard/' + fileName
        const command = spawn('adb', ['-s', device, 'shell', 'screencap', '-p', path])
        command.stderr.on('data', (output) => {
            log(chalk.yellow(String(output)))
        })
        command.on('close', (code) => {
            if (code === 0) {
                resolve({ device, path })
            } else {
                reject(tag)
            }
        })
    })
}

const downloadFile = ({ device, path, filePath }) => {
    const tag = 'Download file'
    return new Promise((resolve, reject) => {
        log(chalk.cyan(tag))
        const command = spawn('adb', ['-s', device, 'pull', path, filePath])
        command.stderr.on('data', (output) => {
            log(chalk.yellow(String(output)))
        })
        command.on('close', (code) => {
            if (code === 0) {
                resolve({ device, path })
            } else {
                reject(tag)
            }
        })
    })
}

const removeTemp = ({ device, path }) => {
    const tag = 'Remove temporary file'
    return new Promise((resolve, reject) => {
        log(chalk.cyan(tag))
        const command = spawn('adb', ['-s', device, 'shell', 'rm', '-f', path])
        command.stderr.on('data', (output) => {
            log(chalk.yellow(String(output)))
        })
        command.on('close', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(tag)
            }
        })
    })
}

const ADBssi = (file = 'screenshot.png', use = 'usb') => {
    const fileName = basename(file)
    const fileType = extname(fileName)
    const filePath = resolve(process.cwd(), file)

    if (!['.png', '.jpg', '.gif'].includes(fileType)) {
        log(chalk.red('Invalid file type'))
        return false
    }

    getDevice(use)
        .then((device) => {
            return takeScreenshot({ device, fileName })
        })
        .then(({ device, path }) => {
            return downloadFile({ device, path, filePath })
        })
        .then(({ device, path }) => {
            return removeTemp({ device, path })
        })
        .then(() => {
            log(chalk.green('Save at ' + filePath))
            log(chalk.bold('Press Enter to exit ...'))
            process.stdin.once('data', () => {
                process.exit(0)
            })
        })
        .catch((tag) => {
            log(chalk.red(tag))
        })
}

export default ADBssi
