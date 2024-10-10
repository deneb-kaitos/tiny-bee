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
        "corepack enable pnpm",
        "corepack prepare --activate pnpm@latest",
        "cd sources/common/net/fbs",
        "pnpm init",
        "pnpm i -D @swc/cli @swc/core",
        "node_modules/.bin/swc ./generated/ts --out-dir $OUT --config-file ./.swcrc",
      ],
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
