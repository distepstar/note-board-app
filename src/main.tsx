import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./routes/App";
import { Home, Calendar, Notes, KanbanBoard } from "./routes/MainActivity";
import { Error } from "./routes/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { KanbanPopupWrapper } from './components/Kanban';


export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    errorElement: <Error />,
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>,
)
