import { useCheckSteadfastStatusQuery } from "@/store/Api/SteadfastApi";


const SteadfastStatus = ({ consignmentId }: { consignmentId: string }) => {
    const { data, isLoading } = useCheckSteadfastStatusQuery(consignmentId);
    
    if(!consignmentId) return null;
    if(isLoading) return <span className="text-xs text-gray-400">Loading courier status...</span>;

    const status = data?.data?.delivery_status;

    if(!status) return null;

    return (
        <div className="mt-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-800 font-bold mb-1 uppercase tracking-wider">Courier Status</p>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-900">{status}</span>
                <span className="text-[10px] text-emerald-600">Steadfast Courier</span>
            </div>
        </div>
    );
};

export default SteadfastStatus;
