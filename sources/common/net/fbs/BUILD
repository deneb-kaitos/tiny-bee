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
      outs = [
        "generated/" + language,
      ],
      deps = [
        ":generate_ts"
      ],
      cmd = "$TOOLS_ESBUILD ./**/*.ts --outdir=$OUT",
      tools = {
        "ESBUILD": ["//tools/esbuild:esbuild|esbuild"]
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
