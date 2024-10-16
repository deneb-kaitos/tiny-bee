genrule(
  name = "build",
  srcs = [
    "specs/AccountRegistrationRequest.specs.mjs",
    "serialize.mjs",
    "package.json",
    "specs/.env.specs",
    "//sources/common/net/fbs:generate_js",
    "//:pnpm_common_files",
  ],
  cmd = [
    "rm -rf node_modules",
    "pnpm fetch",
    "pnpm run lint",
  ],
)

gentest(
  name = "specs",
  # deps = [
  #   ":build",
  # ],
  needs_transitive_deps = True,
  srcs = [
    "specs/AccountRegistrationRequest.specs.mjs",
    "serialize.mjs",
    "package.json",
    "specs/.env.specs",
    "//:pnpm_common_files",
    "//sources/common/net/fbs:generate_js",
  ],
  test_cmd = [
    "ls -lar .",
    "node --env-file=specs/.env.specs --test specs/*.specs.mjs",
  ],
  no_test_output = True,
  output_is_complete = True,
  visibility = ["PUBLIC"],
)