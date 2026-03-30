<script lang="ts">
	let {
		onUpload
	}: {
		onUpload: (file: File, name: string, category: string) => Promise<void>;
	} = $props();

	let file = $state<File | null>(null);
	let name = $state('');
	let category = $state('');
	let dragging = $state(false);
	let loading = $state(false);
	let error = $state('');

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const f = e.dataTransfer?.files[0];
		if (f) {
			file = f;
			if (!name) name = f.name.replace(/\.[^.]+$/, '');
		}
	}

	function onFileChange(e: Event) {
		const f = (e.target as HTMLInputElement).files?.[0];
		if (f) {
			file = f;
			if (!name) name = f.name.replace(/\.[^.]+$/, '');
		}
	}

	async function submit() {
		if (!file || !name.trim()) return;
		loading = true;
		error = '';
		try {
			await onUpload(file, name.trim(), category.trim());
			file = null;
			name = '';
			category = '';
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="upload-form">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="drop-zone"
		class:active={dragging}
		class:has-file={file != null}
		ondrop={onDrop}
		ondragover={(e) => { e.preventDefault(); dragging = true; }}
		ondragleave={() => dragging = false}
		onclick={() => document.getElementById('file-input')?.click()}
	>
		{#if file}
			<p>📄 <strong>{file.name}</strong></p>
			<p class="hint">{(file.size / 1024).toFixed(1)} KB — click to change</p>
		{:else}
			<p>📂 Drag & drop a file here</p>
			<p class="hint">or click to browse</p>
		{/if}
	</div>
	<input id="file-input" type="file" style="display:none" onchange={onFileChange} />

	<div class="fields">
		<label>
			Name *
			<input type="text" bind:value={name} placeholder="Document name" required />
		</label>
		<label>
			Category
			<input type="text" bind:value={category} placeholder="e.g. invoices, reports..." />
		</label>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<button onclick={submit} disabled={!file || !name.trim() || loading} class="btn-primary">
		{loading ? 'Uploading...' : 'Upload Document'}
	</button>
</div>

<style>
	.upload-form { display: flex; flex-direction: column; gap: 16px; }

	.drop-zone {
		border: 2px dashed #adb5bd;
		border-radius: 8px;
		padding: 40px 24px;
		text-align: center;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		color: #6c757d;
	}
	.drop-zone:hover, .drop-zone.active { border-color: #4361ee; background: #f0f4ff; }
	.drop-zone.has-file { border-color: #20c997; background: #f0fff8; color: #0a3622; }
	.drop-zone p { margin: 4px 0; }
	.drop-zone .hint { font-size: 0.85rem; }

	.fields { display: flex; flex-direction: column; gap: 12px; }
	label { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; font-weight: 500; }
	input[type="text"] {
		padding: 8px 12px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		font-size: 1rem;
	}
	input[type="text"]:focus { outline: none; border-color: #4361ee; box-shadow: 0 0 0 3px #4361ee22; }

	.error { color: #dc3545; font-size: 0.9rem; }

	.btn-primary {
		padding: 10px 20px;
		background: #4361ee;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-primary:hover:not(:disabled) { background: #3251d4; }
	.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
