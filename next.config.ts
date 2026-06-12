import type { NextConfig } from "next";
import packageJson from "./package.json";

const TRANPILE_PREFIXES = ["@radix-ui/", "@tiptap/", "@dnd-kit/", "@apollo/"];
const TRANPILE_EXACT = new Set(["lucide-react", "graphql", "graphql-ws", "apollo3-cache-persist"]);

const transpilePackages = Object.keys(packageJson.dependencies).filter(
  (name) =>
    TRANPILE_PREFIXES.some((prefix) => name.startsWith(prefix)) ||
    TRANPILE_EXACT.has(name),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedEnv: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-tooltip",
      "framer-motion",
    ],
  },
  typedRoutes: true,
  transpilePackages,
};

export default nextConfig;
