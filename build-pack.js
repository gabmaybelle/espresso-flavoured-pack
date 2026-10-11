// Builds the Espresso Flavoured .mrpack: resolves the newest Fabric 26.3 build of every mod in
// pack.json (plus their required dependencies) from Modrinth, writes modrinth.index.json,
// and zips it with the overrides folder.
//
//   node build-pack.js            -> dist/Espresso Flavoured-<version>.mrpack
//
// Requires Node 22+ (fetch).
const fs = require('fs'), path = require('path');

const ROOT = __dirname;
const pack = JSON.parse(fs.readFileSync(path.join(ROOT, 'pack.json'), 'utf8'));
const UA = { 'User-Agent': 'gabmaybelle/espresso-flavoured-pack (pack builder)' };
const api = p => fetch('https://api.modrinth.com/v2' + p, { headers: UA }).then(r => {
	if (!r.ok) throw new Error(`${r.status} ${p}`);
	return r.json();
});
const RANK = { release: 0, beta: 1, alpha: 2 };

async function newestVersion(id, loader = 'fabric') {
	const q = `?loaders=${encodeURIComponent(JSON.stringify([loader]))}&game_versions=${encodeURIComponent(JSON.stringify([pack.minecraft]))}`;
	const versions = await api(`/project/${id}/version${q}`);
	if (!versions.length) throw new Error(`no ${loader} ${pack.minecraft} build for ${id}`);
	// Prefer the newest release; fall back to the newest beta, then alpha.
	versions.sort((a, b) => RANK[a.version_type] - RANK[b.version_type] || b.date_published.localeCompare(a.date_published));
	return versions[0];
}

(async () => {
	const chosen = new Map();   // project id -> { project, version, reason }
	const deps = new Map();     // project id -> ids of the projects it requires
	const queue = pack.mods.map(slug => ({ id: slug, reason: 'listed' }));
	while (queue.length) {
		const { id, reason } = queue.shift();
		const project = await api(`/project/${id}`);
		if (chosen.has(project.id)) continue;
		if ((pack.exclude || []).includes(project.slug)) continue;
		let version;
		try {
			version = await newestVersion(project.id);
		} catch (e) {
			// Multi-loader jars sometimes list Forge-only libraries as required.
			if (reason === 'listed') throw e;
			console.warn(`skipping ${project.title} (${reason}): ${e.message}`);
			continue;
		}
		chosen.set(project.id, { project, version, reason });
		deps.set(project.id, version.dependencies.filter(d => d.dependency_type === 'required' && d.project_id).map(d => d.project_id));
		for (const dep of version.dependencies) {
			if (dep.dependency_type === 'required' && dep.project_id && !chosen.has(dep.project_id)) {
				queue.push({ id: dep.project_id, reason: `needed by ${project.title}` });
			}
		}
	}

	const side = s => (s === 'unsupported' ? 'unsupported' : s === 'required' ? 'required' : 'optional');
	// A server needs everything its server-side mods depend on, even libraries that call
	// themselves server-optional on Modrinth (Fabric API, Placeholder API, config libraries...).
	// pack.serverRequired lists extra ones, such as what the overrides (our own jar) need.
	const serverNeeds = new Set();
	const bySlug = new Map([...chosen.values()].map(c => [c.project.slug, c.project.id]));
	const visit = id => {
		// Even a "client-only" library comes along if a server mod depends on it (Rechiseled needs Fusion).
		if (serverNeeds.has(id) || !chosen.has(id)) return;
		serverNeeds.add(id);
		(deps.get(id) || []).forEach(visit);
	};
	for (const { project } of chosen.values()) if (project.server_side === 'required') visit(project.id);
	for (const slug of pack.serverRequired || []) visit(bySlug.get(slug));
	const files = [];
	for (const { project, version } of chosen.values()) {
		const file = version.files.find(f => f.primary) || version.files[0];
		const optional = (pack.optional || []).includes(project.slug);
		files.push({
			path: `mods/${file.filename}`,
			hashes: { sha1: file.hashes.sha1, sha512: file.hashes.sha512 },
			env: {
				// Always installed on the client: in singleplayer the player's game is also the
				// server, so server-only mods (RightClickHarvest) still need to be there.
				client: optional ? 'optional' : 'required',
				// An optional client-only mod (Entity Model Features) still never goes on a server.
				server: serverNeeds.has(project.id) ? 'required'
					: optional && side(project.server_side) !== 'unsupported' ? 'optional' : side(project.server_side),
			},
			downloads: [file.url],
			fileSize: file.size,
		});
	}
	// Shader packs (Iris) and resource packs from Modrinth, installed client-side only.
	const extras = [
		...(pack.shaders || []).map(slug => ({ slug, loader: 'iris', folder: 'shaderpacks', reason: 'shader' })),
		...(pack.resourcePacks || []).map(slug => ({ slug, loader: 'minecraft', folder: 'resourcepacks', reason: 'resource pack' })),
	];
	for (const { slug, loader, folder, reason } of extras) {
		const project = await api(`/project/${slug}`);
		const version = await newestVersion(project.id, loader);
		const file = version.files.find(f => f.primary) || version.files[0];
		files.push({
			path: `${folder}/${file.filename}`,
			hashes: { sha1: file.hashes.sha1, sha512: file.hashes.sha512 },
			env: { client: (pack.optional || []).includes(slug) ? 'optional' : 'required', server: 'unsupported' },
			downloads: [file.url],
			fileSize: file.size,
		});
		chosen.set(project.id, { project, version, reason });
	}
	files.sort((a, b) => a.path.localeCompare(b.path));

	const index = {
		formatVersion: 1,
		game: 'minecraft',
		versionId: pack.version,
		name: pack.name,
		summary: pack.summary,
		files,
		dependencies: { minecraft: pack.minecraft, 'fabric-loader': pack.fabricLoader },
	};

	const stage = path.join(ROOT, 'build', 'stage');
	fs.rmSync(path.join(ROOT, 'build'), { recursive: true, force: true });
	fs.mkdirSync(stage, { recursive: true });
	fs.writeFileSync(path.join(stage, 'modrinth.index.json'), JSON.stringify(index, null, '\t'));
	fs.cpSync(path.join(ROOT, 'overrides'), path.join(stage, 'overrides'), { recursive: true });

	fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
	const out = path.join(ROOT, 'dist', `${pack.name}-${pack.version}.mrpack`);
	require('./zip.js')(stage, out);

	// Human-readable summary
	const rows = [...chosen.values()].map(({ project, version, reason }) =>
		`${project.title} ${version.version_number} [${version.version_type}]${reason === 'listed' ? '' : ` (${reason})`}`);
	rows.sort((a, b) => a.localeCompare(b));
	fs.writeFileSync(path.join(ROOT, 'dist', 'mods.txt'), rows.join('\n') + '\n');
	console.log(rows.join('\n'));
	console.log(`\n${files.length} mods, written to ${out}`);
})().catch(e => { console.error(e.message); process.exit(1); });
