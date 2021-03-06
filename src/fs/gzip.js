import { Gzip } from "minizlib"

import _createOptions from "../util/create-options.js"
import { gzipSync } from "zlib"
import streamToBuffer from "./stream-to-buffer.js"

let useGzipFastPath = true

function gzip(bufferOrString, options) {
  options = gzip.createOptions(options)

  if (useGzipFastPath) {
    try {
      return fastPathGzip(bufferOrString, options)
    } catch (e) {
      useGzipFastPath = false
    }
  }
  return fallbackGzip(bufferOrString, options)
}

function fallbackGzip(bufferOrString, options) {
  return gzipSync(bufferOrString, options)
}

function fastPathGzip(bufferOrString, options) {
  return streamToBuffer(new Gzip(options), bufferOrString)
}

gzip.defaultOptions = { level: 9 }
gzip.createOptions = (options) => _createOptions(options, gzip.defaultOptions)

export default gzip
