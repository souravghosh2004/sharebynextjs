import { createContext, useContext, useEffect, useState } from "react";


import {useAuth} from "./AuthProvider"

const SSE_URL = "https://api.shareby.io/api/v1/sse/stream";

