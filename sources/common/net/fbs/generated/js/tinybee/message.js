import * as flatbuffers from "flatbuffers";
import { MessagePayload } from "../tinybee/message-payload.js";
export class Message {
  bb = null;
  bb_pos = 0;
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsMessage(bb, obj) {
    return (obj || new Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsMessage(bb, obj) {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
    return (obj || new Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  payloadType() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : MessagePayload.NONE;
  }
  payload(obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
  }
  static startMessage(builder) {
    builder.startObject(2);
  }
  static addPayloadType(builder, payloadType) {
    builder.addFieldInt8(0, payloadType, MessagePayload.NONE);
  }
  static addPayload(builder, payloadOffset) {
    builder.addFieldOffset(1, payloadOffset, 0);
  }
  static endMessage(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishMessageBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedMessageBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
  static createMessage(builder, payloadType, payloadOffset) {
    Message.startMessage(builder);
    Message.addPayloadType(builder, payloadType);
    Message.addPayload(builder, payloadOffset);
    return Message.endMessage(builder);
  }
}
