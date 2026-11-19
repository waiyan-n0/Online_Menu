import React, { useState, useEffect } from 'react';
import {Store, Plus, MapPin, Phone, ExternalLink, RefreshCw, AlertCircle, Pencil, QrCode, Copy, Check, Download, X, ShieldCheck,} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const API_URL = `http://${window.location.hostname}:3000`;
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loadingShops, setLoadingShops] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedShop, setSelectedShop] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    const fetchShops = async () => {
        setLoadingShops(true);
        setErrorMsg('');
        try {
            const response = await fetch(`${API_URL}/admin/shops`);
            const data = await response.json();
            if (!response.ok) {
                return new Error(data.message || 'Failed to load shops');
            }
            const list = Array.isArray(data) ? data : Array.isArray(data.result) ? data.result : Array.isArray(data.shops) ? data.shops : [];
            setShops(list);
        } catch (err) {
            console.error('Error fetching shops:', err);
            setErrorMsg('Could not load existing shops.');
        } finally {
            setLoadingShops(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleEditShop = (shopItem) => {
        navigate('/admin/create-shop', {
            state: { shopData: shopItem },
        });
    };

    const getShopLinks = (shopItem) => {
        const origin = window.location.origin;
        const shopSlug = shopItem.slug || '';
        const menuUrl = `${origin}/menu/${shopSlug}`;
        const adminUrl = `${origin}/menu/${shopSlug}/login`;
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(menuUrl)}`;

        return { menuUrl, adminUrl, qrImageUrl };
    };

    const handleCopy = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleDownloadQR = async (qrUrl, shopSlug) => {
        try {
            const res = await fetch(qrUrl);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${shopSlug || 'shop'}-menu-qr.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Failed to download QR image:', err);
        }
    };

    const activeLinks = selectedShop ? getShopLinks(selectedShop) : null;

    return (
        <div className="min-h-screen bg-white text-black px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-black">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-black">
                                Existing shops ({shops.length})
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button type="button" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-black text-sm font-medium text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                                onClick={fetchShops}
                        >
                            <RefreshCw className={`w-4 h-4 ${loadingShops ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>

                        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                                onClick={() => navigate('/admin/create-shop')}
                        >
                            <Plus className="w-4 h-4" />
                            Create Shop
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-black text-white border border-black">
                        <AlertCircle className="w-4 h-4 shrink-0 text-blue-500" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <section className="bg-white rounded-xl border border-black p-6">
                    {loadingShops ? (
                        <div className="py-12 text-center text-sm text-black">
                            Loading shops...
                        </div>
                    ) : shops.length === 0 ? (
                        <div className="py-12 text-center space-y-3 border border-dashed border-black rounded-lg">
                            <p className="text-sm text-black">No shops created yet.</p>
                            <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                                    onClick={() => navigate('/admin/create-shop')}
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Shop
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-black">
                            {shops.map((shopItem, idx) => (
                                <div key={shopItem._id || shopItem.id || shopItem.slug || idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3.5">
                                        {shopItem.logo ? (
                                            <img src={shopItem.logo} alt={shopItem.name}
                                                className="w-12 h-12 rounded-full object-cover border border-black shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                                                {shopItem.name?.charAt(0)?.toUpperCase() || 'S'}
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2 className="font-bold text-black text-base">
                                                    {shopItem.name}
                                                </h2>
                                                <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-black bg-white text-black">
                                                    /{shopItem.slug}
                                                </span>
                                            </div>

                                            {shopItem.tag && (
                                                <p className="text-xs text-black">{shopItem.tag}</p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black pt-0.5">
                                                {shopItem.location && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                        {shopItem.location}
                                                    </span>
                                                )}
                                                {Array.isArray(shopItem.phone) && shopItem.phone.length > 0 && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                                                        {shopItem.phone.join(', ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                                        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-600 text-black hover:text-white border border-black hover:border-blue-600 text-xs font-semibold transition-colors cursor-pointer"
                                            onClick={() => {
                                                setCopiedKey(null);
                                                setSelectedShop(shopItem);
                                            }}
                                        >
                                            <QrCode className="w-3.5 h-3.5" />
                                            QR & Links
                                        </button>

                                        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-600 text-black hover:text-white border border-black hover:border-blue-600 text-xs font-semibold transition-colors cursor-pointer"
                                            onClick={() => handleEditShop(shopItem)}
                                        ><Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>

                                        <Link to={`/menu/${shopItem.slug}`} target="_blank"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                                        >
                                            Open Menu
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {selectedShop && activeLinks && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                    onClick={() => setSelectedShop(null)}
                >
                    <div className="bg-white text-black w-full max-w-xl rounded-xl border-2 border-black p-6 space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-black pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-600 text-white rounded-lg">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-black">
                                        {selectedShop.name}
                                    </h2>
                                    <p className="text-xs font-mono text-black">
                                        /{selectedShop.slug}
                                    </p>
                                </div>
                            </div>

                            <button title="Close modal" type="button" className="p-1.5 rounded-lg bg-black hover:bg-blue-600 text-white transition-colors cursor-pointer"
                                onClick={() => setSelectedShop(null)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 border border-black rounded-xl bg-white space-y-3">
                                <img className="w-44 h-44 object-contain border border-black rounded-lg p-1 bg-white"
                                    src={activeLinks.qrImageUrl} alt={`QR Code for ${selectedShop.name}`}
                                />
                                <button type="button" className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    onClick={() => handleDownloadQR(activeLinks.qrImageUrl, selectedShop.slug)}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download QR PNG
                                </button>
                            </div>

                            <div className="sm:col-span-7 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-black flex items-center gap-1.5">
                                        <Store className="w-3.5 h-3.5 text-blue-600" />
                                        Customer Menu Link
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <input type="text" readOnly className="flex-1 px-2.5 py-2 text-xs font-mono bg-white text-black border border-black rounded-lg focus:outline-none"
                                            value={activeLinks.menuUrl}
                                        />
                                        <button type="button" title="Copy Menu Link" className="p-2 rounded-lg border border-black bg-white text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                                            onClick={() => handleCopy(activeLinks.menuUrl, 'menu')}
                                        >
                                            {copiedKey === 'menu' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <a href={activeLinks.menuUrl}
                                            target="_blank" rel="noreferrer" title="Open Menu" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-black flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                        Menu Admin Link
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <input type="text" readOnly className="flex-1 px-2.5 py-2 text-xs font-mono bg-white text-black border border-black rounded-lg focus:outline-none"
                                            value={activeLinks.adminUrl}
                                        />
                                        <button type="button" title="Copy Admin Link" className="p-2 rounded-lg border border-black bg-white text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                                                onClick={() => handleCopy(activeLinks.adminUrl, 'admin')}
                                        >
                                            {copiedKey === 'admin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <a target="_blank" rel="noreferrer" title="Open Admin Link" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                            href={activeLinks.adminUrl}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {selectedShop.username && (
                                    <div className="p-2.5 rounded-lg border border-black text-xs text-black">
                                        Admin Username: <span className="font-mono font-bold text-blue-600">{selectedShop.username}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;