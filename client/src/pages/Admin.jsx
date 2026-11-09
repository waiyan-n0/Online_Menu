import { useState } from "react";
import { Store, PlusCircle, Plus, Trash2, Image as ImageIcon } from "lucide-react";

const Admin = () => {
    const [shopName, setShopName] = useState('');
    const [slug, setSlug] = useState('');
    const [tag, setTag] = useState('');
    const [location, setLocation] = useState('');
    const [phones, setPhones] = useState(['']);
    const [socials, setSocials] = useState(['']);
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const API_URL = "http://localhost:3000";

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file.name);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const handlePhoneChange = (index, value) => {
        const newPhones = [...phones];
        newPhones[index] = value;
        setPhones(newPhones);
    };
    const addPhoneField = () => {
        setPhones([...phones, '']);
    };
    const removePhoneField = (index) => {
        setPhones(phones.filter((_, i) => i !== index));
    };
    const handleSocialChange = (index, value) => {
        const newSocials = [...socials];
        newSocials[index] = value;
        setSocials(newSocials);
    };
    const addSocialField = () => {
        setSocials([...socials, '']);
    };
    const removeSocialField = (index) => {
        setSocials(socials.filter((_, i) => i !== index));
    };
    //console.log('image: ',logoFile)
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}/admin/shops/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({shopName, slug, tag, location, phones, socials, logoFile, username, password}),
            });
            const data = await response.json();
            if(!response.ok){
                console.log('Error creating shop!', data);
            }
            const generatedUrl = `${window.location.origin}/menu/${slug}`;
            setUrl(generatedUrl);
            console.log('url: ',generatedUrl);
            console.log(url);
            //console.log('data: ',data);
        }catch(err){
            console.log(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Create New Restaurant</h1>
                        <p className="text-xs text-gray-500">Fill in the details to generate a custom shop profile.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Restaurant Name</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="e.g. Golden Bistro"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="e.g. golden-bistro"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="e.g. Best Food in Town"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Main Street"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-gray-700">Phone Number(s)</label>
                            {phones.map((phone, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                        placeholder="09123456789"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                    />
                                    <div className="flex items-center gap-1 w-20 justify-end">
                                        {phones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePhoneField(index)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {index === phones.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addPhoneField}
                                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-gray-700">Shop Logo (Image File)</label>
                            <div className="flex items-center gap-4 border border-gray-200 p-3 rounded-xl bg-gray-50/50">
                                <div className="w-16 h-16 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-300" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 focus:outline-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-gray-700">Social Media Links</label>
                            {socials.map((social, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={social}
                                        onChange={(e) => handleSocialChange(index, e.target.value)}
                                        placeholder="https://facebook.com/..."
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                    />
                                    <div className="flex items-center gap-1 w-20 justify-end">
                                        {socials.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSocialField(index)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {index === socials.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addSocialField}
                                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin123"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;