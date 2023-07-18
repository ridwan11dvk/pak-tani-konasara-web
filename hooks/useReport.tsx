import { useEffect, useMemo, useState } from "react";
import { useFetchOrders } from "./useOrderHook";
import { CallType } from "@/types/order";
import moment from "moment";

export const useReport = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const { data: dataOrders, isLoading, refetch } = useFetchOrders({ page: 1, limit: 1000, search: "", startDate: moment().subtract(3, 'months').format('YYYY-MM-DD') })

    const [callPositiveArr, setCallPositiveArr] = useState<CallType[]>([])
    const [callNegativeArr, setCallNegativeArr] = useState<CallType[]>([])
    const [callFollowUpArr, setCallFollowUpArr] = useState<CallType[]>([])

    
    useEffect(() => {
        if (dataOrders?.data?.length){
            let cpArrPositive: CallType[] = []
            let cpArrNegative: CallType[] = []
            let cpArrFollowUp: CallType[] = []
            dataOrders?.data?.forEach((order: any) => {
                if (order?.call_list?.length) {
                    order?.call_list?.forEach((call: any) => {
                        if ((call.status === 'positive' && tabIndex === 0)) {
                            cpArrPositive?.push(call)
                        } else if ((call.status === 'negative' && tabIndex === 1)) {
                            cpArrNegative.push(call)
                        } else if ((call.status === 'follow_up' && tabIndex === 2)) {
                            cpArrFollowUp.push(call)
                        }
                    })
                }
            })
            setCallPositiveArr(cpArrPositive)
            setCallNegativeArr(cpArrNegative)
            setCallFollowUpArr(cpArrFollowUp)

        }
    }, [tabIndex, dataOrders?.data]);



    return ({
        tabIndex,
        setTabIndex,
        callPositiveArr,
        callNegativeArr,
        callFollowUpArr,
    });
}