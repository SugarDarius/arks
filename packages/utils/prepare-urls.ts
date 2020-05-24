import * as url from 'url';
import address from 'address';

export type PrepareddUrls = {
    lanUrlForConfig?: string;
    lanUrlForTerminal: string;
    localUrlForTerminal: string;
    localUrlForBrowser: string;
};

export function prepareUrls(protocol: string, host: string, port: number): PrepareddUrls {
    let prettyHost = '', lanUrlForConfig: string | undefined, lanUrlForTerminal = '';
    const formatUrl = (hostname: string): string => url.format({
        protocol,
        hostname,
        port,
        pathname: '/'
    });

    const isUnpecifiedHost: boolean = host === '0.0.0.0' || host === '::';
    if (isUnpecifiedHost) {
        prettyHost = 'localhost';

        try {
            lanUrlForConfig = address.ip();
            if (lanUrlForConfig) {
                if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
                    lanUrlForTerminal = formatUrl(lanUrlForConfig);
                }
                else {
                    lanUrlForConfig = undefined;
                }
            }
        }
        /* eslint-disable-next-line */
        catch (err) { }
    }
    else { 
        prettyHost = host;
    }

    return {
        lanUrlForConfig,
        lanUrlForTerminal,
        localUrlForBrowser: formatUrl(prettyHost),
        localUrlForTerminal: formatUrl(prettyHost),
    };
}