#!/usr/bin/env node

import {ArgumentParser, ArgumentParserOptions} from "argparse"
import * as fs from "fs"
import * as glob from "glob"

interface ParsedArgs {
  dist: string
  verbose: boolean
}

function parse_args(): ParsedArgs {
  const apo = {
    description: "Fix TypeScript imports",
    add_help: true,
    allow_abbrev: false,
  } as unknown as ArgumentParserOptions

  const ap = new ArgumentParser(apo)

  ap.add_argument("dist", {help: "glob of dist paths to fix"})
  ap.add_argument("--verbose", {action: "store_true", help: "show verbose messages"})

  return ap.parse_args() as ParsedArgs
}

function fix_imports(path: string, verbose: boolean): void {
  if (verbose) {
    console.log(`Fixing imports for ${path}`)
  }

  const text_in = fs.readFileSync(path, {encoding: "utf8"})

  let lines = text_in.split(/\r?\n/)

  const regex = new RegExp('^(import .* from "\\./.*)(";)$')

  lines = lines.map((line) => line.replace(regex, "$1.js$2"))

  const LF = "\n"

  const text_out = lines.join(LF) + LF

  fs.writeFileSync(path, text_out, {encoding: "utf8"})
}

function main(): void {
  const pa = parse_args()

  console.log(`Fixing imports in files: '${pa.dist}'`)

  const paths = glob.sync(pa.dist, {nodir: true})

  for (const path of paths) {
    fix_imports(path, pa.verbose)
  }
}

main()
