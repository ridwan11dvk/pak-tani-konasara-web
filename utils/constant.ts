export const defaultPerPage = 10
export const UPDATE_MESSAGE = 'Data Has Been Updated'
export const DELETE_MESSAGE = 'Data Has Been Deleted'
export const POST_MESSAGE = "Data Has been Saved"
export const ERROR_FILE_SIZE = "File can't exceed 12 MiB"

export const USERS_KEY = "users-key";
export const USER_DETAIL_KEY = "user-detail-key";
export const CANDIDATE_KEY = "candidate-key";
export const CANDIDATE_DETAIL_KEY = "candidate-detail-key";
export const ORDER_KEY = "order-key";
export const ORDER_DETAIL_KEY = "order-detail-key";
export const CALL_HISTORY_KEY = "call-history-key";
export const AUDIO_KEY = "audio-key";




export const ROLE_STATUS = {
    super_admin: {
        label: 'Super Admin',
        value: 'super_admin'
    },
    admin: {
        label: 'Admin',
        value: 'admin'
    },
    user: {
        label: 'User',
        value: 'user'
    },
    caller: {
        label: 'Caller',
        value: 'caller'
    },
}

export const ORDER_STATUS = {
    'no call': {
        label: 'No Call',
        value: 'no call'
    },
    'positive': {
        label: 'Positive',
        value: 'positive'
    },
    'negative': {
        label: 'Negative',
        value: 'negative'
    },
    'follow_up': {
        label: 'Follow Up',
        value: 'follow_up'
    },
}

export const orderStatusOptions = [
    {
        label: 'No Call',
        value: 'no call'
    },
    {
        label: 'Positive',
        value: 'positive'
    },
    {
        label: 'Negative',
        value: 'negative'
    },
    {
        label: 'Follow Up',
        value: 'follow_up'
    }
]