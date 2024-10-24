/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL:           string
	readonly VITE_SESSION_SECRET:    string
	readonly VITE_APP_STORE_APPLE:   string
	readonly VITE_APP_STORE_ANDROID: string
	readonly VITE_API_URL_REWRITE:   string
}

export {}
