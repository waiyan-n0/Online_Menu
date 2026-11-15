import { Plus, X, Utensils, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Previous from "./Previous";
import ScrollBack from "./ScrollBack";
import Loading from "./Loading";

const MenuItem = ({ submenu, isEditMode }) => {
    const { slug } = useParams();
    const inputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [variants, setVariants] = useState([{ option: '', price: '' }]);
    const [imgUrl, setImgUrl] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [isLoading, setLoading] = useState(false);

    // State to track the currently selected variant index for each menu item card (keyed by item._id)
    const [selectedVariants, setSelectedVariants] = useState({});

    const API_URL = `http://${window.location.hostname}:3000`;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large! Maximum limit is 5MB.');
            return;
        }
        setImgFile(file);
        setImgUrl(URL.createObjectURL(file));
    };

    const handleAddVariantRow = () => {
        setVariants([...variants, { option: '', price: '' }]);
    };

    const handleRemoveVariantRow = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const fetchMenuItems = async () => {
        if (!submenu) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}`);
            const data = await response.json();
            if (response.ok && data.con) {
                setMenuItems(data.result || []);
                const initialSelected = {};
                (data.result || []).forEach(item => {
                    if (item.variants && item.variants.length > 0) {
                        initialSelected[item._id] = 0;
                    }
                });
                setSelectedVariants(initialSelected);
            }
        } catch (err) {
            console.error("Error fetching menu items:", err);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [slug, submenu]);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!itemName.trim() || variants.length === 0 || !submenu) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', itemName);
            formData.append('variants', JSON.stringify(variants));
            if (imgFile) formData.append('image', imgFile);

            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}/create-menu`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.con) {
                console.error('Error creating menu item:', data);
                return;
            }

            setMenuItems(prev => [...prev, data.result]);
            setSelectedVariants(prev => ({ ...prev, [data.result._id]: 0 }));
            setIsModalOpen(false);
            setItemName('');
            setVariants([{ option: '', price: '' }]);
            setImgUrl('');
            setImgFile(null);
        } catch (err) {
            console.error('Network error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}/delete-menu`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemId }),
            });

            const data = await response.json();

            if (!response.ok || !data.con) {
                console.error('Error deleting menu item:', data);
                return;
            }
            setMenuItems(prev => prev.filter(item => item._id !== itemId));
        } catch (err) {
            console.error('Network error during deletion:', err);
        }
    };

    return (
        <div className="flex flex-col space-y-6 mt-4 mx-auto max-w-7xl px-4 py-2">
            <div className="flex items-center justify-between">
                <Previous />
            </div>

            {menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
                    <div className="p-3 rounded-full mb-3">
                        <Utensils className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">No menu items available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {menuItems.map((item) => {
                        const activeVariantIndex = selectedVariants[item._id] ?? 0;
                        const currentVariant = item.variants?.[activeVariantIndex] || item.variants?.[0] || { price: item.price || 0, option: 'Standard' }
                        const hasMultipleVariants = item.variants && item.variants.length > 1;

                        return (
                            <div key={item._id} className="group bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/30 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
                                <div className="w-full h-52 overflow-hidden bg-gray-900 relative">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} src={item.image || "placeholder-image-url.jpg"}/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                                    {isEditMode && (
                                        <button onClick={() => handleDelete(item._id)}
                                                className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105" title="Delete menu item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-lg">
                                        <span className="text-amber-300 font-bold text-xs sm:text-sm tracking-wide">
                                            {currentVariant.price?.toFixed(0)} MMK
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-row items-center justify-between bg-white/5">
                                    <h4 className="font-bold sm:text-base line-clamp-1 tracking-wider text-center">
                                        {item.name}
                                    </h4>

                                    {hasMultipleVariants && (
                                        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                                            {item.variants.map((v, idx) => (
                                                <button key={idx} onClick={() => setSelectedVariants(prev => ({ ...prev, [item._id]: idx }))}
                                                    className={`px-2.5 py-1 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                                        activeVariantIndex === idx ? 'bg-amber-600 text-white shadow-md scale-120' : 'bg-amber-600 text-white/80 hover:bg-amber-900'
                                                    }`}
                                                >
                                                    {v.option && v.option !== 'Standard' ? v.option : `Option ${idx + 1}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {isEditMode && (
                <div className="fixed bottom-2 left-0 right-0 z-40 p-4 border-t border-white/10 flex justify-center">
                    <button className="w-full flex justify-center items-center text-white bg-amber-600 rounded-xl p-4 text-center font-semibold cursor-pointer transition-colors"
                            onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="mr-2 w-4 h-4" /> Add New Menu
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
                                <Utensils className="w-4 h-4 text-blue-600"/> Add Menu
                            </h3>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                                    onClick={() => setIsModalOpen(false)} >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input ref={inputRef} type="text" placeholder="Enter Menu Name" required
                                       value={itemName} onChange={(e) => setItemName(e.target.value)}
                                       className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            {/* Dynamic Variants Form Section */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-semibold text-gray-700">Options & Prices</label>
                                    <button
                                        type="button"
                                        onClick={handleAddVariantRow}
                                        className="text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"
                                    >
                                        + Add Option
                                    </button>
                                </div>

                                {variants.map((variant, index) => (
                                    <div key={index} className="flex items-center gap-1.5 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Option (e.g. Beef)"
                                            value={variant.option}
                                            onChange={(e) => handleVariantChange(index, 'option', e.target.value)}
                                            className="flex-1 px-2.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price"
                                            required
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            className="w-24 px-2.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                        />
                                        {variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariantRow(index)}
                                                className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Image</label>
                                <label className="border-2 border-dashed rounded-xl p-6 hover:border-blue-400 transition-colors group cursor-pointer flex flex-col items-center justify-center space-y-1">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg"/>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                            </svg>
                                            <p className="text-sm font-medium text-slate-600">Click to Upload Image</p>
                                            <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                                        </>
                                    )}
                                    <input type="file" name="image" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange}/>
                                </label>
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                                <button type="button" className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                                        onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm cursor-pointer">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isLoading && <Loading />}
            <ScrollBack />
        </div>
    );
};

export default MenuItem;