import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/components/public/landingPage/LandingPage";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
