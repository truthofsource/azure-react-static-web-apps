// Optional reviewed integration; not imported by the offline preview.
import {MsalProvider} from '@azure/msal-react';
import type {ReactNode} from 'react';
import {msalInstance} from './msalConfig';
export async function initializeEntra(){await msalInstance.initialize();await msalInstance.handleRedirectPromise();}
export function EntraShell({children}:{children:ReactNode}){return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;}
