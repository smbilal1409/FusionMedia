
import { useState } from "react";
import { useAuth } from "../../Hooks/useauth";
import toast from "react-hot-toast";
import {
  changePassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../../services/auth.api.js";

const TABS = ["Account", "Password", "Avatar & Cover"];

export default function Settings() {
  const { user, setUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition border-b-2 -mb-px
              ${activeTab === tab
                ? "border-[#ae7aff] text-[#ae7aff]"
                : "border-transparent text-gray-400 hover:text-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Account"  && <AccountTab user={user} setUser={setUser} />}
      {activeTab === "Password" && <PasswordTab />}
      {activeTab === "Avatar & Cover" && <MediaTab user={user} setUser={setUser} />}
    </div>
  );
}

// ── Account details tab ────────────────────────────────────────────────────
function AccountTab({ user, setUser }) {
  const [form, setForm] = useState({
    fullName: user?.fullname || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      const res = await updateAccountDetails(form);
      setUser((prev) => ({ ...prev, ...res.data?.data }));
      setSuccess("Account updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm">Full Name</label>
        <input
          name="fullName"
          value={form.fullname}
          onChange={handleChange}
          className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm">Username</label>
        <input
          value={user?.username || ""}
          disabled
          className="rounded-lg border border-[#222] bg-[#1a1a1a] px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed"
        />
        <p className="text-gray-600 text-xs mt-1">Username cannot be changed</p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-xl bg-[#ae7aff] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

// ── Password tab ───────────────────────────────────────────────────────────
function PasswordTab() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    setSaving(true);
    setSuccess("");
    try {
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setSuccess("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "oldPassword", label: "Current Password" },
    { name: "newPassword", label: "New Password" },
    { name: "confirmPassword", label: "Confirm New Password" },
  ];

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-400 text-sm">
          {success}
        </div>
      )}
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">{f.label}</label>
          <input
            type="password"
            name={f.name}
            value={form[f.name]}
            onChange={handleChange}
            required
            placeholder={`Enter ${f.label.toLowerCase()}`}
            className="rounded-lg border border-[#333] bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:border-[#ae7aff] focus:outline-none text-sm"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-xl bg-[#ae7aff] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#9b63e5] disabled:opacity-50 transition"
      >
        {saving ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}

// ── Avatar & Cover tab ─────────────────────────────────────────────────────
function MediaTab({ user, setUser }) {
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [coverPreview, setCoverPreview] = useState(user?.coverimage || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);


const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    console.log("Selected File:", file);

    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);

    try {
        const formData = new FormData();
        formData.append("avatar", file);

        console.log("FormData created");

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        console.log("Calling updateAvatar API...");

        const res = await updateAvatar(formData);

        console.log("API Response:", res);

        setUser((prev) => ({
            ...prev,
            avatar: res.data?.data?.avatar
        }));

        toast.success("Avatar updated!");
    } catch (error) {

        console.log("FULL ERROR:", error);
        console.log("ERROR RESPONSE:", error.response);
        console.log("ERROR DATA:", error.response?.data);

        toast.error("Failed to update avatar");
    } finally {
        setUploadingAvatar(false);
    }
};
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("coverimage", file);
      const res = await updateCoverImage(formData);
      setUser((prev) => ({ ...prev, coverimage: res.data?.data?.coverimage }));
      toast.success("Cover image updated!");
    } catch {
      toast.error("Failed to update cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Avatar */}
      <div className="flex flex-col gap-3">
        <label className="text-white font-semibold text-sm">Profile Picture</label>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#ae7aff] bg-[#2a2a2a] shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#ae7aff]">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="avatarInput"
              className={`cursor-pointer rounded-xl border border-[#333] px-4 py-2 text-sm text-white hover:border-[#ae7aff] hover:text-[#ae7aff] transition text-center
                ${uploadingAvatar ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploadingAvatar ? "Uploading..." : "Change Avatar"}
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
            <p className="text-gray-500 text-xs">JPG, PNG. Auto-saved on select.</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="flex flex-col gap-3">
        <label className="text-white font-semibold text-sm">Cover Image</label>
        <div
          className="relative w-full h-36 rounded-xl overflow-hidden bg-[#1e1e1e] border border-[#2a2a2a] cursor-pointer hover:border-[#ae7aff] transition group"
          onClick={() => !uploadingCover && document.getElementById("coverInput").click()}
        >
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm group-hover:text-[#ae7aff] transition">
              Click to upload cover image
            </div>
          )}
          {uploadingCover && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-white text-sm">Uploading...</p>
            </div>
          )}
          <input
            id="coverInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
            disabled={uploadingCover}
          />
        </div>
        <p className="text-gray-500 text-xs">Recommended: 1280×720px. Auto-saved on select.</p>
      </div>
    </div>
  );
}