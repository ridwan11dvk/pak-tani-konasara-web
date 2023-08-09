export const defaultPerPage = 10
export const UPDATE_MESSAGE = 'Data Has Been Updated'
export const DELETE_MESSAGE = 'Data Has Been Deleted'
export const POST_MESSAGE = "Data Has been Saved"
export const ERROR_FILE_SIZE = "File can't exceed 12 MiB"

export const USERS_KEY = "users-key";
export const USERS_BY_ID_KEY = "users-by-id-key";
export const USER_DETAIL_KEY = "user-detail-key";
export const CANDIDATE_KEY = "candidate-key";
export const CANDIDATE_BY_ID_KEY = "candidate-by-id-key";
export const CANDIDATE_DETAIL_KEY = "candidate-detail-key";
export const ORDER_KEY = "order-key";
export const ORDER_DETAIL_KEY = "order-detail-key";
export const CALL_HISTORY_KEY = "call-history-key";
export const AUDIO_KEY = "audio-key";

//color
export const SuccessColor = "#00aa13";
export const PrimaryColor = "#1065c0";
export const WarningColor = "#F06400";
export const PinkColor = "#DF1995";
export const DangerColor = "#EE2737";
export const InfoColor = "#00AED6";
export const PurpleColor = "#93328E";

export const SuccessColorTransparent = 'rgba(0, 170, 19, 0.7)';
export const PrimaryColorTransparent = 'rgba(16, 101, 192, 0.7)';
export const WarningColorTransparent = 'rgba(240, 100, 0, 0.7)';
export const PinkColorTransparent = 'rgba(223, 25, 149, 0.7)';
export const DangerColorTransparent = 'rgba(238, 39, 55, 0.7)';
export const InfoColorTransparent = 'rgba(0, 174, 214, 0.7)';
export const PurpleColorTransparent = 'rgba(147, 50, 142, 0.7)';




export const ROLE_STATUS = {
    super_admin: {
        label: 'Super Admin',
        value: 'superadmin'
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