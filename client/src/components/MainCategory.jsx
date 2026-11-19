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

    const handleDelete = async (id) => {
        if (!window.confirm("This will delete the category & all its subcategories & menu items. Are you sure to delete this?")) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/delete-category`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }),
            });

            const data = await response.json();

            if (!response.ok || !data.con) {
                console.error('Error deleting category :', data);
                return;
            }
            setCategories(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error('Error deleting category: ', err);
        }
    };

    return (
        <div className='flex flex-col w-full bg-white text-black'>
            <div className='flex items-center justify-center gap-4 pt-4 flex-wrap px-4'>
                {categories.map((cat) => (
                    <div key={cat._id} onClick={() => selectCategory(cat.name)}
                        className={`flex items-center justify-center border-2 cursor-pointer px-4 py-2.5 text-lg rounded-xl font-semibold transition-colors ${selectedCategory === cat.name ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-black text-black hover:bg-blue-600 hover:border-blue-600 hover:text-white'}`}
                    >
                        <span className='capitalize'>{cat.name}</span>
                        {isEditMode && (
                            <button className="pt-0.5 pl-2 cursor-pointer" title="Delete Category"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(cat._id);
                                }}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}

                {isEditMode && (
                    <div className='text-black bg-white border-black border-2 border-dashed px-3.5 py-2.5 rounded-xl cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-semibold'
                        onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Category
                    </div>
                )}
            </div>

            <SubCategory slug={slug} isEditMode={isEditMode} selectedCategory={selectedCategory} />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-black p-6 rounded-xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border-2 border-black">
                        <div className="flex items-center justify-between border-b border-black pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-black">
                                <FolderPlus className="w-4 h-4 text-blue-600" /> Add Category
                            </h3>
                            <button className="p-1 bg-black text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-black mb-1">Category Name</label>
                                <input ref={inputRef} type="text" placeholder="e.g. Desserts, Beverages" required
                                    value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-xs focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <button type="button" className="flex-1 py-2.5 bg-white hover:bg-black text-black hover:text-white border border-black font-medium rounded-lg text-xs transition-colors cursor-pointer"
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer">
                                    Save
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