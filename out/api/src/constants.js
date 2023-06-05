"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIRECT_URI = exports.CLIENT_SECRET = exports.CLIENT_ID = void 0;
const path_1 = require("path");
const dotenv_1 = require("dotenv");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.CLIENT_SECRET = process.env.CLIENT_SECRET;
exports.REDIRECT_URI = "http://localhost:8080/auth/callback";
//# sourceMappingURL=constants.js.map