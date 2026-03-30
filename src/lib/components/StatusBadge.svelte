<script lang="ts">
	import type { DocumentStatus } from '$lib/types';

	let { status }: { status: DocumentStatus } = $props();
</script>

<span class="badge badge-{status.toLowerCase()}">
	{#if status === 'PROCESSING'}
		⏳ Processing
	{:else if status === 'READY'}
		✓ Ready
	{:else}
		✗ Error
	{/if}
</span>

<style>
	.badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 12px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.badge-processing {
		background: #fff3cd;
		color: #856404;
		border: 1px solid #ffc107;
	}
	.badge-ready {
		background: #d1e7dd;
		color: #0a3622;
		border: 1px solid #20c997;
	}
	.badge-error {
		background: #f8d7da;
		color: #58151c;
		border: 1px solid #dc3545;
	}
</style>
