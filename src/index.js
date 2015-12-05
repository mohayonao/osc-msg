import decode from "./decode";
import encode from "./encode";

export default {
  decode,
  encode,
  fromBuffer: decode,
  fromObject: encode,
  toBuffer: encode,
  toObject: decode,
};
