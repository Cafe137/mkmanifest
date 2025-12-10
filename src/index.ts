#!/usr/bin/env node

import * as core from '@actions/core'
import { MantarayNode, MerkleTree, NULL_ADDRESS } from '@ethersphere/bee-js'
import { Arrays, Binary } from 'cafe-utility'
import { argv, env } from 'process'

const payload = Arrays.requireStringArgument(argv, 'payload', env, 'MKMANIFEST_PAYLOAD')
const filename = Arrays.requireStringArgument(argv, 'filename', env, 'MKMANIFEST_FILENAME')
const contentType = Arrays.requireStringArgument(argv, 'content-type', env, 'MKMANIFEST_CONTENT_TYPE')

main()

async function main() {
    const cac = await MerkleTree.root(new TextEncoder().encode(payload))
    const mantaray = new MantarayNode()
    mantaray.addFork('/', NULL_ADDRESS, {
        'website-index-document': filename
    })
    mantaray.addFork(filename, cac.hash(), {
        'Content-Type': contentType,
        Filename: filename
    })
    const address = await mantaray.calculateSelfAddress()
    core.setOutput('mkmanifest_result_address', address.toHex())
    core.setOutput('mkmanifest_result_payload', Binary.uint8ArrayToHex(await mantaray.marshal()))
}
