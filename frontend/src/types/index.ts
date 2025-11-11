export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'host' | 'submitter';
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

export interface Event {
  id: string;
  name: string;
  organizationId: string;
  description?: string;
  submissionDeadline?: string;
  isActive: boolean;
}

export type SubmitterRole = 'musician' | 'speaker' | 'film-presenter';

export interface Submission {
  id: string;
  eventId: string;
  submitterId: string;
  role: SubmitterRole;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    bio: string;
    socialLinks: Record<string, string>;
  };
  assets: Asset[];
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  type: 'headshot' | 'music' | 'video' | 'document';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}