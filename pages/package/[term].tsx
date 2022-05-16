import TermPage from "../../components/TermPage";
import dynamic from 'next/dynamic'

export default dynamic(() => Promise.resolve(TermPage), { ssr: false })
