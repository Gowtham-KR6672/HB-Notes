export type Attachment = {
  url: string;
  resourceType: string;
  mimeType: string;
  originalName: string;
  bytes: number;
};

export type Note = {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isTrashed: boolean;
  shareId?: string;
};

export type NotesResponse = {
  notes: Note[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
