import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/research')({ component: ResearchLayout })

function ResearchLayout() {
  return <Outlet />
}
