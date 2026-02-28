import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router';

const HangUpCallScreen = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      console.log("Navigating back to previous screen after hang up...");
      router.back();
      router.back();
    }, 500); 
  }, []);
  return (
    <View>
      <Text>HangUpCallScreen</Text>
    </View>
  )
}

export default HangUpCallScreen

const styles = StyleSheet.create({})