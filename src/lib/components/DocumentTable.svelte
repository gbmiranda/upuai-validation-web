<script lang="ts">
	import type { Document } from '$lib/types';
	import StatusBadge from './StatusBadge.svelte';

	let {
		documents,
		onDelete
	}: {
		documents: Document[];
		onDelete: (id: string) => void;
	} = $props();

	function formatSize(bytes: number | null) {
		if (bytes == null) return '—';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString();
	}
</script>

{#if documents.length === 0}
	<p class="empty">No documents yet. <a href="/upload">Upload one!</a></p>
{:else}
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Category</th>
					<th>Status</th>
					<th>Size</th>
					<th>Created</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each documents as doc (doc.id)}
					<tr>
						<td>
							<a href="/{doc.id}" class="doc-name">{doc.name}</a>
							<span class="filename">{doc.filename}</span>
						</td>
						<td>{doc.category || '—'}</td>
						<td><StatusBadge status={doc.status} /></td>
						<td>{formatSize(doc.fileSize)}</td>
						<td>{formatDate(doc.createdAt)}</td>
						<td class="actions">
							<a href="/{doc.id}" class="btn-icon" title="View">👁</a>
							<button
								class="btn-icon btn-danger"
								title="Delete"
								onclick={() => onDelete(doc.id)}
							>🗑</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.empty { color: #6c757d; text-align: center; padding: 40px; }

	.table-wrapper { overflow-x: auto; }

	table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	thead th {
		background: #f8f9fa;
		padding: 10px 14px;
		text-align: left;
		font-weight: 600;
		color: #495057;
		border-bottom: 2px solid #dee2e6;
	}
	tbody tr { border-bottom: 1px solid #f1f3f5; }
	tbody tr:hover { background: #f8f9fa; }
	td { padding: 10px 14px; vertical-align: middle; }

	.doc-name { font-weight: 600; color: #4361ee; text-decoration: none; display: block; }
	.doc-name:hover { text-decoration: underline; }
	.filename { font-size: 0.78rem; color: #6c757d; }

	.actions { display: flex; gap: 6px; }
	.btn-icon {
		padding: 4px 8px;
		background: none;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		transition: background 0.1s;
	}
	.btn-icon:hover { background: #f1f3f5; }
	.btn-danger:hover { background: #f8d7da; border-color: #dc3545; }
</style>
