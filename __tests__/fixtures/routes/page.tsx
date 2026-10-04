import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/page")({ component: Page });

function Page() {
  return <Row />;
}

function Row() {
  return <div />;
}
