import importlib.util,json,pathlib,tempfile,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('prepare_site',ROOT/'scripts/prepare_site.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class StagingTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.tmp.name);self.site=self.root/'dist';self.site.mkdir()
        (self.site/'index.html').write_text('<div id="root"></div>');(self.site/'app.js').write_text('compiled bytes')
        (self.site/'staticwebapp.config.json').write_bytes((ROOT/'frontend/public/staticwebapp.config.json').read_bytes())
        (self.site/'workforce-runtime-config.json').write_text('{}')
    def tearDown(self):self.tmp.cleanup()
    def test_two_destinations_preserve_bundle_but_change_config(self):
        a=module.stage(self.site,ROOT/'config/nonproduction.example.json',self.root/'np');b=module.stage(self.site,ROOT/'config/production.example.json',self.root/'prod')
        self.assertEqual(a['bundleManifestSha256'],b['bundleManifestSha256']);self.assertNotEqual(a['runtimeConfigSha256'],b['runtimeConfigSha256']);self.assertFalse(a['published'])
    def test_existing_output_and_overlap_fail(self):
        with self.assertRaises(ValueError):module.stage(self.site,ROOT/'config/production.example.json',self.site/'nested')
        output=self.root/'existing';output.mkdir()
        with self.assertRaises(FileExistsError):module.stage(self.site,ROOT/'config/production.example.json',output)
    def test_csp_mismatch_rejected_before_output(self):
        value=json.loads((ROOT/'config/production.example.json').read_text());value['apiBaseUrl']='https://another-example.azurewebsites.net';p=self.root/'config.json';p.write_text(json.dumps(value))
        with self.assertRaises(ValueError):module.stage(self.site,p,self.root/'out')
        self.assertFalse((self.root/'out').exists())
    def test_unknown_config_field_rejected(self):
        value=json.loads((ROOT/'config/production.example.json').read_text());value['unknown']='value';p=self.root/'config.json';p.write_text(json.dumps(value))
        with self.assertRaises(ValueError):module.stage(self.site,p,self.root/'out')
