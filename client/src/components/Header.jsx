import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import test from '../assets/hero.png';
import { MapPin, Phone } from 'lucide-react';
import Error from '../pages/Error.jsx';
const Header = ({slug, isEditMode}) => {
    console.log(slug, isEditMode);
    const API_URL = `http://${window.location.hostname}:3000`;
    const navigate = useNavigate();
    const [shopData, setShopData] = useState(null);
    const [error, setError] = useState(false);

    const getShopDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/menu/${slug}`);
            const data = await response.json();
            const shop = data.result.shop;
            if(!response.ok){
                setError(true);
                return;
            }
            //console.log("shop data:", shop);
            setShopData(shop);
        } catch (err) {
            setError(true);
            console.error("Failed to fetch shop details", err);
        }
    };

    useEffect(() => {
        if (slug) {
            getShopDetails();
        }
    }, [slug]);

    if(error){
        return (<Error error={error} />)
    }
    return (
        <header className="px-4 py-4 max-w-xl mx-auto bg-white shadow-sm border-b border-gray-100">
            <nav className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex flex-col">
                    <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                        {shopData ? shopData.name : 'Loading...'}
                    </span>
                </div>

                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm shrink-0">
                    <img src={shopData?.logo || test} alt="Shop Logo" className="w-full h-full object-cover" />
                </div>
            </nav>

            <section className="pt-4 text-center space-y-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-wide">
                        {shopData?.name}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {shopData?.tag}
                    </p>
                </div>

                <div className="flex justify-center">
                    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600 bg-gray-50 py-2 px-4 rounded-xl border border-gray-100">
                        <li className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{shopData?.location || 'Loading location...'}</span>
                        </li>
                        <li className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <a href={`tel:${shopData?.phone?.[0]}`} className="hover:underline font-medium text-gray-800">
                                {shopData?.phone?.[0] || 'Loading phone...'}
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </header>
    );
};

export default Header;