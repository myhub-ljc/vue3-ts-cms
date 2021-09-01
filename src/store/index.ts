import { createStore } from 'vuex'

const store = createStore({
  state: () => {
    return {
      name: 'kobe'
    }
  }
})

export default store
