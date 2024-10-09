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
        "flatc --" + language + " --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "flatc": ["//tools/flatbuffers:flatcompiler"],
        "esbuild": ["//tools/esbuild:esbuild|esbuild"]
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
      cmd = "esbuild ./**/*.ts --outdir=$OUT",
      tools = {
        "esbuild": ["//tools/esbuild:esbuild|esbuild"]
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
        "flatc --" + language + " --natural-utf8 --gen-all --warnings-as-errors -o $OUTS sources/common/net/fbs/schema/Message.fbs",
      ],
      tools = {
        "flatc": ["//tools/flatbuffers:flatcompiler"],
      },
      visibility = ["PUBLIC"],
    )
