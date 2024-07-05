import dotenv from "dotenv";
dotenv.config();
//const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV;
const MONGODB_URI = process.env.MONGODB_URI || "";

/*
const ZOOM_VIDEO_SDK_KEY = process.env.ZOOM_VIDEO_SDK_KEY;
const ZOOM_VIDEO_SDK_SECRET = process.env.ZOOM_VIDEO_SDK_SECRET;
*/
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

/*
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
*/



export {
  //PORT,
  NODE_ENV,
  MONGODB_URI,
  /*ZOOM_VIDEO_SDK_KEY,
  ZOOM_VIDEO_SDK_SECRET,*/
  LOG_LEVEL,
  /*ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,*/
};
