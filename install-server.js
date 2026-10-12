// Installs a built .mrpack as a dedicated server would: only the files marked as needed on the
// server, plus the overrides (our own jar). Checks every download's sha1. Default configs under
// config/yosbr/ are put in place only where the server has no such file yet, as the YOSBR mod
// does for players, so a pack update never resets a server's own settings.
//   node install-server.js <server folder> [--with-optional]
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib');
const ROOT = __dirname;
const [dirArg, flag] = process.argv.slice(2);
const dir = path.resolve(dirArg);
const withOptional = flag === '--with-optional';
const pack = path.join(ROOT, 'dist', fs.readdirSync(path.join(ROOT, 'dist')).find(f => f.endsWith('.mrpack')));

// A tiny zip reader (stored and deflated entries), enough for an .mrpack.
function readZip(file) {
	const b = fs.readFileSync(file), entries = new Map();
	let eocd = b.length - 22;
	while (b.readUInt32LE(eocd) !== 0x06054b50) eocd--;
	let p = b.readUInt32LE(eocd + 16);
	for (let n = b.readUInt16LE(eocd + 10); n > 0; n--) {
		const method = b.readUInt16LE(p + 10), size = b.readUInt32LE(p + 20), nameLen = b.readUInt16LE(p + 28);
		const extra = b.readUInt16LE(p + 30), comment = b.readUInt16LE(p + 32), local = b.readUInt32LE(p + 42);
		const name = b.toString('utf8', p + 46, p + 46 + nameLen);
		const start = local + 30 + b.readUInt16LE(local + 26) + b.readUInt16LE(local + 28);
		const data = b.subarray(start, start + size);
		entries.set(name, method === 8 ? zlib.inflateRawSync(data) : data);
		p += 46 + nameLen + extra + comment;
	}
	return entries;
}

(async () => {
	const zip = readZip(pack);
	const index = JSON.parse(zip.get('modrinth.index.json').toString('utf8'));
	let count = 0;
	for (const f of index.files) {
		const env = f.env ? f.env.server : 'required';
		if (env === 'unsupported' || (env === 'optional' && !withOptional)) continue;
		const res = await fetch(f.downloads[0], { headers: { 'User-Agent': 'gabmaybelle/espresso-flavoured-pack' } });
		const body = Buffer.from(await res.arrayBuffer());
		if (crypto.createHash('sha1').update(body).digest('hex') !== f.hashes.sha1) throw new Error(`bad download: ${f.path}`);
		fs.mkdirSync(path.dirname(path.join(dir, f.path)), { recursive: true });
		fs.writeFileSync(path.join(dir, f.path), body);
		count++;
	}
	// Our own jar's file name changes between versions, and two Espresso jars can't load together,
	// so move any older one aside (into old-espresso-jars/, not deleted) before copying the new one.
	const ours = [...zip.keys()].filter(n => /^(server-)?overrides\/mods\/[^/]+$/.test(n)).map(n => n.split('/').pop());
	const modsDir = path.join(dir, 'mods');
	for (const jar of fs.existsSync(modsDir) ? fs.readdirSync(modsDir) : []) {
		if (/^espresso-flavoured.*\.jar$/i.test(jar) && !ours.includes(jar)) {
			fs.mkdirSync(path.join(dir, 'old-espresso-jars'), { recursive: true });
			fs.renameSync(path.join(modsDir, jar), path.join(dir, 'old-espresso-jars', jar));
			console.log(`moved the old ${jar} to old-espresso-jars/`);
		}
	}
	for (const [name, data] of zip) {
		for (const prefix of ['overrides/', 'server-overrides/']) {
			if (name.startsWith(prefix) && !name.endsWith('/')) {
				const rel = name.slice(prefix.length);
				const out = path.join(dir, rel);
				fs.mkdirSync(path.dirname(out), { recursive: true });
				fs.writeFileSync(out, data);
				const real = rel.startsWith('config/yosbr/') && path.join(dir, rel.slice('config/yosbr/'.length));
				if (real && !fs.existsSync(real)) {
					fs.mkdirSync(path.dirname(real), { recursive: true });
					fs.writeFileSync(real, data);
				}
			}
		}
	}
	console.log(`installed ${count} server files${withOptional ? ' (with optional)' : ''} + overrides into ${dir}`);
})();
