import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

// const pinia = createPinia()
// pinia.use(createPersistedStatePlugin)

const pinia = createPinia()

const persistedStatePlugin = createPersistedStatePlugin({
  // plugin options goes here
})
pinia.use(persistedStatePlugin)

export default pinia
