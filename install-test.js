// Installs the built .mrpack into a plain game folder for testing, the way a launcher would: every
// client file, downloaded and sha1-checked, then the overrides and client-overrides. Run it again
// after a rebuild: what the pack no longer has goes into old-pack-files/, nothing is deleted.
//   node install-test.js <game dir>
const path = require('path');
const { readZip, builtPack, packIndex, installFiles, applyOverrides } = require('./pack-files');

const dirArg = process.argv[2];
if (!dirArg) { console.error('usage: node install-test.js <game dir>'); process.exit(1); }
const dir = path.resolve(dirArg);

(async () => {
	const zip = readZip(builtPack());
	const index = packIndex(zip);
	const count = await installFiles(dir, index, f => !(f.env && f.env.client === 'unsupported'));
	// A player's launcher applies client-overrides too (a test install is a player's game).
	applyOverrides(zip, dir, ['overrides/', 'client-overrides/']);
	console.log(`installed ${count} files (sha1 verified) + overrides into ${dir}`);
})().catch(e => { console.error(e.message); process.exit(1); });
