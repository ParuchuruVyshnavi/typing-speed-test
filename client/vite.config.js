import { defineconfig } from "vite";
import react from "@vitejs/pluggin-react";

export default defineconfig({
    pluggins:[react()],

    base: "/typing-speed-test/",
});