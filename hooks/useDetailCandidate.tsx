import { useRouter } from "next/router"

const useDetailCandidate = () => {
    const { query} = useRouter();
    const candidateId = query?.id || '';
}