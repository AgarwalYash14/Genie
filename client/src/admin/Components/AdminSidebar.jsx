import { Link } from "react-router-dom";
import { logo } from "../../assets";

export default function AdminSidebar() {
    return (
        <div className="flex items-center gap-0.5">
            <img src={logo} alt="" className="h-10" />
            <Link
                to="/admin"
                className="text-2xl tracking-tighter font-semibold logo pb-2 hover:text-green-600 transition-colors duration-300"
            >
                GENIE
            </Link>
        </div>
    );
}
