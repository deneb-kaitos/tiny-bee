package(
  default_visibility = ["PUBLIC"],
)

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
    "flatc": ["flatc"],
  },
  cmd = [
    "cd tools/flatbuffers/flatbuffers_src",
    "cmake -G \"Unix Makefiles\" -DCMAKE_BUILD_TYPE=Release -DFLATBUFFERS_BUILD_TESTS=OFF -DFLATBUFFERS_INSTALL=OFF -DFLATBUFFERS_BUILD_FLATLIB=OFF",
    "make -j",
    "cp flatc $OUT",
  ],
  deps = [
    ":flatbuffers_src",
  ],
)
