<script lang="ts">
	let { children } = $props();
</script>

<header>
	<nav>
		<a href="/" class="logo">📄 Upuai Docs</a>
		<a href="/">Documents</a>
		<a href="/upload" class="btn-upload">+ Upload</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #f8f9fa;
		color: #212529;
	}
	:global(a) { color: #4361ee; }

	header {
		background: white;
		border-bottom: 1px solid #dee2e6;
		padding: 0 24px;
	}
	nav {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 24px;
		height: 56px;
	}
	.logo {
		font-weight: 700;
		font-size: 1.1rem;
		color: #212529;
		text-decoration: none;
		margin-right: auto;
	}
	nav a { text-decoration: none; color: #495057; font-size: 0.95rem; }
	nav a:hover { color: #4361ee; }

	.btn-upload {
		background: #4361ee;
		color: white !important;
		padding: 6px 16px;
		border-radius: 6px;
		font-weight: 600;
	}
	.btn-upload:hover { background: #3251d4 !important; color: white !important; }

	main {
		max-width: 1100px;
		margin: 0 auto;
		padding: 32px 24px;
	}
</style>
