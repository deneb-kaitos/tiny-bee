# http_archive(
#   name = "esbuild_archive",
#   urls = ["https://esbuild.github.io/dl/latest"],

# )

genrule(
  name = "esbuild",
  exit_on_error = True,
  binary = True,
  srcs = [],
  outs = {
    "esbuild": ["esbuild"],
  },
  cmd = [
    "curl -fsSL https://esbuild.github.io/dl/latest | sh",
  ],
  tools = [
    "curl",
  ],
  visibility = ["PUBLIC"],
)