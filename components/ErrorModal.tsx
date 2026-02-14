import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'

const ErrorModal = ({isVisible,toggleModal,title,message}) => {
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={() => toggleModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.errorModal}>
                    <View style={styles.errorIcon}>
                        <Text style={styles.errorIconText}>✕</Text>
                    </View>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <TouchableOpacity
                        style={styles.errorButton}
                        onPress={() => toggleModal(false)}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ErrorModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorModal: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.8,
        maxWidth: 300,
    },
    errorIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    errorIconText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
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
    errorButton: {
        backgroundColor: '#F44336',
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