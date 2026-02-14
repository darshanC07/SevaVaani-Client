import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'

const SuccessModal = ({ isVisible, toggleModal, title, message, handleOk }) => {
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={() => toggleModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.successModal}>
                    <View style={styles.successIcon}>
                        <Text style={styles.successIconText}>✓</Text>
                    </View>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <TouchableOpacity
                        style={styles.successButton}
                        onPress={handleOk}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default SuccessModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    successModal: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.8,
        maxWidth: 300,
    },
    successIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    successIconText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },

    successButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 30,
        minWidth: 100,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})