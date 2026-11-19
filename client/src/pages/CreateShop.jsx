import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store, PlusCircle, Save, Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react";

const CreateShop = () => {
    const locationState = useLocation();
    const navigate = useNavigate();
    const editingShop = locationState.state?.shopData || null;
    const isEditing = Boolean(editingShop);

    const [shopName, setShopName] = useState(editingShop?.name || editingShop?.shopName || '');
    const [slug, setSlug] = useState(editingShop?.slug || '');
    const [tag, setTag] = useState(editingShop?.tag || '');
    const [location, setLocation] = useState(editingShop?.location || '');
    const [phones, setPhones] = useState(
        Array.isArray(editingShop?.phone) && editingShop.phone.length > 0
            ? editingShop.phone
            : Array.isArray(editingShop?.phones) && editingShop.phones.length > 0
                ? editingShop.phones
                : ['']
    );
    const [socials, setSocials] = useState(
        Array.isArray(editingShop?.socialMedia) && editingShop.socialMedia.length > 0
            ? editingShop.socialMedia.map((item) => (typeof item === 'string' ? item : item?.url || ''))
            : Array.isArray(editingShop?.socials) && editingShop.socials.length > 0
                ? editingShop.socials.map((item) => (typeof item === 'string' ? item : item?.url || ''))
                : ['']
    );
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(editingShop?.logo || null);
    const [username, setUsername] = useState(editingShop?.username || '');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = `http://${window.location.hostname}:3000`;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        setIsSubmitting(true);

        const cleanedPhones = phones.map((p) => p.trim()).filter(Boolean);
        const cleanedSocials = socials.map((s) => s.trim()).filter(Boolean);

        try {
            if (isEditing) {
                const targetSlug = editingShop.slug;
                const updatePayload = {
                    name: shopName.trim(),
                    slug: slug.trim(),
                    tag: tag.trim(),
                    location: location.trim(),
                    phone: cleanedPhones,
                    socialMedia: cleanedSocials,
                    ...(username.trim() ? { username: username.trim() } : {}),
                    ...(password ? { password } : {}),
                    ...(logoFile ? { logo: logoFile } : {}),
                };

                const response = await fetch(`${API_URL}/menu/${targetSlug}/update-shop`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatePayload),
                });

                const data = await response.json();
                if (!response.ok || data.con === false) {
                    setStatusMessage({
                        type: 'error',
                        text: data.message || 'Error updating shop!',
                    });
                    return;
                }

                const finalSlug = data.result?.slug || slug.trim() || targetSlug;
                setUrl(`${window.location.origin}/menu/${finalSlug}`);
                setStatusMessage({
                    type: 'success',
                    text: data.message || 'Shop updated successfully!',
                });
            } else {
                const createPayload = {
                    shopName: shopName.trim(),
                    slug: slug.trim(),
                    tag: tag.trim(),
                    location: location.trim(),
                    phones: cleanedPhones,
                    socials: cleanedSocials,
                    logoFile,
                    username: username.trim(),
                    password,
                };

                const response = await fetch(`${API_URL}/admin/shops/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(createPayload),
                });

                const data = await response.json();
                if (!response.ok || data.con === false) {
                    setStatusMessage({
                        type: 'error',
                        text: data.message || 'Error creating shop!',
                    });
                    return;
                }

                const generatedUrl = `${window.location.origin}/menu/${slug.trim()}`;
                setUrl(generatedUrl);
                setStatusMessage({
                    type: 'success',
                    text: 'Shop created successfully!',
                });
            }
        } catch (err) {
            console.log(err);
            setStatusMessage({
                type: 'error',
                text: isEditing ? 'Network error updating shop.' : 'Network error creating shop.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-black">
            <div className="bg-white p-6 rounded-xl border border-black space-y-6">
                <div className="flex items-center justify-between gap-3 border-b border-black pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 text-white rounded-lg">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">
                                {isEditing ? `Edit Shop: ${editingShop.name || editingShop.shopName}` : 'Create New Restaurant'}
                            </h1>
                            <p className="text-xs text-black">
                                {isEditing
                                    ? 'Update the shop profile details and save changes.'
                                    : 'Fill in the details to generate a custom shop profile.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black text-xs font-semibold text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </button>
                </div>

                {statusMessage && (
                    <div
                        className={`p-3 rounded-lg text-xs font-semibold border ${
                            statusMessage.type === 'success'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-red-600 text-white border-red-600'
                        }`}
                    >
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">Restaurant Name</label>
                            <input
                                type="text"
                                value={shopName}
                                placeholder="Enter Name"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                required
                                onChange={(e) => setShopName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">Slug (menu/example.com)</label>
                            <input
                                type="text"
                                value={slug}
                                placeholder="e.g. Enter domain name"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                required
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">Tagline</label>
                            <input
                                placeholder="e.g. Best Food in Town"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                type="text"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                placeholder="e.g. Main Street"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-black">Phone Number(s)</label>
                            {phones.map((phone, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={phone}
                                        placeholder="09123456789"
                                        className="flex-1 px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 w-20 justify-end">
                                        {phones.length > 1 && (
                                            <button
                                                type="button"
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                                onClick={() => removePhoneField(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {index === phones.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addPhoneField}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-black">Shop Logo (Image File)</label>
                            <div className="flex items-center gap-4 border border-black p-3 rounded-lg bg-white">
                                <div className="w-16 h-16 rounded-lg border border-black bg-white flex items-center justify-center overflow-hidden shrink-0">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-black" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full text-xs text-black file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border file:border-black file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-blue-600 hover:file:text-white hover:file:border-blue-600 focus:outline-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold text-black">Social Media Links</label>
                            {socials.map((social, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={social}
                                        onChange={(e) => handleSocialChange(index, e.target.value)}
                                        placeholder="https://facebook.com/..."
                                        className="flex-1 px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                    />
                                    <div className="flex items-center gap-1 w-20 justify-end">
                                        {socials.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSocialField(index)}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {index === socials.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addSocialField}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin123"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                required={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-black mb-1">
                                Password {isEditing && <span className="font-normal">(leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 bg-white text-black border border-black rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                required={!isEditing}
                            />
                        </div>
                    </div>

                    {url && (
                        <div className="p-3 rounded-lg border border-blue-600 bg-white text-xs text-black">
                            Shop URL: <span className="font-semibold text-blue-600">{url}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-4 h-4" />
                                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-4 h-4" />
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateShop;