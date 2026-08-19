import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce"


const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {


    const navigate = useNavigate();

    //auth States
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true);

    //States
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeProjects, setActiveProjects] = useState(null);
    const [loadingActiveProjects, setLoadingActiveProjects] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [generatingProjects, setGeneratingProjects] = useState(false);
    const [activeFile, setActiveFile] = useState("/App.js");
    const [showCode, setShowCode] = useState(false);


    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode((v) => !v);

    //Auth Actions
    const checkSession = async () =>{
        try{
            const {data} = await api.get("/api/auth/me");
            setUser(data.user);
        }catch (error){
            setUser(null);
        }finally{
            setLoadingUser(false);
        }
    }

    useEffect(() =>{
    checkSession()
},[])

    const login = async(email, password) =>{
        try{
            const {data} = await api.post("/api/auth/login", {email, password});
            setUser(data.user);
            toast.success("Welcome back!")
            navigate("/")

        }catch(error){
            console.error("login failed:",error);
            const errMsg = error?.response?.data?.error || "Invalid E-mail or Password";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    }
    const loginWithGoogle = async (credential) => {  
    try {
        // Send both 'token' and 'credential' so backend receives whichever it expects
        const { data } = await api.post("/api/auth/google", { 
            token: credential,
            credential 
        });
        
        setUser(data.user);
        toast.success("Welcome!");
        navigate("/");
    } catch (error) {
        console.error("Google login failed:", error);
        
        // Ensure error message is explicitly a STRING to avoid React rendering object crashes
        const errMsg = 
            typeof error?.response?.data?.error === "string"
                ? error.response.data.error
                : error?.response?.data?.message || "Google sign-in failed";
                
        toast.error(errMsg);
        throw new Error(errMsg);
    }
};
    const updateUserProfile = async(name, email) =>{
        try{
            const {data} = await api.put("/api/auth/profile", {name, email});
            setUser(data.user);
            toast.success("Profile updated successfully!")
        }catch(err){
            console.error("Profile update failed:", err);
            const errMsg = err?.response?.data?.error || "Failed to update profile";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    }

    const changePassword = async(currentPassword, newPassword) =>{
        try{
            await api.put("/api/auth/password", {currentPassword, newPassword});
            toast.success("Password updated successfully!")
        }catch(err){
            console.error("Password update failed:", err);
            const errMsg = err?.response?.data?.error || "Failed to update password";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    }
    const register = async(name, email, password) =>{
        try{
            const {data} = await api.post("/api/auth/register", {name, email, password});
            setUser(data.user);
            toast.success("Account created successfully!")

            navigate("/")

        }catch(err){
            console.error("Registration failed:",err);
            const errMsg = err?.response?.data?.error || "Registration failed";
            toast.error(errMsg);
        }
    }
    const logout = async()=>{
        try{
            await api.post("/api/auth/logout")
            setUser(null)
            setProjects([])
            setActiveProjects(null)
            toast.success("Logged out successfully")
            navigate("/login")
        }catch(err){
            console.error("Logout failed:", err);
            toast.error("Logout failed");
        }
    }

    //Projects actions
    const loadProjects = async () =>{
        if(!user) return;
        try{
            const {data} = await api.get("/api/projects")
            setProjects(data)        
        
        }catch(err){
            console.error("Failed to list projects:", err);
            toast.error("Failed to load projects list"); 
        }finally{
            setLoadingProjects(false);
        }
    }

    const loadProject = useCallback(async (id, silent = false) => {
        if(!user) return;
        if(!silent) setLoadingActiveProjects(true)
        try{
        const {data} = await api.get(`/api/projects/${id}`)
           setActiveProjects(data);
           
           //Default file selection
           const files = Object.keys(data.files);
           console.log("file keys:", files, "current activeFile:", activeFile); // 👈 add this line
           if(files.length > 0){
                setActiveFile((prev) => {
                console.log("prev:", prev, "isIncluded:", files.includes(prev), "willSet:", files.includes(prev) ? prev : files[0]);
                return files.includes(prev) ? prev : files[0];
    })
            }
        }catch(err){
            console.error("Failed to load projects: ",err)
            if(!silent){
                toast.error("Failed to load projects details");
                navigate("/");
            }
        }finally{
            if(!silent) setLoadingActiveProjects(false)
        }
    }, [user, navigate]);

    // Automatically poll active project status if generating or pending
    useEffect(() => {
        if(!activeProjects?._id || !user) return;

        const isOngoing = activeProjects.status === "pending" || activeProjects.status === "generating" || activeProjects.status === "revising";

        if(isOngoing){
            setChatLoading(true);
            const interval = setInterval(() =>{
                loadProject(activeProjects._id, true)
            }, 2000);
            return() => clearInterval(interval)
        }else{
            setChatLoading(false);
        }
    }, [activeProjects?._id, activeProjects?.status, loadProject, user])

    const handleGenerate = useCallback(
        async(prompt) => {
            if(!user) return;

            setGeneratingProjects(true);
            try{
                const {data} = await api.post("/api/projects", {prompt});
                toast.success("AI Agent is planning structure...")
                navigate(`/builder/${data._id}`);
            }catch(err){
                console.error("Failed to generate projects:", err);
                toast.error(err?.response?.data?.error || "Failed to generate project");
            }finally{
                setGeneratingProjects(false);
            }

        }, [navigate, user]
    )

    const handleDelete = useCallback(
        async(id) => {
            if(!user) return;
            try{
                await api.delete(`/api/projects/${id}`);
                setProjects((prev)=>prev.filter((p) =>p._id !== id))
                toast.success("Project Deleted Successfully!")
            }catch(err){
                console.error("Failed to delete projects:", err);
                toast.error("Failed to delete project");
            }

        }, [user]
    )


    const handleChat = useCallback(
        async (prompt) =>{
            if(!activeProjects || !user) return;
            setChatLoading(true)
            try {
                const{data} = await api.post(`/api/projects/${activeProjects._id}/chat`, {prompt});
                setActiveProjects(data)
                if(data.errors && data.errors.length > 0){
                    toast.error(`${data.errors.length} revision patch(es) failed`);
                }else{
                    toast.success(`Updated to version ${data.version}`);
                }
            } catch (err) {
                console.error("Revisio request failed:", err);
                toast.error(err?.response?.data?.error || "Revision request failed");
            }finally{
                setChatLoading(false)
            }

        },[activeProjects, user]
    )
    const debouncedSaveRef = React.useRef(new Map());

const getDebouncedSave = React.useCallback((id) => {
    if (!debouncedSaveRef.current.has(id)) {
        debouncedSaveRef.current.set(
            id,
            debounce(async (files) => {
                try {
                    await api.put(`/api/projects/${id}/files`, { files });
                } catch (err) {
                    console.error("Failed to auto-save files:", err);
                    toast.error("Failed to save code modifications");
                }
            }, 1000)
        );
    }
    return debouncedSaveRef.current.get(id);
}, []);

const debouncedSave = React.useCallback((files, id) => {
    getDebouncedSave(id)(files);
}, [getDebouncedSave]);

React.useEffect(() => {
    return () => {
        debouncedSaveRef.current.forEach((fn) => fn.flush());
        debouncedSaveRef.current.clear();
    };
}, []);



    const updateProjectFiles = useCallback(
        async (files) =>{
            if(!activeProjects || !user) return;
            debouncedSave(files, activeProjects._id)
        },[activeProjects, user, debouncedSave ]
    )

    return (
        <AppContext.Provider value= {{
            user,
            loadingUser,
            login,
            loginWithGoogle,
            register,
            projects,
            loadingProjects,
            activeProjects,
            loadingActiveProjects,
            chatLoading,
            generatingProjects,
            activeFile,
            showCode,
            darkMode,
            setActiveFile,
            setShowCode,
            toggleDarkMode,
            loadProject,
            loadProjects,
            handleGenerate,
            handleDelete,
            logout,
            updateProjectFiles,
            handleChat,
            updateUserProfile,
            changePassword

            }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    const context = useContext(AppContext);
    if(context === undefined){
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
}
