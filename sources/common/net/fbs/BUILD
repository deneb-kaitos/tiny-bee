for language in ["ts", "js"]:
  if language == "ts":
    genrule(
      name = f"generate_{language}",
      srcs = [
        "schema/Message.fbs",
        "schema/authz/AccountRegistrationRequest.fbs",
      ],
      outs = [
        f"generated/{language}",
      ],
      deps = [
        "//:pnpm_common_files",
      ],
      cmd = [
        f"$TOOLS_FLATC --{language} --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "FLATC": ["//tools/flatbuffers:flatcompiler|flatc"],
      },
      visibility = ["PUBLIC"]
    )

  elif language == "js":
    genrule(
      name = f"generate_{language}",
      labels = ["codegen"],
      srcs = [
        ".swcrc",
        "package.json",
        ":generate_ts",
      ],
      outs = [
        f"generated/{language}",
      ],
      deps = [
        "//:pnpm_common_files",
        # ":generate_ts",
      ],
      cmd = [
        "cd sources/common/net/fbs",
        "pnpm install",
        "cd generated",
        "$TOOLS_NODE ../node_modules/@swc/cli/bin/swc.js ts --out-dir $OUT --config-file ../.swcrc --strip-leading-paths",
      ],
      pass_env = [
        "SHELL",
      ],
      tools = {
        "CURL": "curl",
        "NODE": "node",
      },
      visibility = ["PUBLIC"],
    )
  else:
    genrule(
      name = f"generate_{language}",
      labels = ["codegen"],
      srcs = [
        "schema/Message.fbs",
        "schema/authz/AccountRegistrationRequest.fbs",
      ],
      deps = [
        "//:pnpm_common_files",
        "//tools/flatbuffers:flatcompiler",
      ],
      outs = [
        f"generated/{language}",
      ],
      cmd = [
        f"$TOOLS_FLATC --{language} --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "FLATC": ["//tools/flatbuffers:flatcompiler|flatc"],
      },
      visibility = ["PUBLIC"],
    )
