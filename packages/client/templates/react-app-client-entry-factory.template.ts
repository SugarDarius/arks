
export const reactAppClientEntryFactoryTemplate = (nodeId: string): string => {
    return `
import * as React from 'react';
import { hydrate } from '@arks/client';

import { Root } from './root';

hydrate(Root, '${nodeId}');
    `;
}