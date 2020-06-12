
import { getProcessDirectoryName } from '@arks/utils';

// FROM server config
export const APP_NAME = `${getProcessDirectoryName().replace(/\s+/g, '-')}`;

export const NO_METRICS = false;
export const NO_LIVENESS = false;
export const METRICS_ENDPOINT = '/metrics';
export const LIVENESS_ENDPOINT = '/liveness';

export const NO_HELMET = false;
export const NO_CORS = false;
export const NO_LIMIT = false;
export const NO_BODY_PARSER = false;
export const NO_COOKIE_PARSER = false;
export const NO_COMPRESSION = false;

export const NO_LOGGER = false;

export const LIMIT_SKIPPED_ROUTES = [METRICS_ENDPOINT, LIVENESS_ENDPOINT];

export const PUBLIC_DIRECTORY_PATH = 'public';
export const BUILD_DIRECTORY_PATH = 'build';

// FROM ENV
export const PORT = 3000;
export const HOST = 'localhost';
export const PROTOCOL = 'http';

export const GRAPHQL_API_ENDPOINT = '';

export const METRICS_COLLECT_TIMEOUT = 5000;
export const HTTP_TIMEOUT = 10000;
export const LIMIT_WINDOWS_TIME_FRAME_MS = 15 * 60 * 1000;
export const LIMIT_MAX_REQUESTS_PER_IP = 200;  

// Cannot be changed
export const BUILD_ID = 'build-id';
export const SERVER_CONFIG_FILE = 'arks.server.config.js';