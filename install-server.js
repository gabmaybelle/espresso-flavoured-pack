// Installs a built .mrpack as a dedicated server would: only the files marked as needed on the
// server, plus the overrides (our own jar). Checks every download's sha1.
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
	for (const [name, data] of zip) {
		for (const prefix of ['overrides/', 'server-overrides/']) {
			if (name.startsWith(prefix) && !name.endsWith('/')) {
				const out = path.join(dir, name.slice(prefix.length));
				fs.mkdirSync(path.dirname(out), { recursive: true });
				fs.writeFileSync(out, data);
			}
		}
	}
	console.log(`installed ${count} server files${withOptional ? ' (with optional)' : ''} + overrides into ${dir}`);
})();
