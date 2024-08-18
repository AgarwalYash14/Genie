import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonService() {
    return (
        <div className="relative">
            <div className="w-full outline-1 outline-dotted rounded-xl overflow-hidden">
                <div className="flex items-center p-0 -m-1">
                    <Skeleton width={128} height={85} />
                    <div className="w-full">
                        <Skeleton width="75%" />
                    </div>
                </div>
            </div>
        </div>
    );
}
