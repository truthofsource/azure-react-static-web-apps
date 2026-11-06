import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {loadRuntimeConfig} from './lib/runtimeConfig';
import './style.css';
const root=createRoot(document.getElementById('root')!);
loadRuntimeConfig().then(async()=>{const {App}=await import('./App');root.render(<StrictMode><App/></StrictMode>);}).catch(error=>root.render(<main className="failure"><p className="eyebrow">Frontend configuration</p><h1>The frontend could not initialize</h1><p>{error instanceof Error?error.message:'Review the public runtime configuration.'}</p><p>No sign-in or API request was started. Review the configuration file, then reload.</p><button onClick={()=>location.reload()}>Reload configuration</button></main>));
