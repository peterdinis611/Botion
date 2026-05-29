import { gql } from "@apollo/client";

export const NOTE_FIELDS = gql`
  fragment NoteFields on Note {
    id
    title
    content
    color
    isArchived
    isPinned
    notebookId
    createdAt
    updatedAt
  }
`;

export const FOLDER_FIELDS = gql`
  fragment FolderFields on Folder {
    id
    name
    color
    sortOrder
    createdAt
    updatedAt
  }
`;

export const NOTEBOOK_FIELDS = gql`
  fragment NotebookFields on Notebook {
    id
    name
    color
    sortOrder
    folderId
    createdAt
    updatedAt
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      bio
      age
      preferences {
        sidebarCollapsed
        snapsPanel {
          showCaptions
          compactCards
          sortNewestFirst
        }
      }
    }
  }
`;

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      email
      bio
      age
      preferences {
        sidebarCollapsed
      }
    }
  }
`;

export const UPDATE_MY_PREFERENCES_MUTATION = gql`
  mutation UpdateMyPreferences($input: UpdateUserPreferencesInput!) {
    updateMyPreferences(input: $input) {
      sidebarCollapsed
      snapsPanel {
        showCaptions
        compactCards
        sortNewestFirst
      }
    }
  }
`;

export const WORKSPACE_QUERY = gql`
  query Workspace {
    folders {
      ...FolderFields
      notebooks {
        ...NotebookFields
      }
    }
    notebooks {
      ...NotebookFields
    }
    notes(includeArchived: false) {
      ...NoteFields
    }
    tags {
      id
      name
      color
    }
  }
  ${FOLDER_FIELDS}
  ${NOTEBOOK_FIELDS}
  ${NOTE_FIELDS}
`;

export const NOTE_QUERY = gql`
  query Note($id: ID!) {
    note(id: $id) {
      ...NoteFields
      tags {
        id
        name
        color
      }
    }
  }
  ${NOTE_FIELDS}
`;

export const NOTES_LIST_QUERY = gql`
  query NotesList(
    $notebookId: ID
    $folderId: ID
    $isPinned: Boolean
    $searchQuery: String
    $includeArchived: Boolean
    $tagIds: [String!]
  ) {
    notes(
      notebookId: $notebookId
      folderId: $folderId
      isPinned: $isPinned
      searchQuery: $searchQuery
      includeArchived: $includeArchived
      tagIds: $tagIds
    ) {
      ...NoteFields
    }
  }
  ${NOTE_FIELDS}
`;

export const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      ...NoteFields
    }
  }
  ${NOTE_FIELDS}
`;

export const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) {
      ...NoteFields
    }
  }
  ${NOTE_FIELDS}
`;

export const REMOVE_NOTE_MUTATION = gql`
  mutation RemoveNote($id: ID!) {
    removeNote(id: $id)
  }
`;

export const CREATE_NOTEBOOK_MUTATION = gql`
  mutation CreateNotebook($input: CreateNotebookInput!) {
    createNotebook(input: $input) {
      ...NotebookFields
    }
  }
  ${NOTEBOOK_FIELDS}
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      ...FolderFields
    }
  }
  ${FOLDER_FIELDS}
`;

export const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
      color
    }
  }
`;

export const ARCHIVED_NOTES_QUERY = gql`
  query ArchivedNotes {
    notes(includeArchived: true) {
      ...NoteFields
    }
  }
  ${NOTE_FIELDS}
`;

export const NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      type
      message
      isRead
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const NOTIFICATION_ADDED_SUBSCRIPTION = gql`
  subscription NotificationAdded {
    notificationAdded {
      id
      type
      message
      isRead
      createdAt
    }
  }
`;

export const REORDER_FOLDERS_MUTATION = gql`
  mutation ReorderFolders($ids: [ID!]!) {
    reorderFolders(ids: $ids) {
      ...FolderFields
    }
  }
  ${FOLDER_FIELDS}
`;

export const REORDER_NOTEBOOKS_MUTATION = gql`
  mutation ReorderNotebooks($ids: [ID!]!, $folderId: ID) {
    reorderNotebooks(ids: $ids, folderId: $folderId) {
      ...NotebookFields
    }
  }
  ${NOTEBOOK_FIELDS}
`;

export const CALENDAR_EVENT_FIELDS = gql`
  fragment CalendarEventFields on CalendarEvent {
    id
    title
    description
    startAt
    endAt
    allDay
    color
    location
    createdAt
    updatedAt
  }
`;

export const CALENDAR_EVENTS_QUERY = gql`
  query CalendarEvents($from: String, $to: String) {
    calendarEvents(from: $from, to: $to) {
      ...CalendarEventFields
    }
  }
  ${CALENDAR_EVENT_FIELDS}
`;

export const CREATE_CALENDAR_EVENT_MUTATION = gql`
  mutation CreateCalendarEvent($input: CreateCalendarEventInput!) {
    createCalendarEvent(input: $input) {
      ...CalendarEventFields
    }
  }
  ${CALENDAR_EVENT_FIELDS}
`;

export const UPDATE_CALENDAR_EVENT_MUTATION = gql`
  mutation UpdateCalendarEvent($input: UpdateCalendarEventInput!) {
    updateCalendarEvent(input: $input) {
      ...CalendarEventFields
    }
  }
  ${CALENDAR_EVENT_FIELDS}
`;

export const REMOVE_CALENDAR_EVENT_MUTATION = gql`
  mutation RemoveCalendarEvent($id: ID!) {
    removeCalendarEvent(id: $id)
  }
`;

export const GRAPH_FIELDS = gql`
  fragment GraphFields on Graph {
    id
    title
    description
    nodesJson
    edgesJson
    viewportJson
    createdAt
    updatedAt
  }
`;

export const GRAPHS_QUERY = gql`
  query Graphs {
    graphs {
      id
      title
      description
      nodesJson
      edgesJson
      updatedAt
      createdAt
    }
  }
`;

export const GRAPH_QUERY = gql`
  query Graph($id: ID!) {
    graph(id: $id) {
      ...GraphFields
    }
  }
  ${GRAPH_FIELDS}
`;

export const CREATE_GRAPH_MUTATION = gql`
  mutation CreateGraph($input: CreateGraphInput!) {
    createGraph(input: $input) {
      ...GraphFields
    }
  }
  ${GRAPH_FIELDS}
`;

export const UPDATE_GRAPH_MUTATION = gql`
  mutation UpdateGraph($input: UpdateGraphInput!) {
    updateGraph(input: $input) {
      ...GraphFields
    }
  }
  ${GRAPH_FIELDS}
`;

export const REMOVE_GRAPH_MUTATION = gql`
  mutation RemoveGraph($id: ID!) {
    removeGraph(id: $id)
  }
`;

export const SNAP_FIELDS = gql`
  fragment SnapFields on Snap {
    id
    title
    caption
    fileId
    mimeType
    notebookId
    noteId
    sortOrder
    createdAt
    updatedAt
  }
`;

export const SNAPS_QUERY = gql`
  query Snaps($scope: SnapListScope, $notebookId: ID, $noteId: ID) {
    snaps(scope: $scope, notebookId: $notebookId, noteId: $noteId) {
      ...SnapFields
    }
  }
  ${SNAP_FIELDS}
`;

export const CREATE_SNAP_MUTATION = gql`
  mutation CreateSnap($input: CreateSnapInput!) {
    createSnap(input: $input) {
      ...SnapFields
    }
  }
  ${SNAP_FIELDS}
`;

export const UPDATE_SNAP_MUTATION = gql`
  mutation UpdateSnap($input: UpdateSnapInput!) {
    updateSnap(input: $input) {
      ...SnapFields
    }
  }
  ${SNAP_FIELDS}
`;

export const REMOVE_SNAP_MUTATION = gql`
  mutation RemoveSnap($id: ID!) {
    removeSnap(id: $id)
  }
`;

export const REORDER_SNAPS_MUTATION = gql`
  mutation ReorderSnaps($ids: [ID!]!) {
    reorderSnaps(ids: $ids) {
      ...SnapFields
    }
  }
  ${SNAP_FIELDS}
`;
