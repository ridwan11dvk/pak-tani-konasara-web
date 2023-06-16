type OptionType = { [x: string]: any }
type OptionsType = Array<OptionType>

export const roleOptions: OptionsType = [
    {
        label: 'Admin',
        value: 'admin'
    },
    {
        label: 'User',
        value: 'user'
    }
]