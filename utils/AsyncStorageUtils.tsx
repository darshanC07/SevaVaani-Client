import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserId = async (): Promise<string | null> => {
    try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Retrieved User ID from AsyncStorage:", userId);
        return userId ?? null;
    } catch (error) {
        console.error("Error retrieving user ID:", error);
        return null;
    }
};


