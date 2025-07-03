const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const morgan = require("morgan");
const errorMiddleware = require("./middleware/Error");
const connectDatabase = require("./config/connect");
const router = require("./routes");
const app = express();
const port = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const { Server } = require("socket.io");
const { socketConfig } = require("./socket");
const crypto = require("crypto");
// const querystring = require('querystring')
const querystring = require("querystring");
const axios = require("axios");
const {
  validateRequest,
  isRequired,
  inNumberArray,
  isLengthLessThan,
  isBetween,
  matchesStringArray,
} = require("./validations/validations");
const { toStringArray } = require("./utils/zoom");
// import { KJUR } from 'jsrsasign'
const { KJUR } = require("jsrsasign");
const { Users } = require("./models");
const { default: mongoose } = require("mongoose");
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(helmet());

// const SDK_KEY = "UZqA8sPhQJSqKO9YzEG0mA";
// const SDK_SECRET = "3NDUVABm5kXPp8B2azgpSOgX6pvoLqHhVKYi";

// function base64UrlEncode(str) {
//   return Buffer.from(str, "utf-8")
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// function generateZoomSignature(
//   sdkKey,
//   sdkSecret,
//   meetingNumber,
//   role,
//   expiry = 3600
// ) {
//   const iat = Math.floor(Date.now() / 1000);
//   const exp = iat + expiry;

//   console.log({ sdkKey }, { sdkSecret });

//   const payload = {
//     sdkKey: sdkKey,
//     mn: meetingNumber,
//     role: role, // Role: 1 (host), 0 (participant)
//     iat: iat,
//     exp: exp,
//     appKey: sdkKey,
//     tokenExp: exp,
//   };

//   const header = { alg: "HS256", typ: "JWT" };
//   const base64Encode = (obj) =>
//     Buffer.from(JSON.stringify(obj)).toString("base64url");

//   const data = `${base64Encode(header)}.${base64Encode(payload)}`;
//   const signature = crypto
//     .createHmac("sha256", sdkSecret)
//     .update(data)
//     .digest("base64url");

//   return `${data}.${signature}`;
// }

