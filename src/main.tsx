import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./routes/App";
import { Home, Calendar, Notes, KanbanBoard } from "./routes/MainActivity";
import { Error } from "./routes/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { KanbanItemTest } from './components/Kanban';
import { QueryClient, QueryClientProvider } from 'react-query';


export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/calendar",
        element: <Calendar />
      },
      {
        path: "/notes",
        element: <Notes />
      },
      {
        path: "/kanbanboard",
        element: <KanbanBoard />,
        children: [
          {
            path: "view/:id",
            element: <KanbanItemTest />
          }
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
