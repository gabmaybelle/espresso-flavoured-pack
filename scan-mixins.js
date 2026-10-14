// Lists every mixin in a mods folder (including jars nested inside jars) that targets one
// of the Minecraft classes our own mods (Cozy Core, Spawn Gazebo) hook, so overlaps can be checked by hand.
//   node scan-mixins.js <mods dir>
const fs = require('fs'), path = require('path');
const { readZipBuffer } = require('./pack-files');

const TARGETS = [
	// Cozy Core's rules and the Hearth Lantern.
	'net/minecraft/world/level/ServerExplosion',
	'net/minecraft/world/entity/monster/Enderman$EndermanTakeBlockGoal',
	'net/minecraft/world/level/block/FireBlock',
	'net/minecraft/world/level/NaturalSpawner',
	'net/minecraft/world/level/gamerules/GameRule',
	// The spawn gazebo's protection.
	'net/minecraft/world/level/block/piston/PistonBaseBlock',
	'net/minecraft/world/item/BlockItem',
	'net/minecraft/world/item/BucketItem',
];

const hits = [];
function scanJar(buf, label) {
	const files = readZipBuffer(buf);
	for (const name of files.keys()) if (/^META-INF\/jars\/.*\.jar$/.test(name)) scanJar(files.get(name)(), `${label} > ${path.basename(name)}`);
	const modJson = files.get('fabric.mod.json');
	if (!modJson) return;
	let meta; try { meta = JSON.parse(modJson().toString('utf8')); } catch { return; }
	for (const cfg of (meta.mixins || []).map(m => typeof m === 'string' ? m : m.config)) {
		const cfgEntry = files.get(cfg); if (!cfgEntry) continue;
		let mix; try { mix = JSON.parse(cfgEntry().toString('utf8')); } catch { continue; }
		const pkg = (mix.package || '').replace(/\./g, '/');
		for (const cls of [...(mix.mixins || []), ...(mix.client || []), ...(mix.server || [])]) {
			const entry = files.get(`${pkg}/${cls.replace(/\./g, '/')}.class`); if (!entry) continue;
			const bytes = entry().toString('latin1');
			for (const t of TARGETS) {
				// A @Mixin target appears as a class literal (L...;) in the class file's constant pool.
				if (bytes.includes(`L${t};`) && bytes.includes('Lorg/spongepowered/asm/mixin/Mixin;')) {
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
