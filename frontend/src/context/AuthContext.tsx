import React, {createContext,useContext,useState,useEffect} from "react";

import {User,AuthResponse,authAPI} from "../services/api";

interface AuthContextType{
    user: User | null;
    token: string | null;
    login: (email:string,password:string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{ children : React.ReactNode }> = ({ children }) => {
const [user,setUser] = useState<User | null>(null);
const [token,setToken] = useState<string | null>(null);

useEffect(()=>
{
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if(savedToken && savedUser){
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
    }
},[]
)

const login = async (email:string,password:string) => {
    try{
        const response  = await authAPI.login({email,password});

        setToken(response.token);
        setUser(response.user);

        localStorage.setItem('token',response.token);   
        localStorage.setItem('user',JSON.stringify(response.user));
    }
    catch(error){
        console.error("Login failed:",error);
        throw error;
    }
};

const logout = ()=>
{
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
return(
    <AuthContext.Provider value={{user,token,login,logout}}>
        {children}
    </AuthContext.Provider>
)

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
