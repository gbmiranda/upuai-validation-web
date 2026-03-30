<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import FileUpload from '$lib/components/FileUpload.svelte';

	async function handleUpload(file: File, name: string, category: string) {
		await api.uploadDocument(file, name, category || undefined);
		goto('/');
	}
</script>

<svelte:head><title>Upload — Upuai Validation</title></svelte:head>

<div class="upload-page">
	<a href="/" class="back">← Back to Documents</a>
	<h1>Upload Document</h1>
	<div class="card">
		<FileUpload onUpload={handleUpload} />
	</div>
</div>

<style>
	.upload-page { max-width: 560px; }
	.back { font-size: 0.9rem; color: #6c757d; text-decoration: none; }
	.back:hover { color: #4361ee; }
	h1 { margin: 16px 0 24px; font-size: 1.5rem; }
	.card {
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 10px;
		padding: 28px;
	}
</style>
