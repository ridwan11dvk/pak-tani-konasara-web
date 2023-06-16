import { UserDataInterface } from "@/hooks/useLogin"
import { StateCreator, create } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"
import Cookies from 'js-cookie'


type UserStoreInterface = {
  token: string
  userData: UserDataInterface | null,
  setUserData: (data: UserDataInterface) => void,
  setToken: (token: string) => void
  removeUserState: () => void
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
        userData: null,
        setUserData: (userData?: UserDataInterface) => {
          set({ userData: userData || null })
        },
        setToken: (token: string) => {
          Cookies.set('token', token)
          set({ token })
        },
        removeUserState: () => {
          Cookies.remove('token')
          set({
            token: '',
            userData: null
          })
        }
      }),
      { 
        name: 'user-store',
      },
      

    ),
  )

  return {
    token: assestment.getState().token,
    userData: assestment.getState().userData,
    setToken: assestment.getState().setToken,
    setUserData: assestment.getState().setUserData,
    removeUserState: assestment.getState().removeUserState
  }
}

export default useUserStore
