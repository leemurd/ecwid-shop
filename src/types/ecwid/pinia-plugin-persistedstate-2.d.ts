import 'pinia'

declare module 'pinia' {
  interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | {
      key?: string
      storage?: Storage
      paths?: string[]
    }
  }
}
