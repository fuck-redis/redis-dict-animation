/**
 * 路由配置
 */

import { createHashRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ConceptPage } from './pages/ConceptPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { HashFunctionsPage } from './pages/HashFunctionsPage';
import { RehashPage } from './pages/RehashPage';
import { PerformancePage } from './pages/PerformancePage';
import { IteratorPage } from './pages/IteratorPage';
import { TutorialPage } from './pages/TutorialPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ConceptPage />,
      },
      {
        path: 'playground',
        element: <PlaygroundPage />,
      },
      {
        path: 'hash-functions',
        element: <HashFunctionsPage />,
      },
      {
        path: 'rehash',
        element: <RehashPage />,
      },
      {
        path: 'performance',
        element: <PerformancePage />,
      },
      {
        path: 'iterator',
        element: <IteratorPage />,
      },
      {
        path: 'tutorial',
        element: <TutorialPage />,
      },
    ],
  },
]);
