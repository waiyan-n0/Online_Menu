import { Plus, X, Utensils, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const MenuItem = ({ submenu, isEditMode }) => {
    const { slug } = useParams();
    const inputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const API_URL = `http://${window.location.hostname}:3000`;

    const fetchMenuItems = async () => {
        if (!submenu) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}`);
            const data = await response.json();
            if (response.ok && data.con) {
                setMenuItems(data.result);
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

        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${submenu}/create-menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: itemName,
                    price: parseFloat(price),
                    image: image
                }),
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
            setImage('');
        } catch (err) {
            console.error('Network error:', err);
        }
    };

    return (
        <div className='flex flex-col space-y-4 mt-4 mx-4 p-4'>
            {/* Display Menu Items Grid */}
            {menuItems.length === 0 ? (
                <div className='bg-blue-600/40 border border-white/20 rounded-xl p-6 text-center text-white/80 text-xs'>
                    No menu items available in "{submenu}".
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {menuItems.map((item) => (
                        <div key={item._id} className='bg-blue-800 border border-white/20 rounded-xl p-4 flex gap-3 items-center shadow-sm'>
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-white/20" />
                            ) : (
                                <div className="w-14 h-14 bg-blue-700 rounded-lg flex items-center justify-center text-white/40">
                                    <Utensils className="w-6 h-6" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                <span className="text-xs text-blue-200 font-semibold mt-1">${item.price?.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Menu Button */}
            {isEditMode && (
                <div className='flex justify-center'>
                    <button
                        className='w-full flex justify-center items-center bg-blue-600/40 hover:bg-blue-800 rounded-xl p-4 text-center text-xs font-semibold cursor-pointer text-white border border-dashed border-white/60 transition-colors'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className='mr-2 w-4 h-4'/> Add Menu Item
                    </button>
                </div>
            )}

            {/* Add Menu Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
                                <Utensils className="w-4 h-4 text-blue-600"/> Add Menu Item
                            </h3>
                            <button
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Item Name</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="e.g. Classic Iced Lemon Tea"
                                    required
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 4.50"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuItem;