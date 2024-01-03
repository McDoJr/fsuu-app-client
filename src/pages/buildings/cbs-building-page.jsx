import styles from "./building-page.module.css";
import Header from "../../components/header.jsx";
import Footer from "../../components/footer.jsx";
import BuildingSection from "./building-section.jsx";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {scrollToTop, setPageTitle} from "../../utils/utils.js";
import ScrollTop from "../../components/scroll-top.jsx";

const CbsBuildingPage = ({profile}) => {

    const location = useLocation();

    useEffect(() => {
        setPageTitle("CBS Building");
        scrollToTop();
    }, []);

    const buildingId = location.state.buildingId;

    return (
        <>
            <Header profile={profile}/>
            <BuildingSection buildingId={buildingId} width="calc((100% / 2) - 30px)" path="/building/cbs"/>
            <Footer/>
            <ScrollTop/>
        </>
    )
}

export default CbsBuildingPage;