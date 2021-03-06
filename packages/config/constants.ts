
import { getProcessDirectoryName } from '@arks/utils';

// From Arks json file
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

// From CLI commmand option or ENV
export const PORT = 8080;
export const HOST = '0.0.0.0';
export const PROTOCOL = 'http';

// From ENV
export const GRAPHQL_API_ENDPOINT = '';

export const METRICS_COLLECT_TIMEOUT = 5000;
export const HTTP_TIMEOUT = 10000;
export const LIMIT_WINDOWS_TIME_FRAME_MS = 15 * 60 * 1000;
export const LIMIT_MAX_REQUESTS_PER_IP = 200;  

// Cannot be changed
export const BUILD_ID = 'build-id';
export const DOT_ENV_FILE = '.env';
export const CONFIG_FILE = 'arks.json';
export const SOURCE_DIRECTORY_PATH = 'src';
export const PUBLIC_DIRECTORY_PATH = 'public';
export const APP_COMPONENT_FILENAME = 'app.tsx';
export const COMPILED_CLIENT_SOURCE_DIRECTORY_PATH = '.arks/build';
export const COMPILED_SERVER_SOURCE_DIRECTORY_PATH = '.arks/server';
export const COMPILED_CLIENT_BUNDLE_FILENAME = 'client.bundle.js';
export const COMPILED_APP_COMPONENT_FILENAME = 'app.js';
export const REACT_APP_CLIENT_ENTRY_FILE_PATH = '.arks/client/entry.tsx';
export const REACT_APP_CLIENT_ROOT_FILE_PATH = '.arks/client/root.tsx';
export const REACT_APP_ROOT_NODE_ID = 'arks-react-app';
export const INTERNAL_GRAPHQL_ENDPOINT = '/graphql';