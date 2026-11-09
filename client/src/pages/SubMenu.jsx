import Header from '../components/Header';
import {useLocation, useParams} from "react-router-dom";
import MenuItem from "../components/MenuItem.jsx";

const SubMenu = () => {
    const {slug, submenu} = useParams();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const isEditMode = searchParams.has("mode") && location.hash ==='#edit';
    return (
        <div>
            <Header/>
            <MenuItem submenu={submenu} isEditMode={isEditMode} />
        </div>
    )
}

export default SubMenu;