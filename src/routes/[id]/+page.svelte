<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import type { Document } from '$lib/types';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let doc = $state<Document | null>(null);
	let error = $state('');
	let editing = $state(false);
	let editName = $state('');
	let editCategory = $state('');
	let saving = $state(false);
	let downloading = $state(false);

	const id = page.params.id;

	async function load() {
		try {
			doc = await api.getDocument(id);
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'Failed to load';
		}
	}

	async function download() {
		downloading = true;
		try {
			const { url } = await api.getDownloadUrl(id);
			window.open(url, '_blank');
		} catch (e: unknown) {
			alert(e instanceof Error ? e.message : 'Download failed');
		} finally {
			downloading = false;
		}
	}

	async function save() {
		if (!editName.trim()) return;
		saving = true;
		try {
			doc = await api.updateDocument(id, editName.trim(), editCategory.trim() || undefined);
			editing = false;
		} catch (e: unknown) {
			alert(e instanceof Error ? e.message : 'Save failed');
		} finally {
			saving = false;
		}
	}

	async function deleteDoc() {
		if (!confirm('Delete this document permanently?')) return;
		try {
			await api.deleteDocument(id);
			goto('/');
		} catch (e: unknown) {
			alert(e instanceof Error ? e.message : 'Delete failed');
		}
	}

	function startEdit() {
		if (!doc) return;
		editName = doc.name;
		editCategory = doc.category ?? '';
		editing = true;
	}

	function formatSize(bytes: number | null) {
		if (bytes == null) return '—';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	onMount(load);
</script>

<svelte:head>
	<title>{doc ? doc.name : 'Document'} — Upuai Validation</title>
</svelte:head>

<a href="/" class="back">← Back to Documents</a>

{#if error}
	<p class="error">{error}</p>
{:else if !doc}
	<p class="loading">Loading...</p>
{:else}
	<div class="detail-header">
		{#if editing}
			<div class="edit-fields">
				<input type="text" bind:value={editName} placeholder="Document name" />
				<input type="text" bind:value={editCategory} placeholder="Category" />
			</div>
			<div class="edit-actions">
				<button onclick={save} disabled={saving} class="btn-primary">
					{saving ? 'Saving...' : 'Save'}
				</button>
				<button onclick={() => editing = false} class="btn-secondary">Cancel</button>
			</div>
		{:else}
			<div>
				<h1>{doc.name}</h1>
				<p class="filename">{doc.filename}</p>
			</div>
			<div class="actions">
				<StatusBadge status={doc.status} />
				<button onclick={download} disabled={downloading} class="btn-secondary">
					{downloading ? '...' : '⬇ Download'}
				</button>
				<button onclick={startEdit} class="btn-secondary">✏ Edit</button>
				<button onclick={deleteDoc} class="btn-danger">🗑 Delete</button>
			</div>
		{/if}
	</div>

	<div class="card">
		<table class="meta-table">
			<tbody>
				<tr><td>Category</td><td>{doc.category || '—'}</td></tr>
				<tr><td>File size</td><td>{formatSize(doc.fileSize)}</td></tr>
				<tr><td>Content type</td><td>{doc.contentType || '—'}</td></tr>
				<tr><td>Status</td><td><StatusBadge status={doc.status} /></td></tr>
				<tr><td>Created</td><td>{new Date(doc.createdAt).toLocaleString()}</td></tr>
				<tr><td>Updated</td><td>{new Date(doc.updatedAt).toLocaleString()}</td></tr>
				{#if doc.metadata}
					<tr>
						<td>Metadata</td>
						<td><pre class="metadata">{JSON.stringify(JSON.parse(doc.metadata), null, 2)}</pre></td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.back { font-size: 0.9rem; color: #6c757d; text-decoration: none; display: block; margin-bottom: 16px; }
	.back:hover { color: #4361ee; }
	.loading, .error { text-align: center; padding: 40px; color: #6c757d; }
	.error { color: #dc3545; }

	.detail-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}
	h1 { margin: 0 0 4px; font-size: 1.5rem; }
	.filename { margin: 0; color: #6c757d; font-size: 0.85rem; }

	.actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

	.edit-fields { display: flex; flex-direction: column; gap: 8px; flex: 1; max-width: 400px; }
	.edit-fields input {
		padding: 7px 12px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		font-size: 1rem;
	}
	.edit-actions { display: flex; gap: 8px; align-items: flex-start; padding-top: 4px; }

	.card {
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 10px;
		padding: 24px;
	}

	.meta-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	.meta-table td { padding: 10px 12px; border-bottom: 1px solid #f1f3f5; vertical-align: top; }
	.meta-table td:first-child { font-weight: 600; color: #495057; width: 160px; }

	.metadata {
		margin: 0;
		font-size: 0.8rem;
		background: #f8f9fa;
		padding: 8px;
		border-radius: 4px;
		white-space: pre-wrap;
	}

	.btn-primary {
		padding: 7px 16px; background: #4361ee; color: white;
		border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600;
	}
	.btn-primary:hover:not(:disabled) { background: #3251d4; }

	.btn-secondary {
		padding: 7px 14px; background: white; color: #495057;
		border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
	}
	.btn-secondary:hover:not(:disabled) { background: #f8f9fa; }

	.btn-danger {
		padding: 7px 14px; background: white; color: #dc3545;
		border: 1px solid #dc3545; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
	}
	.btn-danger:hover { background: #f8d7da; }

	button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
