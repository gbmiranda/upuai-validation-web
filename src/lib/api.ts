import type { Document, PagedResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, options);
	if (!res.ok) {
		const text = await res.text().catch(() => res.statusText);
		throw new Error(`${res.status}: ${text}`);
	}
	if (res.status === 204) return undefined as T;
	return res.json();
}

export const api = {
	listDocuments(params: { category?: string; status?: string; page?: number; size?: number } = {}) {
		const q = new URLSearchParams();
		if (params.category) q.set('category', params.category);
		if (params.status) q.set('status', params.status);
		if (params.page != null) q.set('page', String(params.page));
		if (params.size != null) q.set('size', String(params.size));
		return request<PagedResponse<Document>>(`/api/documents?${q}`);
	},

	getDocument(id: string) {
		return request<Document>(`/api/documents/${id}`);
	},

	uploadDocument(file: File, name: string, category?: string) {
		const form = new FormData();
		form.append('file', file);
		form.append('name', name);
		if (category) form.append('category', category);
		return request<Document>('/api/documents', { method: 'POST', body: form });
	},

	updateDocument(id: string, name: string, category?: string) {
		return request<Document>(`/api/documents/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, category })
		});
	},

	deleteDocument(id: string) {
		return request<void>(`/api/documents/${id}`, { method: 'DELETE' });
	},

	getDownloadUrl(id: string) {
		return request<{ url: string }>(`/api/documents/${id}/download`);
	},

	listCategories() {
		return request<string[]>('/api/documents/categories');
	}
};
