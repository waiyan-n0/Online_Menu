import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import {useLocation, useParams} from "react-router-dom";
import MainCategory from "../components/MainCategory.jsx";

const Menu = () => {
    const {slug} = useParams();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const isEditMode = searchParams.has("mode") && location.hash ==='#edit';

    return(
        <div>
            <Header slug={slug} isEditMode={isEditMode} />
            <MainCategory slug={slug} isEditMode={isEditMode} />
            <Footer />
        </div>
    );
}

export default Menu;