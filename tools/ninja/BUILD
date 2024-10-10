github_repo(
  name = "ninja_src",
  repo = "ninja-build/ninja",
  revision = "v1.12.1",
)

genrule(
  name = "ninja",
  exit_on_error = True,
  binary = True,
  srcs = [],
  outs = {
    "ninja": ["tools/ninja/ninja_src/build-cmake/ninja"],
  },
  cmd = [
    "cd tools/ninja/ninja_src",
    "cmake -Bbuild-cmake",
    "cmake --build build-cmake",
  ],
  deps = [
    ":ninja_src",
  ],
  visibility = ["PUBLIC"],
)