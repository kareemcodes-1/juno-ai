// build-widget.js
import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/widget/index.tsx"], // your widget source
  bundle: true,
  outfile: "public/widget.js",     // final distributable
  format: "iife",                              // Immediately Invoked Function Expression
  globalName: "ChatWidgetBundle",              // global namespace
  minify: true,
  sourcemap: false,
}).catch(() => process.exit(1));
