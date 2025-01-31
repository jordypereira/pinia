import {
  defineStore,
  expectType,
  mapStores,
  mapActions,
  mapState,
  mapWritableState,
} from '.'

const useStore = defineStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
  actions: {
    toggleA() {
      this.a = this.a === 'off' ? 'on' : 'off'
    },

    setToggle(a: 'on' | 'off') {
      return (this.a = a)
    },
  },
})

const useCounter = defineStore({
  id: 'counter',
  state: () => ({ n: 0 }),
})

const useStoreDos = defineStore({
  id: 'dos',
  state: () => ({}),
})

type MainStore = ReturnType<typeof useStore>
type DosStore = ReturnType<typeof useStoreDos>
type CounterStore = ReturnType<typeof useCounter>

const computedStores = mapStores(useStore, useStoreDos, useCounter)

expectType<{
  nameStore: () => MainStore
  dosStore: () => DosStore
  counterStore: () => CounterStore
}>(computedStores)

expectType<{
  a: () => 'on' | 'off'
  upper: () => string
}>(mapState(useStore, ['a', 'upper']))

expectType<{
  newA: () => 'on' | 'off'
  newUpper: () => string
}>(mapState(useStore, { newA: 'a', newUpper: 'upper' }))

expectType<{
  newA: () => 'on' | 'off'
  newUpper: () => string
}>(
  mapState(useStore, {
    newA: (store) => {
      expectType<string>(store.upper)
      return store.a
    },
    newUpper: 'upper',
  })
)

expectType<{
  setToggle: (a: 'on' | 'off') => 'on' | 'off'
  toggleA: () => void
}>(mapActions(useStore, ['setToggle', 'toggleA']))

expectType<{
  newSetToggle: (a: 'on' | 'off') => 'on' | 'off'
  newToggleA: () => void
}>(mapActions(useStore, { newSetToggle: 'setToggle', newToggleA: 'toggleA' }))

expectType<{
  a: {
    get: () => 'on' | 'off'
    set: (v: 'on' | 'off') => any
  }
}>(mapWritableState(useStore, ['a']))

expectType<{
  newA: {
    get: () => 'on' | 'off'
    set: (v: 'on' | 'off') => any
  }
}>(mapWritableState(useStore, { newA: 'a' }))

// @ts-expect-error: cannot use a getter
mapWritableState(useStore, ['upper'])
// @ts-expect-error: cannot use a getter
mapWritableState(useStore, { up: 'upper' })
