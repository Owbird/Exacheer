import React from "react";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { authentication } from "../utils/firebase"
import { onAuthStateChanged } from "firebase/auth";

import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { getUserData, signOut } from '../utils/firebase';



function ProtectedRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true)
    const [cookies, setCookie] = useCookies(['user']);

    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(authentication, (user) => {
            console.log(user)
            if (user) {

                getUserData(user.email).then((res) => {

                    if (res.error) { }
                    else {
                        setCookie('user', res, { path: '/' })
                        setIsLoading(false)
                    }
                })

            } else {
                navigate("/auth")
            }
        });


    }, [])

    return (
        isLoading ? <Spinner /> : children
    );
}

export default ProtectedRoute;
