// src/mocks/node.js
import { setupServer } from "msw/node";
import { handlers, toppingHandlers } from "./handlers";

export const server = setupServer(...handlers, ...toppingHandlers);
