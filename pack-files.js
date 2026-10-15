// What the two installers (install-test.js, install-server.js) and scan-mixins.js share: reading a
// zip (an .mrpack or a mod jar), finding the built pack, and putting a pack's files in place so an
// update takes away what the pack no longer has.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib');

const ROOT = __dirname;
const UA = { 'User-Agent': 'gabmaybelle/espresso-flavoured-pack' };

/** A zip's entries (stored and deflated), name -> a function that reads the entry. Enough for an .mrpack or a jar. */
function readZipBuffer(b) {
	const entries = new Map();
	let eocd = b.length - 22;
	while (eocd >= 0 && b.readUInt32LE(eocd) !== 0x06054b50) eocd--;
	let p = b.readUInt32LE(eocd + 16);
	for (let n = b.readUInt16LE(eocd + 10); n > 0; n--) {
		const method = b.readUInt16LE(p + 10), size = b.readUInt32LE(p + 20), nameLen = b.readUInt16LE(p + 28);
		const extra = b.readUInt16LE(p + 30), comment = b.readUInt16LE(p + 32), local = b.readUInt32LE(p + 42);
		const name = b.toString('utf8', p + 46, p + 46 + nameLen);
		entries.set(name, () => {
			const start = local + 30 + b.readUInt16LE(local + 26) + b.readUInt16LE(local + 28);
			const data = b.subarray(start, start + size);
			return method === 8 ? zlib.inflateRawSync(data) : Buffer.from(data);
		});
		p += 46 + nameLen + extra + comment;
	}
	return entries;
}

const readZip = file => readZipBuffer(fs.readFileSync(file));

/** The newest .mrpack in dist/ (node build-pack.js writes it). */
function builtPack() {
	const dist = path.join(ROOT, 'dist');
	const packs = fs.existsSync(dist) ? fs.readdirSync(dist).filter(f => f.endsWith('.mrpack')) : [];
	if (!packs.length) throw new Error('no .mrpack in dist/: run node build-pack.js first');
	packs.sort((a, b) => fs.statSync(path.join(dist, b)).mtimeMs - fs.statSync(path.join(dist, a)).mtimeMs);
	return path.join(dist, packs[0]);
}

/** The pack's modrinth.index.json. */
function packIndex(zip) {
	return JSON.parse(zip.get('modrinth.index.json')().toString('utf8'));
}

/**
 * Installs the pack's downloads into a folder: every file `keep` says yes to, downloaded and
 * checked against its sha1 (a file already there with the right hash is kept). Then the files the
 * last install put in place that the pack no longer has (an older version of a mod, say) are moved
 * into old-pack-files/, not deleted, and the manifest (.pack-installed.json) is written again.
 * Files this script didn't install are left alone. Returns how many files are in place.
 */
async function installFiles(dir, index, keep) {
	const manifest = path.join(dir, '.pack-installed.json');
	const wanted = index.files.filter(keep).map(f => f.path);
	const before = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : [];
	for (const old of before) {
		if (!wanted.includes(old) && fs.existsSync(path.join(dir, old))) {
			const aside = path.join(dir, 'old-pack-files', old);
			fs.mkdirSync(path.dirname(aside), { recursive: true });
			fs.renameSync(path.join(dir, old), aside);
			console.log(`moved ${old} to old-pack-files/ (no longer in the pack)`);
		}
	}
	let count = 0;
	for (const f of index.files.filter(keep)) {
		const dest = path.join(dir, f.path);
		if (fs.existsSync(dest) && sha1(fs.readFileSync(dest)) === f.hashes.sha1) { count++; continue; }
		const body = Buffer.from(await (await fetch(f.downloads[0], { headers: UA })).arrayBuffer());
		if (sha1(body) !== f.hashes.sha1) throw new Error(`bad download: ${f.path}`);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.writeFileSync(dest, body);
		count++;
	}
	fs.writeFileSync(manifest, JSON.stringify([...wanted].sort(), null, '\t') + '\n');
	return count;
}

const sha1 = buf => crypto.createHash('sha1').update(buf).digest('hex');

/**
 * Copies the pack's override folders (the given prefixes, such as overrides/ and client-overrides/)
 * into the install. Our own jars' file names change between versions, and two versions of a mod
 * can't load together, so any other version of one of them in mods/ (the same name up to the
 * version number) is moved into old-pack-files/ first (not deleted), and so is any version of a
 * mod pack.json lists as "retired" (one the pack used to carry and has dropped).
 * Default settings under config/yosbr/ are also put in place where the install has no such file
 * yet, as the YOSBR mod does for players, so an update never resets anyone's own settings.
 */
function applyOverrides(zip, dir, prefixes) {
	const ours = [...zip.keys()].filter(n => prefixes.some(p => new RegExp(`^${p}mods/[^/]+$`).test(n))).map(n => n.split('/').pop());
	const family = jar => jar.replace(/-?\d+\.\d+.*\.jar$/i, '').toLowerCase(); // "cozy-core-0.2.0-fabric.jar" -> "cozy-core"
	// pack.json's "retired" names mods the pack used to carry as its own files and has dropped.
	// pack.json's "ownMods" are listed in the pack's file list, so installFiles has put them in mods/ already.
	const indexed = new Set(packIndex(zip).files.map(f => f.path.split('/').pop()));
	const families = [...ours.map(family), ...(require('./pack.json').ownMods || []).map(m => family(m.asset)),
		...(require('./pack.json').retired || []).map(r => r.toLowerCase())];
	const modsDir = path.join(dir, 'mods');
	for (const jar of fs.existsSync(modsDir) ? fs.readdirSync(modsDir) : []) {
		if (/\.jar$/i.test(jar) && families.includes(family(jar)) && !ours.includes(jar) && !indexed.has(jar)) {
			fs.mkdirSync(path.join(dir, 'old-pack-files'), { recursive: true });
			fs.renameSync(path.join(modsDir, jar), path.join(dir, 'old-pack-files', jar));
			console.log(`moved the old ${jar} to old-pack-files/`);
		}
	}
	for (const [name, read] of zip) {
		const prefix = prefixes.find(p => name.startsWith(p));
		if (!prefix || name.endsWith('/')) continue;
		const rel = name.slice(prefix.length);
		const data = read();
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

module.exports = { readZip, readZipBuffer, builtPack, packIndex, installFiles, applyOverrides };
