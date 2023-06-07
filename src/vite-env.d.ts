/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_FSDN_PROGRAM_ID: string;
  readonly VITE_API_URL_PATH: string;
  readonly VITE_API_URL: string;
  readonly VITE_FS_URL: string;
  readonly VITE_VERSION: string;
  readonly VITE_TRANSLATION_SERVER: string;
  readonly VITE_TRANSLATION_PROJECT_ID: string;
  readonly VITE_TRANSLATION_CLIENT_ID: string;
  readonly VITE_TRANSLATION_CLIENT_SECRET: string;
  readonly VITE_TRANSLATION_TRADUORA: string | undefined;
}
