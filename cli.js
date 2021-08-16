#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import ADBssi from './index.js'

yargs(hideBin(process.argv))
    .scriptName('adbssi')
    .version(false)
    .options({
        usb: {
            alias: 'u',
            describe: 'Use USB device',
        },
    })
    .options({
        tcp: {
            alias: 't',
            describe: 'Use TCP/IP device',
        },
    })
    .command({
        command: ['take [filename]', '$0'],
        aliases: ['t'],
        desc: 'Take screenshot over ADB shell',
        handler: ({ filename, usb = false, tcp = false }) => {
            ADBssi(filename, usb ? 'usb' : tcp ? 'tcp' : 'auto')
                .then((filePath) => {
                    // filePath
                })
                .catch((tag) => {
                    // tag
                })
                .finally(() => {
                    console.log('\npress Enter to exit\n')
                    process.stdin.once('data', () => {
                        process.exit(0)
                    })
                })
        },
    })
    .example('$0 screenshot.png')
    .help().argv
