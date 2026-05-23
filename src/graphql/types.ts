export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  isArchived: boolean;
  isPinned: boolean;
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
  isRead: boolean;
  createdAt: string;
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
export type ArchivedNotesQueryResult = { notes: Note[] };
export type NotificationsQueryResult = { notifications: Notification[] };

export type UserPreferences = {
  sidebarCollapsed: boolean;
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
  | "id"
  | "title"
  | "description"
  | "nodesJson"
  | "edgesJson"
  | "createdAt"
  | "updatedAt"
>;

export type GraphsQueryResult = { graphs: GraphListItem[] };
export type GraphQueryResult = { graph: Graph };
export type CreateGraphResult = { createGraph: Graph };
export type UpdateGraphResult = { updateGraph: Graph };
