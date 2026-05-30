export type Tag = {
  id: string;
  name: string;
  color: string;
  notebookId?: string | null;
  sortOrder?: number;
  noteCount: number;
  createdAt?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  isArchived: boolean;
  isPinned: boolean;
  sortOrder: number;
  notebookId?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
};

export type Notebook = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  folderId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Folder = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  notebooks?: Notebook[];
};

export type Notification = {
  id: string;
  type: string;
  message: string;
  metadata?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type AcceptWorkspaceInviteResult = {
  acceptWorkspaceInvite: { success: boolean; message: string };
};

export type WorkspaceQueryResult = {
  folders: Folder[];
  notebooks: Notebook[];
  notes: Note[];
  tags: Tag[];
};

export type NoteQueryResult = {
  note: Note & { tags: Tag[] };
};

export type CreateNoteResult = { createNote: Note };
export type UpdateNoteResult = { updateNote: Note };
export type CreateNotebookResult = { createNotebook: Notebook };
export type CreateFolderResult = { createFolder: Folder };
export type CreateTagResult = { createTag: Tag };
export type UpdateTagResult = { updateTag: Tag };
export type WorkspaceTagsQueryResult = { workspaceTags: Tag[] };
export type ArchivedNotesQueryResult = { notes: Note[] };
export type NotificationsQueryResult = { notifications: Notification[] };

export type WorkspaceCollaborator = {
  id: string;
  name?: string | null;
  email: string;
  status: "SELF" | "MEMBER" | "PENDING_INVITE" | "NOTE_COLLABORATOR";
  permission?: string | null;
  noteId?: string | null;
  inviteId?: string | null;
};

export type CancelWorkspaceInviteResult = {
  cancelWorkspaceInvite: { success: boolean; message: string };
};

export type WorkspaceCollaboratorsQueryResult = {
  workspaceCollaborators: WorkspaceCollaborator[];
};

export type NoteShare = {
  id: string;
  noteId: string;
  sharedWithUserId: string;
  permission: string;
  createdAt: string;
  sharedWithUser?: { id: string; name: string; email: string } | null;
};

export type NoteSharesQueryResult = { noteShares: NoteShare[] };
export type SharePageResult = { sharePageWithCollaborator: NoteShare };
export type InviteWorkspaceMemberResult = {
  inviteWorkspaceMember: { success: boolean; message: string };
};

export type AppEventPayload = {
  appEvent: {
    action: string;
    entityId?: string;
    note?: Pick<Note, "id" | "title" | "content" | "color" | "isArchived" | "isPinned" | "updatedAt">;
  };
};

export type SnapsPanelPreferences = {
  showCaptions: boolean;
  compactCards: boolean;
  sortNewestFirst: boolean;
};

export type UserPreferences = {
  sidebarCollapsed: boolean;
  snapsPanel: SnapsPanelPreferences;
};

export type Snap = {
  id: string;
  title: string;
  caption?: string | null;
  fileId: string;
  mimeType: string;
  notebookId?: string | null;
  noteId?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SnapsQueryResult = { snaps: Snap[] };
export type CreateSnapResult = { createSnap: Snap };
export type UpdateSnapResult = { updateSnap: Snap };

export type PageShareLinkQueryResult = {
  pageShareLink: { path: string; title: string };
};

export type MeUser = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  age?: number | null;
  preferences: UserPreferences;
};

export type MeQueryResult = { me: MeUser | null };

export type UpdateMyProfileResult = { updateMyProfile: MeUser };
export type UpdateMyPreferencesResult = {
  updateMyPreferences: UserPreferences;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  allDay: boolean;
  color: string;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventsQueryResult = {
  calendarEvents: CalendarEvent[];
};

export type CreateCalendarEventResult = {
  createCalendarEvent: CalendarEvent;
};

export type UpdateCalendarEventResult = {
  updateCalendarEvent: CalendarEvent;
};

export type Graph = {
  id: string;
  title: string;
  description?: string | null;
  nodesJson: string;
  edgesJson: string;
  viewportJson?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GraphListItem = Pick<
  Graph,
  "id" | "title" | "description" | "nodesJson" | "edgesJson" | "createdAt" | "updatedAt"
>;

export type GraphsQueryResult = { graphs: GraphListItem[] };
export type GraphQueryResult = { graph: Graph };
export type CreateGraphResult = { createGraph: Graph };
export type UpdateGraphResult = { updateGraph: Graph };
