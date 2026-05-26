import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage.jsx';
import EditorPage from '../pages/EditorPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/editor' element={<EditorPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
