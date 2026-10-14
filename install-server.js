// Installs the built .mrpack as a dedicated server would: only the files marked as needed on the
// server, plus the overrides (our own jar). Checks every download's sha1. Default configs under
// config/yosbr/ are put in place only where the server has no such file yet, as the YOSBR mod
// does for players, so a pack update never resets a server's own settings. Run it again after a
// pack update: what the pack no longer has goes into old-pack-files/, nothing is deleted.
//   node install-server.js <server folder> [--with-optional]
const path = require('path');
const { readZip, builtPack, packIndex, installFiles, applyOverrides } = require('./pack-files');

const [dirArg, flag] = process.argv.slice(2);
if (!dirArg) { console.error('usage: node install-server.js <server folder> [--with-optional]'); process.exit(1); }
const dir = path.resolve(dirArg);
const withOptional = flag === '--with-optional';

(async () => {
	const zip = readZip(builtPack());
	const index = packIndex(zip);
	const count = await installFiles(dir, index, f => {
		const env = f.env ? f.env.server : 'required';
		return env !== 'unsupported' && (env !== 'optional' || withOptional);
	});
	applyOverrides(zip, dir, ['overrides/', 'server-overrides/']);
	console.log(`installed ${count} server files${withOptional ? ' (with optional)' : ''} + overrides into ${dir}`);
})().catch(e => { console.error(e.message); process.exit(1); });
