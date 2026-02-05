import compression from "compression";

/*
  Gzip compression middleware
  Compresses response bodies for faster transfer
*/
const compressionConfig = compression();

export default compressionConfig;
