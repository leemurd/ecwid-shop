import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()

const persistedStatePlugin = createPersistedStatePlugin({})
pinia.use(persistedStatePlugin)

export default pinia
