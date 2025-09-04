import ClientPage from "./_components/ClientPage";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";

export default function PostPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ClientPage />
    </Suspense>
  );
}