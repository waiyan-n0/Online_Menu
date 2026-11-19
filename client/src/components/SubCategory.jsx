import React, { useState, useEffect, useRef } from "react";
import { Plus, X, FolderPlus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubCategory = ({ slug, isEditMode, selectedCategory }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalCategory, setModalCategory] = useState(selectedCategory || '');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [error, setError] = useState(false);

    const inputRef = useRef(null);
    const API_URL = `http://${window.location.hostname}:3000`;

    const getSubCategory = async () => {
        try {
            const response = await fetch(`${API_URL}/menu/${slug}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            if (!response.ok || !data.con) {
                setError(true);
                return;
            }
            setAllSubCategories(data.result.subCategory);
            setCategories(data.result.category);
        } catch (err) {
            setError(true);
        }
    };

    useEffect(() => {
        if (slug) {
            getSubCategory();
        }
    }, [slug]);

    useEffect(() => {
        if (selectedCategory) {
            setModalCategory(selectedCategory);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subCategoryName.trim() || !modalCategory) return;

        try {
            const response = await fetch(`${API_URL}/menu/${slug}/${modalCategory}/create-subCate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: subCategoryName }),
            });
            const data = await response.json();

            if (!response.ok || !data.con) {
                return;
            }

            setAllSubCategories(prev => [...prev, data.result]);
            setIsModalOpen(false);
            setSubCategoryName('');
        } catch (err) {
            console.error(err);
        }
    };

    const activeCatObj = categories.find(cat => cat.name === selectedCategory);
    const filteredSubCategories = allSubCategories.filter(
        sub => activeCatObj && sub.categoryId === activeCatObj._id
    );

    const handleSubMenu = async (submenu) => {
        if (!isEditMode) {
            navigate(`/menu/${slug}/${submenu}`);
            return;
        }
        navigate(`/menu/${slug}/${submenu}?mode#edit`);
    };

    const handleDelete = async (Id) => {
        if (!window.confirm("This will delete the category and all its menu items. Are you sure you want to delete this?")) return;
        try {
            const response = await fetch(`${API_URL}/menu/${slug}/delete-submenu`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Id }),
            });

            const data = await response.json();

            if (!response.ok || !data.con) {
                console.error('Error deleting sub category :', data);
                return;
            }
            setAllSubCategories(prev => prev.filter(item => item._id !== Id));
        } catch (err) {
            console.error('Network error during deletion:', err);
        }
    };

    return (
        <div className='flex flex-col space-y-4 mt-4 mx-4 p-4 bg-white text-black'>
            {filteredSubCategories.length === 0 ? (
                <div className='bg-white border border-black rounded-xl p-6 text-center text-black'>
                    There is no menu yet.
                </div>
            ) : (
                <div className='flex flex-wrap gap-2 items-center'>
                    {filteredSubCategories.map((sub) => (
                        <div key={sub._id} onClick={() => handleSubMenu(sub.name)}
                            className='relative w-full flex items-center justify-center bg-white text-black p-4 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors border border-black'
                        >
                            <span className="text-center font-medium">{sub.name}</span>
                            {isEditMode && (
                                <button className="absolute right-4 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors cursor-pointer" title="Delete Subcategory"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(sub._id);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isEditMode && (
                <div className='fixed bottom-2 left-0 right-0 z-40 p-4 bg-white border-t border-black flex justify-center'>
                    <button className='w-full max-w-2xl flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 rounded-xl p-4 text-center font-semibold cursor-pointer transition-colors'
                        onClick={() => {
                            getSubCategory();
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className='mr-2 w-4 h-4' /> Add Subcategory
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-black p-6 rounded-xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border-2 border-black">
                        <div className="flex items-center justify-between border-b border-black pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-black">
                                <FolderPlus className="w-4 h-4 text-blue-600" /> Add Subcategory
                            </h3>
                            <button className="p-1 bg-black text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-black mb-1">Select Main Category</label>
                                <select value={modalCategory} onChange={(e) => setModalCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-black rounded-lg text-xs focus:outline-none focus:border-blue-600 bg-white text-black"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-black mb-1">Subcategory Name</label>
                                <input ref={inputRef} type="text" placeholder="e.g. Soup Menu, Tea Series" required
                                    value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)}
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

export default SubCategory;