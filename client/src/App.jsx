import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import HomePage from "./pages/HomePage.jsx";
import TopicsPage from "./pages/TopicsPage.jsx";
import TopicDetailPage from "./pages/TopicDetailPage.jsx";
import NewTopicPage from "./pages/NewTopicPage.jsx";
import EditTopicPage from "./pages/EditTopicPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import CaseNotesPage from "./pages/CaseNotesPage.jsx";
import CaseNoteDetailPage from "./pages/CaseNoteDetailPage.jsx";
import NewCaseNotePage from "./pages/NewCaseNotePage.jsx";
import EditCaseNotePage from "./pages/EditCaseNotePage.jsx";
import NotebooksPage from "./pages/NotebooksPage.jsx";
import NotebookDetailPage from "./pages/NotebookDetailPage.jsx";
import NewNotebookPage from "./pages/NewNotebookPage.jsx";
import RecentlyDeletedPage from "./pages/RecentlyDeletedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { ActivityProvider } from "./context/ActivityContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ActivityProvider>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="topics" element={<TopicsPage />} />
            <Route path="topics/new" element={<NewTopicPage />} />
            <Route path="topics/:topicId" element={<TopicDetailPage />} />
            <Route path="topics/:topicId/edit" element={<EditTopicPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="case-notes" element={<CaseNotesPage />} />
            <Route path="case-notes/new" element={<NewCaseNotePage />} />
            <Route path="case-notes/:caseNoteId" element={<CaseNoteDetailPage />} />
            <Route
              path="case-notes/:caseNoteId/edit"
              element={<EditCaseNotePage />}
            />
            <Route path="notebooks" element={<NotebooksPage />} />
            <Route path="notebooks/new" element={<NewNotebookPage />} />
            <Route path="notebooks/:notebookId" element={<NotebookDetailPage />} />
            <Route path="recently-deleted" element={<RecentlyDeletedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ActivityProvider>
    </BrowserRouter>
  );
}
