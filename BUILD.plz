package(
  default_visibility = ["PUBLIC"],
)

excluded_files = ["BUILD"]

filegroup(
  name = "pnpm_common_files",
  srcs = glob(
    [
      "pnpm-workspace.yaml",
      "pnpm-lock.yaml",
      ".npmrc",
      "package.json",
    ],
    exclude = excluded_files,
    hidden = True,
  ),
)

# filegroup(
#   name = "common_net_fbs",
#   srcs = glob(
#     [
#       "sources/common/net/fbs/package.json",
#       "sources/common/net/fbs/schema/**/*.fbs",
#       "sources/common/net/fbs/.swcrc",
#     ],
#     exclude = excluded_files,
#     hidden = True,
#   ),
# )

filegroup(
  name = "all_js_sources",
  deps = [
    ":pnpm_common_files",
    # ":common_net_fbs",
  ],
)
