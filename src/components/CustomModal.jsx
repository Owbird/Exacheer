import React from 'react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

const CustomModal = ({ hasManualClose, isOpen, onClose, onOpen, title, body, secondaryAction, children, bg, bgHover, btnText, isPerfomingAction }) => {

    return (
        <Modal closeOnEsc={!hasManualClose} closeOnOverlayClick={!hasManualClose} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton disabled={hasManualClose} />
                <ModalBody>
                    {children}
                </ModalBody>

                <ModalFooter>
                    <Button disabled={hasManualClose} colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        isLoading={isPerfomingAction}
                        onClick={secondaryAction}
                        flex={1}
                        fontSize={'sm'}
                        bg={bg}
                        color={'white'}
                        boxShadow={
                            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                        }
                        _hover={{
                            bg: { bgHover },
                        }}
                    >{btnText}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CustomModal
