import React, { useState, useEffect } from 'react';
import test from '../assets/hero.png';
import { MapPin, Phone, Pencil, Check, X, Globe } from 'lucide-react';
import Error from '../pages/Error.jsx';

const getSocialLabel = (url) => {
    try {
        const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
        const hostname = new URL(cleanUrl).hostname.replace(/^www\./, '');
        if (hostname.includes('facebook') || hostname.includes('fb.')) return 'Facebook';
        if (hostname.includes('instagram')) return 'Instagram';
        if (hostname.includes('t.me') || hostname.includes('telegram')) return 'Telegram';
        if (hostname.includes('tiktok')) return 'TikTok';
        if (hostname.includes('youtube') || hostname.includes('youtu.be')) return 'YouTube';
        if (hostname.includes('x.com') || hostname.includes('twitter')) return 'X';
        if (hostname.includes('viber')) return 'Viber';
        const siteName = hostname.split('.')[0];
        return siteName.charAt(0).toUpperCase() + siteName.slice(1);
    } catch {
        return 'Website';
    }
};

const Header = ({ slug, isEditMode }) => {
    const API_URL = `http://${window.location.hostname}:3000`;
    const [shopData, setShopData] = useState(null);
    const [error, setError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        tag: '', location: '', phone: '', socialMedia: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const getShopDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/menu/${slug}`);
            const data = await response.json();
            const shop = data.result.shop;
            if (!response.ok) {
                setError(true);
                return;
            }
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

    const handleStartEditing = () => {
        if (!shopData) return;
        setFormData({
            tag: shopData.tag,
            location: shopData.location,
            phone: Array.isArray(shopData.phone) ? shopData.phone.join(',') : (shopData.phone || ''),
            socialMedia: Array.isArray(shopData.socialMedia) ? shopData.socialMedia.join(',') : (shopData.socialMedia || '')
        });
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSaveAllChanges = async () => {
        setIsSaving(true);
        try {
            const formattedPhones = formData.phone.split(',').map(num => num.trim()).filter(Boolean);
            const formattedSocials = formData.socialMedia.split(',').map(link => link.trim()).filter(Boolean);
            const payload = {
                tag: formData.tag,
                location: formData.location,
                phone: formattedPhones,
                socialMedia: formattedSocials
            };

            const response = await fetch(`${API_URL}/menu/${slug}/update-shop`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok || !data.con) {
                console.error("Failed to update shop details", data);
                return;
            }
            await getShopDetails();
            setIsEditing(false);
        } catch (err) {
            console.error("Network error during shop update:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (error) {
        return (<Error error={error} />)
    }

    const socialLinks = Array.isArray(shopData?.socialMedia) ? shopData.socialMedia.filter(Boolean)
        : typeof shopData?.socialMedia === 'string' && shopData.socialMedia.trim() ? [shopData.socialMedia.trim()] : [];

    return (
        <header className="px-4 py-4 w-full mx-auto bg-white text-black border-b border-black">
            <nav className="flex items-center justify-between pb-3 border-b border-black">
                <div className="flex items-center gap-2">
                    <span className="font-mallo text-lg font-bold text-black tracking-wider">
                        {shopData ? shopData.name : 'Loading...'}
                    </span>
                </div>

                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black shrink-0">
                    <img src={shopData?.logo || test} alt="Shop Logo" className="w-full h-full object-cover" />
                </div>
            </nav>

            <section className="pt-4 text-center space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="font-mallo text-2xl font-bold text-black tracking-widest">
                            {shopData?.name}
                        </h1>
                        {isEditMode && !isEditing && (
                            <button className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer" title="Edit Shop Profile"
                                onClick={handleStartEditing}>
                                <Pencil className="w-4 h-4"/>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                            <input type="text" value={formData.tag} className="text-sm text-black text-center px-3 py-1 bg-white border border-black rounded-lg focus:outline-none focus:border-blue-600 w-full max-w-md"
                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            />
                        ) : (
                            <p className="text-sm text-black">
                                {shopData?.tag}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-center">
                    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-black bg-white py-2 px-4 rounded-lg border border-black">
                        <li className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            {isEditing ? (
                                <input type="text" className="text-xs px-2 py-1 bg-white text-black border border-black rounded-lg focus:outline-none focus:border-blue-600" value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            ) : (
                                <span>{shopData?.location || 'Loading location...'}</span>
                            )}
                        </li>
                        <li className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            {isEditing ? (
                                <input type="text" placeholder="e.g. https://facebook.com/..." className="text-xs px-2 py-1 bg-white text-black border border-black rounded-lg focus:outline-none focus:border-blue-600"
                                    value={formData.socialMedia} onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                                />
                            ) : (
                                <div className="flex flex-wrap items-center gap-x-2">
                                    {socialLinks.length > 0 ? (
                                        socialLinks.map((link, idx) => (
                                            <a key={idx} target="_blank" rel="noreferrer" className="hover:underline font-medium"
                                               href={link.startsWith('http') ? link : `https://${link}`}
                                            >
                                                {getSocialLabel(link)}{idx < socialLinks.length - 1 ? ',' : ''}
                                            </a>
                                        ))
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                            )}
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0"/>
                            {isEditing ? (
                                <input type="text" placeholder="e.g. 09..., 09..." className="text-xs px-2 py-1 bg-white text-black border border-black rounded-lg focus:outline-none focus:border-blue-600"
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            ) : (
                                <div className="flex flex-wrap items-center gap-x-2">
                                    {shopData?.phone?.map((num, idx) => (
                                        <a className="hover:underline font-medium text-blue-600"
                                            key={idx} href={`tel:${num}`}>
                                            {num}{idx < shopData.phone.length - 1 ? ',' : ''}
                                        </a>
                                    )) || 'Loading phone...'}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>

                {isEditing && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                                onClick={handleSaveAllChanges} disabled={isSaving}
                        >
                            <Check className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button disabled={isSaving} className="flex items-center gap-1 bg-white hover:bg-black text-black hover:text-white border border-black px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                                onClick={handleCancelEditing}
                        >
                            <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                    </div>
                )}
            </section>
        </header>
    );
};

export default Header;