//! By convention, root.zig is the root source file when making a library. If
//! you are making an executable, the convention is to delete this file and
//! start with main.zig instead.
const std = @import("std");
const enum_builder = @cImport(@cInclude("enum_builder.h"));
const testing = std.testing;

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "use enum_builder" {
    std.debug.print("result from C code: {}\n", .{enum_builder.interop_EnumTable_create()});
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
