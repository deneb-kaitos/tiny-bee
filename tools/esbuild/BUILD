genrule(
  name = "esbuild",
  exit_on_error = True,
  binary = True,
  srcs = [],
  outs = {
    "esbuild": ["esbuild"],
  },
  cmd = [
    "$TOOLS_CURL -fsSL https://esbuild.github.io/dl/latest | sh",
  ],
  tools = {
    "CURL": "curl",
  },
  visibility = ["PUBLIC"],
)