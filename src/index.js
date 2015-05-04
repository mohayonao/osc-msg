import Message from "./Message";

export default {
  Message,
  fromBuffer(buffer) {
    return Message.fromBuffer(buffer).toObject();
  },
  toBuffer(obj) {
    return Message.fromObject(obj).toBuffer();
  },
};
