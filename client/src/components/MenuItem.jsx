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
    const [price, setPrice] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
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

    const fetchMenuItems = async () => {
        if (!submenu) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}`);
            const data = await response.json();
            if (response.ok && data.con) {
                setMenuItems(data.result || []);
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
        if (!itemName.trim() || !price || !submenu) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', itemName);
            formData.append('price', parseFloat(price));
            if(imgFile) formData.append('image', imgFile);
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
            setIsModalOpen(false);
            setItemName('');
            setPrice('');
            setImgUrl('');
            setImgFile(null);
        } catch (err) {
            console.error('Network error:', err);
        }finally{
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
        <div className='flex flex-col space-y-4 mt-4 mx-4 p-4'>
            <Previous/>
            {menuItems.length === 0 ? (
                <div className='bg-blue-600/40 border border-white/20 rounded-xl p-6 text-center text-white/80 text-xs'>
                    No menu items available in "{submenu}".
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {menuItems.map((item) => (
                        <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between relative group hover:border-white/30 transition-all">
                            <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-800 mb-3 relative">
                                <img className="w-full h-full object-cover" alt={item.name}
                                    src={item.image || "placeholder-image-url.jpg"}
                                />
                                {isEditMode && (
                                    <button onClick={() => handleDelete(item._id)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md cursor-pointer transition-colors" title="Delete menu item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                )}
                            </div>
                            <div className='flex items-center justify-between'>
                                <h4 className="font-bold mb-1 line-clamp-1">{item.name}</h4>
                                <span
                                    className="text-blue-200 font-bold">{item.price?.toFixed(0)} MMK</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isEditMode && (
                <div className='flex justify-center'>
                    <button
                        className='w-full flex justify-center items-center bg-blue-600/40 hover:bg-blue-800 rounded-xl p-4 text-center text-xs font-semibold cursor-pointer text-white border border-dashed border-white/60 transition-colors'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className='mr-2 w-4 h-4'/> Add Menu
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div
                        className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border border-gray-100">
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

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (MMK)</label>
                                <input type="number" step="0.01" placeholder="Enter Price" required
                                       value={price} onChange={(e) => setPrice(e.target.value)}
                                       className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
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
            <ScrollBack/>
        </div>
    );
};

export default MenuItem;