#!/usr/bin/env node

import {ArgumentParser} from "argparse"
import * as fs from "fs"
import * as glob from "glob"

interface ParsedArgs {
  dist: string
}

function parse_args(): ParsedArgs {
  const ap = new ArgumentParser({description: "Fix TypeScript imports", add_help: true})

  ap.add_argument("dist")

  return ap.parse_args() as ParsedArgs
}

function fix_imports(path: string): void {
  console.log(`Fixing imports for ${path}`)

  const text_in = fs.readFileSync(path, {encoding: "utf8"})

  let lines = text_in.split(/\r?\n/)

  const regex = new RegExp('^(import .* from "\\./.*)(";)$')

  lines = lines.map((line) => line.replace(regex, "$1.js$2"))

  const LF = "\n"

  const text_out = lines.join(LF) + LF

  fs.writeFileSync(path, text_out, {encoding: "utf8"})
}

const pa = parse_args()

const paths = glob.sync(pa.dist, {nodir: true})

for (const path of paths) {
  fix_imports(path)
}
