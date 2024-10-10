genrule(
  name = "node_bin",
  exit_on_error = True,
  binary = True,
  outs = {
    "node": ["node_bin/bin/node"],
  },
  cmd = [
    "$TOOLS_CURL -o node.tar.gz https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$OS-x64.tar.gz",
    "rm -rf node_bin",
    "$TOOLS_MKDIR node_bin",
    "$TOOLS_TAR -xzf node.tar.gz --strip-components=1 -C ./node_bin/"
  ],
  tools = {
    "MKDIR": "mkdir",
    "CURL": "curl",
    "TAR": "tar",
  },
  visibility = ["PUBLIC"],
)
