// client/src/components/Toast.jsx
// Re-export react-hot-toast configured with green theme
import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#fff",
          color: "#1a2e1a",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#fff" },
          style: { borderLeft: "4px solid #16a34a" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#fff" },
          style: { borderLeft: "4px solid #dc2626" },
        },
      }}
    />
  );
}
