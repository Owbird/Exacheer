import React from 'react'
import Spinner from '../components/Spinner'
import { Box, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../utils/firebase"
import Title from '../components/Title';
import { useCookies } from 'react-cookie';


const VerificationWrapper = () => {

    const navigator = useNavigate()
    const [cookies] = useCookies(['user'])

    useEffect(() => {

        if (!cookies.user) {
            navigator('/auth')
        } else {
            onSnapshot(doc(database, "user data", cookies.user.email), (doc) => {
                if (doc.data()['isVerified']) {
                    navigator('/dashboard')
                }
            })
        }

    })

    return (
        <div>
            <Title title="Verification" />
            <Spinner />
            <Box textAlign="center" py={10} px={6}>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Pending verification
                </Heading>
                <Text color={'gray.500'}>
                    Please wait while verify your account.
                    <br />
                    You'll join the Exacheer once the process is done.
                </Text>
            </Box>
        </div>
    )
}

export default VerificationWrapper
