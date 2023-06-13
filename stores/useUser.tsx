import { StateCreator, create } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"


type UserStoreInterface = {
  token: string
  setToken: (token: string) => void
  removeToken: () => void
}

type MyPersist = (
  config: StateCreator<UserStoreInterface>,
  options: PersistOptions<UserStoreInterface>
) => StateCreator<UserStoreInterface>

const useUserStore = () => {
  const assestment = create<UserStoreInterface>(
    (persist as MyPersist)(
      (set) => ({
        token: '',
        setToken: (token: string) => {
          set({ token })
        },
        removeToken: () => {
          set({ token: '' })
        }
      }),
      { name: 'user-store' }
    )
  )

  return {
    token: assestment.getState().token,
    setToken: assestment.getState().setToken,
    removeToken: assestment.getState().removeToken
  }
}

export default useUserStore