async function generateZoomToken() {
  const key = process.env.ZOOM_VIDEO_SDK_KEY;
  const secret = process.env.ZOOM_VIDEO_SDK_SECRET;
  const clientId = "ZOOM_CLIENT_ID";

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const data = querystring.stringify({
    grant_type: "account_credentials",
    account_id: clientId,
  });

  try {
    const response = await axios.post("https://zoom.us/oauth/token", data, {
      headers: {
        Host: "zoom.us",
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error generating Zoom token:", error);
    throw error;
  }
}

async function createSessionLink(req) {
  const accessToken = await generateZoomToken();
  const dateTime = moment(`${req.body.date} ${req.body.time}`).format(
    "YYYY-MM-DD HH:mm"
  );
  const startTime = moment(dateTime).toISOString();

  const apiURL = "https://api.zoom.us/v2/users/me/meetings";
  const postInput = {
    topic: req.body.heading,
    type: 2,
    start_time: startTime,
    agenda: req.body.description,
    settings: {
      host_video: false,
      participant_video: false,
      waiting_room: true,
    },
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(apiURL, postInput, { headers });
    const statusCode = response.status;
    const responseBody = response.data;

    const data = {
      status: statusCode,
      result: responseBody,
    };

    return data;
  } catch (error) {
    console.error("Error creating Zoom session:", error);
    throw error;
  }
}

// Function to generate Zoom meeting signature
function generateZoomSignature(sdkKey, sdkSecret, meetingNumber, role) {
  const timestamp = new Date().getTime();
  const msg = Buffer.from(sdkKey + meetingNumber + timestamp + role).toString(
    "base64"
  );
  const hash = crypto
    .createHmac("sha256", sdkSecret)
    .update(msg)
    .digest("base64");

  return Buffer.from(
    `${sdkKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");
}

// Express Route to generate the meeting signature
app.post("/generate-signature", (req, res) => {
  const { meetingNumber, role } = req.body;

  if (!meetingNumber || typeof role !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const signature = generateZoomSignature(
    SDK_KEY,
    SDK_SECRET,
    meetingNumber,
    role
  );

  res.json({ signature });
});

app.put("/updateUser", async (req, res) => {
  try {
    const { userData } = req.body;
    console.log(req.body, "BODY DAA");
    console.log(userData.userId, "user ID");

    const userDetail = await Users.findOne({
      _id: new mongoose.Types.ObjectId(userData.userId),
    });

    console.log(userDetail, "USERS DATA");

    if (!userDetail) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await Users.findByIdAndUpdate(
      userData.userId,
      {
        studentMeetId: userData.teacherMeetId,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const userData = await Users.findOne({ _id: userId });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Express Route to create a Zoom meeting session
app.post("/create-zoom-session", async (req, res) => {
  try {
    const meetingData = await createSessionLink(req);
    res.json(meetingData);
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ error: "Error creating Zoom session" });
  }
});

// app.post("/generate-signature", (req, res) => {
//   try {
//     const { meetingNumber, role } = req.body;

//     if (!meetingNumber || role === undefined) {
//       return res.status(400).json({ error: "Missing meetingNumber or role" });
//     }

//     const signature = generateZoomSignature(
//       SDK_KEY,
//       SDK_SECRET,
//       meetingNumber,
//       role
//     );

//     console.log("Generated Signature:", signature);
//     res.json({ signature });
//   } catch (error) {
//     console.error("Error generating signature:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const coerceRequestBody = (body) => ({
  ...body,
  ...[
    "role",
    "expirationSeconds",
    "cloudRecordingOption",
    "cloudRecordingElection",
    "audioCompatibleMode",
  ].reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: typeof body[cur] === "string" ? parseInt(body[cur]) : body[cur],
    }),
    {}
  ),
});

const joinGeoRegions = (geoRegions) => toStringArray(geoRegions)?.join(",");

const validator = {
  role: [isRequired, inNumberArray([0, 1])],
  sessionName: [isRequired, isLengthLessThan(200)],
  expirationSeconds: isBetween(1800, 172800),
  userIdentity: isLengthLessThan(35),
  sessionKey: isLengthLessThan(36),
  geoRegions: matchesStringArray([
    "AU",
    "BR",
    "CA",
    "CN",
    "DE",
    "HK",
    "IN",
    "JP",
    "MX",
    "NL",
    "SG",
    "US",
  ]),
  cloudRecordingOption: inNumberArray([0, 1]),
  cloudRecordingElection: inNumberArray([0, 1]),
  audioCompatibleMode: inNumberArray([0, 1]),
};

app.post("/create-meet", (req, res) => {
  console.log("Create Meet");
  const requestBody = coerceRequestBody(req.body);
  const validationErrors = validateRequest(requestBody, validator);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const {
    role,
    sessionName,
    expirationSeconds,
    userIdentity,
    sessionKey,
    geoRegions,
    cloudRecordingOption,
    cloudRecordingElection,
    audioCompatibleMode,
  } = requestBody;

  const iat = Math.floor(Date.now() / 1000);
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    app_key: process.env.ZOOM_VIDEO_SDK_KEY,
    role_type: role,
    tpc: sessionName,
    version: 1,
    iat,
    exp,
    user_identity: userIdentity,
    session_key: sessionKey,
    geo_regions: joinGeoRegions(geoRegions),
    cloud_recording_option: cloudRecordingOption,
    cloud_recording_election: cloudRecordingElection,
    audio_compatible_mode: audioCompatibleMode,
    permissions: {
      video: ["send", "receive", "start"],
      audio: ["send", "receive"],
      share: ["start", "view"],
      chat: ["send", "receive"],
    },
  };

  console.log(oPayload, "oPayload");

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);

  const sdkJWT = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_VIDEO_SDK_SECRET
  );
  return res.json({ signature: sdkJWT });
});

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: 200, success: true, message: "working finely" });
});

app.use("/api/v1", router);

const swaggerFilePath = path.resolve(__dirname, "swagger_output.json");
app.get("/api-docs/swagger.json", (req, res) => {
  if (fs.existsSync(swaggerFilePath)) {
    const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
    res.json(swaggerFile);
  }
});

// Setup Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerUrl: "/api-docs/swagger.json",
  })
);

app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    success: false,
    message: "Page not found on the server",
  });
});

app.use(errorMiddleware);

connectDatabase();
const server = app.listen(port, () => {
  try {
    console.log(`Server is listing on Port ${port}`);
  } catch (error) {
    console.log(`Something is wrong`);
  }
});

process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down due to unhandled promise rejection ========>`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);
  await socketConfig(io, socket);
});
