import React, { useState, useRef, useEffect } from "react";
import { Plus, X, FolderPlus } from "lucide-react";
import SubCategory from "./SubCategory.jsx";

const MainCategory = ({ slug, isEditMode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const API_URL = `http://${window.location.hostname}:3000`;

    const getMainCategory = async () => {
        try {
            const response = await fetch(`${API_URL}/menu/${slug}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            if (!response.ok || !data.con) {
                console.log('Error getting main category!', response);
                setError(true);
                return;
            }
            //console.log('data: ',data);
            const fetchedCategories = data.result.category || [];
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0 && !selectedCategory) {
                setSelectedCategory(fetchedCategories[0].name);
            }
        } catch (err) {
            console.log('Network error:', err);
            setError(true);
        }
    };

    useEffect(() => {
        if (slug) {
            getMainCategory();
        }
    }, [slug]);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        try {
            const response = await fetch(`${API_URL}/menu/${slug}/create-cate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: categoryName }),
            });
            const data = await response.json();

            if (!response.ok || !data.con) {
                setError(true);
                console.log('Error creating category:', response);
                return;
            }
            alert('Category created successfully.');
            setIsModalOpen(false);
            setCategoryName('');
            getMainCategory();
        } catch (err) {
            console.log('Network error:', err);
        }
    };

    const selectCategory = (name) => {
        setSelectedCategory(name);
    };
    //console.log('select cate: ',selectedCategory)
    return (
        <div className='flex flex-col w-full'>
            <div className='flex items-center justify-center gap-3 py-4 bg-blue-900 text-white flex-wrap px-4'>
                {categories.map((cat) => (
                    <div key={cat._id} onClick={() => selectCategory(cat.name)}
                        className={`cursor-pointer border px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedCategory === cat.name ? 'bg-blue-600 border-white shadow-md' : 'bg-blue-800 border-blue-700 hover:bg-blue-700'}`}
                    >
                        {cat.name}
                    </div>
                ))}

                {isEditMode && (
                    <div className='border-2 border-dashed border-white/60 px-3 py-2 rounded-xl cursor-pointer hover:border-white transition-colors flex items-center gap-1.5 text-xs font-semibold'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </div>
                )}
            </div>
            <SubCategory slug={slug} isEditMode={isEditMode} selectedCategory={selectedCategory} />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
                                <FolderPlus className="w-4 h-4 text-blue-600" /> Add Main Category
                            </h3>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                                    onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                                <input ref={inputRef} type="text" placeholder="e.g. Desserts, Beverages" required
                                    value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm cursor-pointer">
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainCategory;