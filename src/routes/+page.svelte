<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { api } from '$lib/api';
	import type { Document } from '$lib/types';
	import DocumentTable from '$lib/components/DocumentTable.svelte';

	let documents = $state<Document[]>([]);
	let total = $state(0);
	let page = $state(0);
	let categoryFilter = $state('');
	let statusFilter = $state('');
	let categories = $state<string[]>([]);
	let loading = $state(true);
	let error = $state('');
	let pollInterval: ReturnType<typeof setInterval>;

	const PAGE_SIZE = 20;

	async function load() {
		try {
			const res = await api.listDocuments({
				category: categoryFilter || undefined,
				status: statusFilter || undefined,
				page,
				size: PAGE_SIZE
			});
			documents = res.items;
			total = res.total;
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'Failed to load';
		} finally {
			loading = false;
		}
	}

	async function loadCategories() {
		try {
			categories = await api.listCategories();
		} catch {}
	}

	async function deleteDoc(id: string) {
		if (!confirm('Delete this document?')) return;
		try {
			await api.deleteDocument(id);
			await load();
		} catch (e: unknown) {
			alert(e instanceof Error ? e.message : 'Delete failed');
		}
	}

	function hasProcessing() {
		return documents.some((d) => d.status === 'PROCESSING');
	}

	onMount(() => {
		load();
		loadCategories();
		// Poll while any document is PROCESSING
		pollInterval = setInterval(() => {
			if (hasProcessing()) load();
		}, 3000);
	});

	onDestroy(() => clearInterval(pollInterval));

	$effect(() => { page; categoryFilter; statusFilter; load(); });
</script>

<svelte:head><title>Documents — Upuai Validation</title></svelte:head>

<div class="page-header">
	<h1>Documents</h1>
	<span class="total">{total} total</span>
</div>

<div class="filters">
	<select bind:value={categoryFilter} onchange={() => page = 0}>
		<option value="">All categories</option>
		{#each categories as cat}
			<option value={cat}>{cat}</option>
		{/each}
	</select>

	<select bind:value={statusFilter} onchange={() => page = 0}>
		<option value="">All statuses</option>
		<option value="PROCESSING">Processing</option>
		<option value="READY">Ready</option>
		<option value="ERROR">Error</option>
	</select>
</div>

{#if loading}
	<p class="loading">Loading...</p>
{:else if error}
	<p class="error">{error}</p>
{:else}
	<DocumentTable {documents} onDelete={deleteDoc} />

	{#if total > PAGE_SIZE}
		<div class="pagination">
			<button disabled={page === 0} onclick={() => page--}>← Prev</button>
			<span>Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
			<button disabled={(page + 1) * PAGE_SIZE >= total} onclick={() => page++}>Next →</button>
		</div>
	{/if}
{/if}

<style>
	.page-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
	h1 { margin: 0; font-size: 1.6rem; }
	.total { color: #6c757d; font-size: 0.9rem; }

	.filters { display: flex; gap: 12px; margin-bottom: 20px; }
	select {
		padding: 7px 12px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		font-size: 0.9rem;
		background: white;
	}

	.loading, .error { text-align: center; padding: 40px; color: #6c757d; }
	.error { color: #dc3545; }

	.pagination {
		display: flex;
		align-items: center;
		gap: 16px;
		justify-content: center;
		margin-top: 24px;
	}
	.pagination button {
		padding: 6px 16px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		font-size: 0.9rem;
	}
	.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
	.pagination span { color: #6c757d; font-size: 0.9rem; }
</style>
