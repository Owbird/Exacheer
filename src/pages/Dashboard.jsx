import React from 'react';
import {
    Box,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,

} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
} from 'react-icons/fi';

import {
    BsBank, BsFillHeartFill, BsHeart, BsSearch,
} from 'react-icons/bs';

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { getUserData, signOut } from '../utils/firebase';
import Spinner from '../components/Spinner';
import Title from '../components/Title';
import DashboardMobileNav from '../components/DashboardMobileNav';
import DashboardSidebarContent from '../components/DashboardSidebarContent';
import MyBank from './MyBank';
import DashboardHome from './DashboardHome';
import ExamStudio from './ExamStudio';
import ProtectedRoute from '../components/ProtectedRoute';

import { useCookies } from 'react-cookie';



export default function Dashboard() {
    const linkItems = [
        { name: 'Home', icon: FiHome },
        { name: 'My bank', icon: BsBank },
        { name: 'Exam studio', icon: FiSettings },
        // { name: 'Search', icon: BsSearch },
        // { name: 'Favourites', icon: BsHeart },
    ];



    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [cookies, setCookie] = useCookies(['user']);

    useEffect(() => {

        setUserData(cookies.user)

    }, [])

    const pages = [
        <DashboardHome />,
        <MyBank userData={userData} />,
        <ExamStudio userData={userData} />,
        <h1>Explore</h1>,
        <h1>Favourites</h1>,
    ]

    return (
        <>
            <Title title="Dashboard" />
            <ProtectedRoute>
                <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                    {
                        isLoading ? <Spinner /> : <>
                            <DashboardSidebarContent
                                linkItems={linkItems}
                                currentPage={currentPage}
                                onClose={() => onClose}
                                display={{ base: 'none', md: 'block' }}
                                setCurrentPage={setCurrentPage}
                            />
                            <Drawer
                                autoFocus={false}
                                isOpen={isOpen}
                                placement="left"
                                onClose={onClose}
                                returnFocusOnClose={false}
                                onOverlayClick={onClose}
                                size="full">
                                <DrawerContent>
                                    <DashboardSidebarContent
                                        linkItems={linkItems}
                                        onClose={onClose} />
                                </DrawerContent>
                            </Drawer>

                            {/* mobilenav */}
                            <DashboardMobileNav
                                totalLinks={linkItems.length}
                                onOpen={onOpen}
                                userData={userData}
                                setCurrentPage={setCurrentPage}
                                search={(event) => console.log(event.target.value)}
                            />

                            <Box ml={{ base: 0, md: 60 }} p="4">
                                {
                                    pages[currentPage]
                                }
                            </Box></>
                    }
                </Box>
            </ProtectedRoute>
        </>
    );
}
