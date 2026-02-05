import { toNextJsHandler } from "better-auth/next-js";
import {authServer} from "@/libs/auth-server";

export const { GET, POST } = toNextJsHandler(authServer.handler);