import React from "react";
import { useLocation } from "react-router-dom";
import { Mail, User, ShieldCheck, Calendar } from "lucide-react"; // Optional icons

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

const ProfilePage: React.FC = () => {
    const location = useLocation();

    const user = (location.state as User) || {
        firstName: "N/A",
        lastName: "",
        email: "N/A",
        role: "N/A",
        createdAt: "N/A",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 flex items-center justify-center px-6 py-12">
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl rounded-3xl p-10 max-w-3xl w-full transition-all duration-500 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-800 drop-shadow-sm">✨ User Profile</h1>
                    <p className="text-gray-600 mt-2">A glance at your personal data</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-800 text-base">
                    <div className="flex items-start gap-4">
                        <User className="text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-600">First Name</p>
                            <p className="text-lg font-medium">{user.firstName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <User className="text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Last Name</p>
                            <p className="text-lg font-medium">{user.lastName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Mail className="text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <ShieldCheck className="text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Role</p>
                            <p className="text-lg font-medium">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 sm:col-span-2">
                        <Calendar className="text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Joined On</p>
                            <p className="text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ProfilePage;
