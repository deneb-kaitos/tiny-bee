for language in ["ts", "js"]:
  if language == "ts":
    genrule(
      name = "generate_" + language,
      srcs = [
        "schema/Message.fbs",
        "schema/authz/AccountRegistrationRequest.fbs",
      ],
      outs = [
        "generated/" + language,
      ],
      cmd = [
        "$TOOLS_FLATC --" + language + " --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "FLATC": ["//tools/flatbuffers:flatcompiler|flatc"],
      },
      visibility = ["PUBLIC"]
    )

  elif language == "js":
    genrule(
      name = "generate_" + language,
      labels = ["codegen"],
      srcs = glob(
        [
          "**/*.js",
        ],
        exclude=["node_modules"]
      ) + [
        "./.swcrc",
      ],
      outs = [
        "generated/" + language,
      ],
      deps = [
        ":generate_ts"
      ],
      cmd = [
        "curl -fsSL https://get.pnpm.io/install.sh | sh -",
        # "corepack enable pnpm",
        # "corepack prepare --activate pnpm@latest",
        "cd sources/common/net/fbs",
        "pnpm init",
        "pnpm i -D @swc/cli @swc/core",
        "$TOOLS_NODE node_modules/@swc/cli/bin/swc.js ./generated/ts --out-dir $OUT --config-file ./.swcrc",
      ],
      tools = {
        "node": "//tools/nodejs:node_bin|node",
      },
      env = {
        "NODE_HOME": "$(exe //tools/nodejs/node_bin:node)",
        "SHELL": "/bin/bash",
        "PNPM_HOME": "/usr/local/bin",
      },
    )
  else:
    genrule(
      name = "generate_" + language,
      labels = ["codegen"],
      srcs = [
        "schema/Message.fbs",
        "schema/authz/AccountRegistrationRequest.fbs",
      ],
      outs = [
        "generated/" + language,
      ],
      cmd = [
        "$TOOLS_FLATC --" + language + " --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "FLATC": ["//tools/flatbuffers:flatcompiler|flatc"],
      },
      visibility = ["PUBLIC"],
    )
