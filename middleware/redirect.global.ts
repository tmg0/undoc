export default defineNuxtRouteMiddleware((to) => {
  if (!to.name) {
    return navigateTo('/_undoc')
  }
})
