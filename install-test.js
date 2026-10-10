// Installs dist/<pack>.mrpack's contents into a plain game folder for testing, the way a
// launcher would: downloads every client file, checks its sha1, then copies the overrides.
//   node install-test.js <game dir>
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = __dirname;
const dir = path.resolve(process.argv[2]);
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'stage', 'modrinth.index.json'), 'utf8'));

(async () => {
	fs.mkdirSync(path.join(dir, 'mods'), { recursive: true });
	let n = 0;
	for (const f of index.files) {
		if (f.env && f.env.client === 'unsupported') continue;
		const dest = path.join(dir, f.path);
		if (fs.existsSync(dest) && crypto.createHash('sha1').update(fs.readFileSync(dest)).digest('hex') === f.hashes.sha1) { n++; continue; }
		const buf = Buffer.from(await (await fetch(f.downloads[0], { headers: { 'User-Agent': 'gabmaybelle/espresso-flavoured-pack (test install)' } })).arrayBuffer());
		const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
		if (sha1 !== f.hashes.sha1) throw new Error(`hash mismatch for ${f.path}`);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.writeFileSync(dest, buf);
		n++;
	}
	fs.cpSync(path.join(ROOT, 'build', 'stage', 'overrides'), dir, { recursive: true });
	console.log(`installed ${n} files (sha1 verified) + overrides into ${dir}`);
})().catch(e => { console.error(e.message); process.exit(1); });
