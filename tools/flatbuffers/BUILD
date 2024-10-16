github_repo(
  name = "flatbuffers_src",
  repo = "google/flatbuffers",
  revision = f"v{CONFIG.FLATBUFFERS_VERSION}",
)

genrule(
  name = "flatcompiler",
  exit_on_error = True,
  binary = True,
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