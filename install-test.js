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
	// Our own jar's file name changes between versions, and two Espresso jars can't load together,
	// so move any older one aside (into old-espresso-jars/, not deleted) before copying the new one.
	const ours = fs.readdirSync(path.join(ROOT, 'build', 'stage', 'overrides', 'mods'));
	for (const jar of fs.readdirSync(path.join(dir, 'mods'))) {
		if (/^espresso-flavoured.*\.jar$/i.test(jar) && !ours.includes(jar)) {
			fs.mkdirSync(path.join(dir, 'old-espresso-jars'), { recursive: true });
			fs.renameSync(path.join(dir, 'mods', jar), path.join(dir, 'old-espresso-jars', jar));
			console.log(`moved the old ${jar} to old-espresso-jars/`);
		}
	}
	fs.cpSync(path.join(ROOT, 'build', 'stage', 'overrides'), dir, { recursive: true });
	// A player's launcher also applies client-overrides (a test install is a player's game).
	const clientOverrides = path.join(ROOT, 'build', 'stage', 'client-overrides');
	if (fs.existsSync(clientOverrides)) {
		fs.cpSync(clientOverrides, dir, { recursive: true });
	}
	console.log(`installed ${n} files (sha1 verified) + overrides into ${dir}`);
})().catch(e => { console.error(e.message); process.exit(1); });
