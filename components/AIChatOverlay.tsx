import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AIChatOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Assistant</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.OverlayContainer}>
        
          <ScrollView 
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
          </ScrollView>
        
      </View>
    </View>
  );
};

export default AIChatOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4560F4',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  OverlayContainer: {
    flex: 1,
    backgroundColor: '#4560F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    padding: 10,
  },
 
  messagesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messagesContent: {
    padding: 15,
  },
});


