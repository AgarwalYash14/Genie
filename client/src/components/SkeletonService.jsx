import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonService() {
    return (
        <div className="relative">
            <div className="w-full outline-1 outline-dotted rounded-xl overflow-hidden">
                <div className="items-center p-0 -m-1">
                    <Skeleton className="w-full h-[9.25rem]" />
                    <div className="w-full">
                        <Skeleton width="75%" />
                    </div>
                </div>
            </div>
        </div>
    );
}
