import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"

export default defineConfig({
	plugins: [
		
	],
	build: {
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL("./index.html", import.meta.url)),
				notFound: fileURLToPath(new URL("./404.html", import.meta.url))
			}
		}
	}
})
