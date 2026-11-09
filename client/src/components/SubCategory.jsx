import React, { useState, useEffect, useRef } from "react";
import { Plus, X, FolderPlus } from "lucide-react";
import {useNavigate} from "react-router-dom";

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
            //console.log('data: ',data)
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
    //console.log('active cate: ', activeCatObj);
    //console.log('sub categories: ',allSubCategories)
    const filteredSubCategories = allSubCategories.filter(
        sub => activeCatObj && sub.categoryId === activeCatObj._id
    );
    const handleSubMenu = async(submenu) =>{
        //console.log(name);
        if(!isEditMode) {
            navigate(`/menu/${slug}/${submenu}`);
            return;
        }
        navigate(`/menu/${slug}/${submenu}?mode#edit`);
    }

    return (
        <div className='flex flex-col space-y-4 mt-4 mx-4 p-4'>
            {filteredSubCategories.length === 0 ? (
                <div className='bg-blue-600/40 border border-white/20 rounded-xl p-6 text-center text-white/80 text-xs'>
                    There is no item yet for "{selectedCategory}".
                </div>
            ) : (
                <div className='flex flex-wrap gap-2 text-white items-center'>
                    {filteredSubCategories.map((sub) => (
                        <div key={sub._id} onClick={()=>handleSubMenu(sub.name)}
                             className='w-full text-center bg-blue-700 p-4 rounded-lg cursor-pointer shadow-sm hover:bg-blue-600 transition-colors border border-white/40'>
                            {sub.name}
                        </div>
                    ))}
                </div>
            )}

            {isEditMode && (
                <div className='flex justify-center'>
                    <button className='w-full flex justify-center items-center bg-blue-600/40 hover:bg-blue-800 rounded-xl p-4 text-center text-xs font-semibold cursor-pointer text-white border border-dashed border-white/60 transition-colors'
                            onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className='mr-2 w-4 h-4'/> Add Subcategory
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 relative my-8 sm:my-0 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
                                <FolderPlus className="w-4 h-4 text-blue-600"/> Add Subcategory
                            </h3>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                                    onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Main Category</label>
                                <select value={modalCategory} onChange={(e) => setModalCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-white"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory Name</label>
                                <input ref={inputRef} type="text" placeholder="e.g. Soup Menu, Tea Series" required
                                       value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)}
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
                                    Save Subcategory
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