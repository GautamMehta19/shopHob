type ConfirmStatusModalProps = {
    Header: string;
    Content: string;
    newStatus: string;
    onConfirm: () => void;
    show: boolean;
    onClose: () => void;
};

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

const statusColorMap: Record<string, string> = {
    [OrderStatus.PENDING]: "bg-yellow-500 hover:bg-yellow-600",
    [OrderStatus.PROCESSING]: "bg-blue-500 hover:bg-blue-600",
    [OrderStatus.SHIPPED]: "bg-indigo-500 hover:bg-indigo-600",
    [OrderStatus.DELIVERED]: "bg-green-600 hover:bg-green-700",
    [OrderStatus.CANCELLED]: "bg-red-600 hover:bg-red-700",
    logout: "bg-red-600 hover:bg-red-700",
    add: "bg-blue-500 hover:bg-blue-600",
};

export default function ConfirmStatusModal({
    Header,
    Content,
    newStatus,
    onConfirm,
    show,
    onClose,
}: ConfirmStatusModalProps) {
    if (!show) return null;

    const confirmButtonColor =
        statusColorMap[newStatus.toLowerCase()] || "bg-blue-500 hover:bg-blue-600";

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">{Header}</h2>
                <p className="text-gray-600 mb-6">
                    {Content} <strong className="capitalize">{newStatus}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                        No
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded text-white ${confirmButtonColor}`}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}
