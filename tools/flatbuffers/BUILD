github_repo(
  name = "flatbuffers_src",
  bazel_compat = True,
  repo = "google/flatbuffers",
  revision = "v24.3.25",
)

genrule(
  name = "flatcompiler",
  exit_on_error = True,
  binary = True,
  srcs = [],
  outs = {
    "flatc": ["tools/flatbuffers/flatbuffers_src/flatc"],
  },
  cmd = [
    "cd tools/flatbuffers/flatbuffers_src",
    "cmake -G \"Unix Makefiles\" -DCMAKE_BUILD_TYPE=Release",
    "make -j",
  ],
  deps = [
    ":flatbuffers_src",
  ],
  visibility = ["PUBLIC"],
)