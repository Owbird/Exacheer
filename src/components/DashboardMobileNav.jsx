import React from 'react';
import {
    IconButton,
    Avatar,
    Box,
    Flex,
    HStack,
    VStack,
    useColorModeValue,
    Text,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Input,
} from '@chakra-ui/react';
import {
    FiStar,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';

import { useNavigate } from "react-router-dom"
import { signOut } from '../utils/firebase';

import { useCookies } from 'react-cookie';


function DashboardMobileNav({
    onOpen,
    userData,
    setCurrentPage,
    totalLinks,
    search,
    ...rest
}) {
    const navigator = useNavigate()
    const [cookies, removeCookies] = useCookies(['user'])

    const _signOut = async () => {
        await signOut()
        removeCookies()
        navigator('/auth')
    }
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Exacheer
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                {/* <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                /> */}
                {/* <Input placeholder="Search..." onChange={search} /> */}
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        userData.examinerID
                                        // `https://avatars.dicebear.com/api/bottts/${userData.name}.svg`
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{userData.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {userData.institution}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            {/* <MenuItem onClick={() => setCurrentPage(totalLinks)}>My bank</MenuItem> */}
                            <MenuDivider />
                            {/* <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider /> */}
                            <MenuItem onClick={_signOut} >Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

export default DashboardMobileNav