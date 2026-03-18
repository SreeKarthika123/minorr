import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
 
export default function RoleSelection() {
    const navigate = useNavigate();
 
    const roles = [
        {
            id: "employee",
            title: "Employee",
            description: "Access your dashboard, apply for jobs, and manage your profile.",
            icon: Users,
            color: "from-indigo-600 to-sky-500",
            path: "/login",
        },
        {
            id: "hr",
            title: "HR Administrator",
            description: "Manage vacancies, analyze candidates, and oversee recruitment.",
            icon: ShieldCheck,
            color: "from-indigo-600 to-violet-600",
            path: "/hr-login",
        },
    ];
 
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
 
            <div className="relative z-10 w-full max-w-5xl px-6 py-12">
                {/* Branding */}
                <div className="flex flex-col items-center mb-16">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 bg-white rounded-2xl shadow-sm border border-indigo-50 mb-6"
                    >
                        <Sparkles className="w-10 h-10 text-indigo-600" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        {/* <span className="text-indigo-600 font-black tracking-widest text-xs uppercase block mb-2">
                            Talent Intelligence Platform
                        </span> */}
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">Role</span>
                        </h1>
                        {/* <p className="mt-4 text-gray-500 font-medium text-lg">
                            Please choose a portal to continue to your dashboard.
                        </p> */}
                    </motion.div>
                </div>
 
                {/* Role Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                            onClick={() => navigate(role.path)}
                            className="group cursor-pointer"
                        >
                            <div className="h-full bg-white border border-gray-100 rounded-[40px] p-10 shadow-xl shadow-indigo-100/20 hover:shadow-indigo-200/30 transition-all duration-300 relative overflow-hidden">
                                {/* Visual Accent */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-[0.03] blur-3xl rounded-full group-hover:opacity-[0.08] transition-opacity`} />
 
                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform duration-300`}>
                                        <role.icon className="w-8 h-8" />
                                    </div>
 
                                    <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                                        {role.title}
                                    </h3>
 
                                    <p className="text-gray-500 font-medium leading-relaxed mb-8 text-lg">
                                        {role.description}
                                    </p>
 
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                                        <span>Continue to Portal</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
 
                {/* Footer Info */}
                {/* <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-16 text-sm text-gray-400 font-medium"
                >
                    Secure access powered by <span className="text-gray-600 font-bold">Talent Intelligence AI</span>
                </motion.p> */}
            </div>
        </div>
    );
}