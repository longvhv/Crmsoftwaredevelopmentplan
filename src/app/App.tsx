import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";

// Updated: 2025-03-17 - Removed TipTap dependencies, using custom RichTextEditor
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: "text-sm",
          duration: 3000,
        }}
      />
    </>
  );
}