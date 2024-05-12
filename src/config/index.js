import { app, router } from "./express.js";
import { auth } from "express-openid-connect";
import prisma from "./db.js";
import dotenv from "dotenv";
export { prisma, dotenv, app, router, auth };
