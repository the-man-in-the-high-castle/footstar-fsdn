/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_FSDN_PROGRAM_ID: number;
  readonly VITE_API_URL_PATH: string;
  readonly VITE_API_URL: string;
  readonly VITE_FS_URL: string;
  readonly VITE_VERSION: string;
}
