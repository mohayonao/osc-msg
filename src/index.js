import OSCElement from "./OSCElement";
import OSCMessage from "./OSCMessage";
import OSCBundle from "./OSCBundle";

export default {
  OSCMessage,
  OSCBundle,
  fromBuffer: buffer => OSCElement.fromBuffer(buffer).toObject(),
  toBuffer: obj => OSCElement.fromObject(obj).toBuffer(),
};
