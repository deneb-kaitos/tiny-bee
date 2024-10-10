import { AccountRegistrationRequest } from "../tinybee/account-registration-request.js";
export var MessagePayload = /* @__PURE__ */ ((MessagePayload2) => {
  MessagePayload2[MessagePayload2["NONE"] = 0] = "NONE";
  MessagePayload2[MessagePayload2["AccountRegistrationRequest"] = 1] = "AccountRegistrationRequest";
  return MessagePayload2;
})(MessagePayload || {});
export function unionToMessagePayload(type, accessor) {
  switch (MessagePayload[type]) {
    case "NONE":
      return null;
    case "AccountRegistrationRequest":
      return accessor(new AccountRegistrationRequest());
    default:
      return null;
  }
}
export function unionListToMessagePayload(type, accessor, index) {
  switch (MessagePayload[type]) {
    case "NONE":
      return null;
    case "AccountRegistrationRequest":
      return accessor(index, new AccountRegistrationRequest());
    default:
      return null;
  }
}
