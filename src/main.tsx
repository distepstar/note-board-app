import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./routes/App";
import { Home, Calendar, Notes, KanbanBoard } from "./routes/MainActivity";
import { Error } from "./routes/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from './app/store';


export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
        errorElement: <Error />,
      },
      {
        path: "/notes",
        element: <Notes />,
        errorElement: <Error />,
      },
      {
        path: "/kanbanboard/*",
        element: <KanbanBoard />,
        errorElement: <Error />,
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
