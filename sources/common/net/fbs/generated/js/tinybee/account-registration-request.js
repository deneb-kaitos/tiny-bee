import * as flatbuffers from "flatbuffers";
export class AccountRegistrationRequest {
  bb = null;
  bb_pos = 0;
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsAccountRegistrationRequest(bb, obj) {
    return (obj || new AccountRegistrationRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsAccountRegistrationRequest(bb, obj) {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
    return (obj || new AccountRegistrationRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  login(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  password(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  pin(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startAccountRegistrationRequest(builder) {
    builder.startObject(3);
  }
  static addLogin(builder, loginOffset) {
    builder.addFieldOffset(0, loginOffset, 0);
  }
  static addPassword(builder, passwordOffset) {
    builder.addFieldOffset(1, passwordOffset, 0);
  }
  static addPin(builder, pinOffset) {
    builder.addFieldOffset(2, pinOffset, 0);
  }
  static endAccountRegistrationRequest(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createAccountRegistrationRequest(builder, loginOffset, passwordOffset, pinOffset) {
    AccountRegistrationRequest.startAccountRegistrationRequest(builder);
    AccountRegistrationRequest.addLogin(builder, loginOffset);
    AccountRegistrationRequest.addPassword(builder, passwordOffset);
    AccountRegistrationRequest.addPin(builder, pinOffset);
    return AccountRegistrationRequest.endAccountRegistrationRequest(builder);
  }
}
