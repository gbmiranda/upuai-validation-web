export type DocumentStatus = 'PROCESSING' | 'READY' | 'ERROR';

export interface Document {
	id: string;
	name: string;
	category: string | null;
	filename: string;
	contentType: string | null;
	fileSize: number | null;
	status: DocumentStatus;
	metadata: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PagedResponse<T> {
	items: T[];
	page: number;
	size: number;
	total: number;
}
