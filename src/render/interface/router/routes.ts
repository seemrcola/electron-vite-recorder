import type { RouteRecord } from 'vue-router'

function getAllRoutes() {
  const routes = import.meta.glob('../pages/**/route.ts', { eager: true })
  const allRoutes = []
  for (const path in routes) {
    const route = routes[path] as { default: RouteRecord }
    route.default.meta = route.default.meta || { path: route.default.path }
    allRoutes.push(route.default)
  }

  return allRoutes
}

export default getAllRoutes()
