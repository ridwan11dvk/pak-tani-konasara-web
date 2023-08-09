type OptionType = { [x: string]: any }
type OptionsType = Array<OptionType>

export const roleOptions: OptionsType = [
    // {
    //     label: 'Super Admin',
    //     value: 'superadmin'
    // },
    {
        label: 'Admin',
        value: 'admin'
    },
    
    {
        label: 'User',
        value: 'user'
    },
    {
        label: 'Caller',
        value: 'caller'
    }
]