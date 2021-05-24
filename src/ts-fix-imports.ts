#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"

const LF = "\n"

const paths = fs
  .readdirSync("dist")
  .map((p) => path.join("dist", p))
  .filter((p) => p.endsWith(".js"))

for (const path of paths) {
  console.log(`Fixing imports for ${path}`)

  const text_in = fs.readFileSync(path, "utf8")

  let lines = text_in.split(/\r?\n/)

  const regex = new RegExp('^(import .* from "\\./.*)(";)$')

  lines = lines.map((line) => line.replace(regex, "$1.js$2"))

  const text_out = lines.join(LF) + LF

  fs.writeFileSync(path, text_out, "utf8")
}
