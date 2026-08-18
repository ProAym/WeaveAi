import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeftIcon, UserIcon, MailIcon, LockIcon, Loader2Icon, FolderCodeIcon, LogOutIcon } from 'lucide-react'

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, projects, updateUserProfile, changePassword, logout } = useAppContext();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [savingProfile, setSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const hasPassword = user?.hasPassword !== false;

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await updateUserProfile(name, email);
        } catch {
            // error toast already handled
        } finally {
            setSavingProfile(false);
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return;
        }
        setSavingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            // error toast already handled
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
            <nav className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4 bg-zinc-950/60 backdrop-blur-xl border-b border-white/10">
                <button onClick={() => navigate("/")} aria-label="Go back" className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer">
                    <ArrowLeftIcon size={16} />
                </button>
                <span className="text-sm font-semibold text-zinc-100">Profile Settings</span>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

                {/* Account overview */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                        {user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-sm text-zinc-400 truncate">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 shrink-0">
                        <FolderCodeIcon size={13} className="text-indigo-400" />
                        {projects?.length || 0} {projects?.length === 1 ? "project" : "projects"}
                    </div>
                </div>

                {/* Profile info form */}
                <form onSubmit={handleProfileSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white mb-1">Profile Information</h2>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                        <div className="relative flex items-center">
                            <UserIcon size={16} className="absolute left-3.5 text-zinc-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all duration-150"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                        <div className="relative flex items-center">
                            <MailIcon size={16} className="absolute left-3.5 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all duration-150"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="inline-flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all duration-150 cursor-pointer"
                    >
                        {savingProfile && <Loader2Icon size={15} className="animate-spin" />}
                        Save Changes
                    </button>
                </form>

                {/* Password form */}
                <form onSubmit={handlePasswordSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white mb-1">
                        {hasPassword ? "Change Password" : "Set a Password"}
                    </h2>
                    {!hasPassword && (
                        <p className="text-xs text-zinc-500 -mt-2">
                            Your account currently signs in with Google only. Set a password to also enable email/password sign-in.
                        </p>
                    )}

                    {hasPassword && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Current Password</label>
                            <div className="relative flex items-center">
                                <LockIcon size={16} className="absolute left-3.5 text-zinc-500" />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all duration-150"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
                        <div className="relative flex items-center">
                            <LockIcon size={16} className="absolute left-3.5 text-zinc-500" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all duration-150"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm New Password</label>
                        <div className="relative flex items-center">
                            <LockIcon size={16} className="absolute left-3.5 text-zinc-500" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all duration-150"
                            />
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={savingPassword || (newPassword !== confirmPassword)}
                        className="inline-flex items-center gap-2 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all duration-150 cursor-pointer"
                    >
                        {savingPassword && <Loader2Icon size={15} className="animate-spin" />}
                        {hasPassword ? "Update Password" : "Set Password"}
                    </button>
                </form>

                <button
                    onClick={logout}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-red-900/50 text-red-400 hover:bg-red-950/30 text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer"
                >
                    <LogOutIcon size={15} />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default ProfilePage