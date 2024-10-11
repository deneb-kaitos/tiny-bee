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
        "cd sources/common/net/fbs",
        "pnpm init",
        "pnpm i -D @swc/cli @swc/core",
        "node node_modules/@swc/cli/bin/swc.js ./generated/ts --out-dir $OUT --config-file ./.swcrc",
      ],
      env = {
        "SHELL": "/bin/bash",
        # see: https://github.com/pnpm/pnpm/issues/4495#issuecomment-1518584959
        "PNPM_HOME": "/usr/local/bin",
        "PNPM_VERSION": "9.11.0",
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
