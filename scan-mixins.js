// Lists every mixin in a mods folder (including jars nested inside jars) that targets one
// of the Minecraft classes Espresso Flavoured hooks, so overlaps can be checked by hand.
//   node scan-mixins.js <mods dir>
const fs = require('fs'), path = require('path'), zlib = require('zlib');

const TARGETS = [
	'net/minecraft/world/entity/monster/Creeper',
	'net/minecraft/world/entity/monster/Enderman$EndermanTakeBlockGoal',
	'net/minecraft/world/level/levelgen/PhantomSpawner',
	'net/minecraft/world/level/NaturalSpawner',
	'net/minecraft/world/entity/npc/wanderingtrader/WanderingTrader',
	'net/minecraft/world/item/component/BundleContents',
	'net/minecraft/world/food/FoodData',
	'net/minecraft/world/entity/Mob',
	'net/minecraft/world/entity/MobCategory',
	'net/minecraft/server/level/ServerChunkCache',
	'net/minecraft/world/entity/player/Player',
	'net/minecraft/client/player/AbstractClientPlayer',
	'net/minecraft/world/entity/LivingEntity',
	'net/minecraft/world/entity/player/Inventory',
];

function entries(buf) {
	let eocd = buf.length - 22;
	while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
	const out = [], count = buf.readUInt16LE(eocd + 10);
	let p = buf.readUInt32LE(eocd + 16);
	for (let i = 0; i < count; i++) {
		const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
		const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
		const local = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nlen);
		out.push({ name, read: () => {
			const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
			const data = buf.subarray(start, start + csize);
			return method === 8 ? zlib.inflateRawSync(data) : Buffer.from(data);
		} });
		p += 46 + nlen + xlen + clen;
	}
	return out;
}

const hits = [];
function scanJar(buf, label) {
	const files = entries(buf);
	const byName = Object.fromEntries(files.map(e => [e.name, e]));
	for (const e of files) if (/^META-INF\/jars\/.*\.jar$/.test(e.name)) scanJar(e.read(), `${label} > ${path.basename(e.name)}`);
	const modJson = byName['fabric.mod.json'];
	if (!modJson) return;
	let meta; try { meta = JSON.parse(modJson.read().toString('utf8')); } catch { return; }
	for (const cfg of (meta.mixins || []).map(m => typeof m === 'string' ? m : m.config)) {
		const cfgEntry = byName[cfg]; if (!cfgEntry) continue;
		let mix; try { mix = JSON.parse(cfgEntry.read().toString('utf8')); } catch { continue; }
		const pkg = (mix.package || '').replace(/\./g, '/');
		for (const cls of [...(mix.mixins || []), ...(mix.client || []), ...(mix.server || [])]) {
			const entry = byName[`${pkg}/${cls.replace(/\./g, '/')}.class`]; if (!entry) continue;
			const bytes = entry.read().toString('latin1');
			for (const t of TARGETS) {
				// @Mixin targets appear as class literals (L...;) or as dotted/slashed strings.
				if (bytes.includes(`L${t};`) && bytes.includes('Lorg/spongepowered/asm/mixin/Mixin;')) {
					const target = bytes.match(/Lorg\/spongepowered\/asm\/mixin\/Mixin;/) ? t : t;
					hits.push({ mod: `${meta.id} (${label})`, mixin: `${pkg}/${cls}`, target: t.split('/').pop() });
				}
			}
		}
	}
}

const dir = process.argv[2];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jar'))) scanJar(fs.readFileSync(path.join(dir, f)), f);
const byTarget = {};
for (const h of hits) (byTarget[h.target] ??= []).push(`${h.mod.split(' (')[0]}: ${h.mixin.split('/').pop()}`);
for (const [t, list] of Object.entries(byTarget).sort()) console.log(`== ${t}\n  ` + [...new Set(list)].join('\n  '));
