import React from 'react';
import {
    Box,
    CloseButton,
    Flex,
    useColorModeValue,
    Text,
} from '@chakra-ui/react';

import DashboardNavItem from '../components/DashboardNavItem';


function DashboardSidebarContent({
    onClose,
    setCurrentPage,
    linkItems,
    currentPage,
    ...rest
}) {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Exacheer
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {linkItems.map((link, index) => (
                <DashboardNavItem
                    onClick={() => setCurrentPage(index)}
                    index={index}
                    currentPage={currentPage}
                    key={link.name}
                    icon={link.icon}
                >
                    {link.name}
                </DashboardNavItem>
            ))}


            <Text marginY={10} color="gray" alignItems="center" align="center">
                Exacheer v1.0
            </Text>
        </Box>
    );
};

export default DashboardSidebarContent