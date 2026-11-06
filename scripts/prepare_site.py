"""Stage prebuilt public assets and validated destination config. No deployment."""
import argparse,hashlib,json,pathlib,shutil,sys
from urllib.parse import urlsplit
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'reference'))
from web_runtime_config import validate
CONFIG='workforce-runtime-config.json'
def stage(site,configuration,output):
    site=pathlib.Path(site).resolve();output=pathlib.Path(output).resolve()
    if site==output or site in output.parents or output in site.parents:raise ValueError('Source/output directories must not overlap')
    if output.exists():raise FileExistsError('Choose a new owned staging directory')
    value=validate(json.loads(pathlib.Path(configuration).read_text(encoding='utf-8')))
    if not (site/'index.html').is_file() or not (site/'staticwebapp.config.json').is_file():raise ValueError('Build index/config missing')
    swa=json.loads((site/'staticwebapp.config.json').read_text(encoding='utf-8'))
    api=urlsplit(value['apiBaseUrl']);origin=api.scheme+'://'+api.netloc
    csp=swa['globalHeaders']['Content-Security-Policy'];connect=next((s.strip().split()[1:] for s in csp.split(';') if s.strip().startswith('connect-src ')),[])
    if origin not in connect:raise ValueError('Destination API must also be permitted by the reviewed CSP')
    files={}
    for path in site.rglob('*'):
        if path.is_symlink():raise ValueError('Symlink in static output')
        if path.is_file() and path.relative_to(site).as_posix()!=CONFIG:files[path.relative_to(site).as_posix()]=hashlib.sha256(path.read_bytes()).hexdigest()
    output.mkdir(parents=True)
    for name,digest in files.items():
        target=output/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(site/name,target)
        if hashlib.sha256(target.read_bytes()).hexdigest()!=digest:raise ValueError('Copied asset changed')
    (output/CONFIG).write_text(json.dumps(value,sort_keys=True,separators=(',',':'))+'\n',encoding='utf-8')
    return {'compiledAndStaticFilesPreserved':len(files),'bundleManifestSha256':hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest(),'runtimeConfigSha256':hashlib.sha256((output/CONFIG).read_bytes()).hexdigest(),'published':False}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--site',type=pathlib.Path,default=pathlib.Path('frontend/dist'));p.add_argument('--config',required=True,type=pathlib.Path);p.add_argument('--output',required=True,type=pathlib.Path);a=p.parse_args();print(json.dumps(stage(a.site,a.config,a.output)))
