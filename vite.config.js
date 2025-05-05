import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import react from '@vitejs/plugin-react'

export default defineConfig({
	publicDir: 'public',
	plugins: [tsconfigPaths(), svgr(), react()],
	base: '/app',
});
