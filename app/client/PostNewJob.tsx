import BottomNavBar from "@/components/BottomNavBar";
import { postJob } from "@/services/GlobalAPIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";

const PostNewJob = () => {
  const router = useRouter();
  const [serviceText, setServiceText] = useState("");
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [durationHours, setDurationHours] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [location, setLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [description, setDescription] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ?? 24);

  const serviceOptions = useMemo(
    () => [
      "Plumbing",
      "Electrician",
      "Carpentry",
      "Cleaning",
      "Painting",
      "AC Repair",
      "Pest Control",
    ],
    []
  );

  const filteredServices = useMemo(() => {
    const query = serviceText.trim().toLowerCase();
    if (!query) return serviceOptions;
    return serviceOptions.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [serviceOptions, serviceText]);

  const handlePostJob = async () => {
    // Validation
    if (!serviceText.trim()) {
      Alert.alert("Error", "Please select a service type");
      return;
    }
    if (!jobDetails.trim()) {
      Alert.alert("Error", "Please enter job details");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter job location");
      return;
    }

    setIsPosting(true);
    
    try {
      // Get actual user ID from AsyncStorage
      const userId = await AsyncStorage.getItem("uid");
      console.log("Retrieved userId:", userId);
      if (!userId) {
        Alert.alert("Error", "User not authenticated. Please login again.");
        return;
      }
      
      const jobData = {
        user_id: userId,
        service_type: serviceText,
        job_details: jobDetails,
        location: location,
        budget_min: budgetMin || null,
        budget_max: budgetMax || null,
        duration: durationHours || null,
        description: description
      };
      
      console.log("Sending job data:", jobData);

      const response = await postJob(jobData);
      
      setShowSuccessAlert(true);
    } catch (error) {
      setShowErrorAlert(true);
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <NavBar />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.formCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.heading}>Confirm Post</Text>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Service:</Text>
                <View
                  style={[
                    styles.serviceInputWrap,
                    isServiceOpen && styles.fieldInputWrapOpen,
                    
                  ]}
                >
                  <TextInput
                    style={styles.serviceInput}
                    value={serviceText}
                    onChangeText={setServiceText}
                    placeholder="Enter service type"
                    placeholderTextColor="grey"
                    onFocus={() => setIsServiceOpen(true)}
                  />
                </View>
                {isServiceOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView
                      style={styles.dropdownScroll}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator
                    >
                      {filteredServices.length === 0 ? (
                        <Text style={styles.dropdownEmptyText}>
                          No matching services
                        </Text>
                      ) : (
                        filteredServices.map((item, index) => (
                          <TouchableOpacity
                            key={item}
                            style={[
                              styles.dropdownItem,
                              index !== filteredServices.length - 1 &&
                                styles.dropdownItemDivider,
                            ]}
                            onPressIn={() => {
                              setServiceText(item);
                              setIsServiceOpen(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Job:</Text>
                <View style={styles.jobInputWrap}>
                  <TextInput
                    style={styles.jobInput}
                    value={jobDetails}
                    onChangeText={setJobDetails}
                    onFocus={() => setIsServiceOpen(false)}
                    placeholder="Enter job details"
                    placeholderTextColor="grey"
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Location:</Text>
                <View style={styles.locationInputWrap}>
                  <TextInput
                    style={styles.locationInput}
                    value={location}
                    onChangeText={setLocation}
                    onFocus={() => setIsServiceOpen(false)}
                    placeholder="Enter job location"
                    placeholderTextColor="grey"
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Budget Range:</Text>
                <View style={styles.budgetRow}>
                  <View style={styles.budgetMinInputWrap}>
                    <TextInput
                      style={styles.budgetMinInput}
                      keyboardType="number-pad"
                      value={budgetMin}
                      onChangeText={setBudgetMin}
                      placeholder="0.rs"
                      placeholderTextColor="grey"
                      onFocus={() => setIsServiceOpen(false)}
                    />
                  </View>
                  <Text style={styles.budgetSeparator}>to</Text>
                  <View style={styles.budgetMaxInputWrap}>
                    <TextInput
                      style={styles.budgetMaxInput}
                      keyboardType="number-pad"
                      value={budgetMax}
                      onChangeText={setBudgetMax}
                      placeholder="0.rs"
                      placeholderTextColor="grey"
                      onFocus={() => setIsServiceOpen(false)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Duration:</Text>
                <View style={styles.durationRow}>
                  <View style={styles.durationInputWrap}>
                    <TextInput
                      style={styles.durationInput}
                      keyboardType="number-pad"
                      value={durationHours}
                      placeholder="0"
                      placeholderTextColor="grey"
                      onChangeText={(text) =>
                        setDurationHours(text.replace(/[^0-9]/g, ""))
                      }
                      onFocus={() => setIsServiceOpen(false)}
                    />
                  </View>
                  <Text style={styles.durationSuffix}>hrs</Text>
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Description:</Text>
                <View style={styles.descriptionInputWrap}>
                  <TextInput
                    style={styles.descriptionInput}
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter job description"
                    placeholderTextColor="grey"
                    onFocus={() => setIsServiceOpen(false)}
                  />
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.postButton, isPosting && styles.postButtonDisabled]} 
                  onPress={handlePostJob}
                  disabled={isPosting}
                >
                  <Text style={styles.postButtonText}>
                    {isPosting ? "Posting..." : "Post a Job"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomNavBar />
      
      {/* Success Alert Modal */}
      <Modal
        transparent={true}
        visible={showSuccessAlert}
        animationType="fade"
        onRequestClose={() => setShowSuccessAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Good job!</Text>
            <Text style={styles.modalMessage}>Job Posted Successfully!</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessAlert(false);
                // Reset form and navigate back
                setServiceText("");
                setJobDetails("");
                setLocation("");
                setBudgetMin("");
                setBudgetMax("");
                setDurationHours("");
                setDescription("");
                router.replace("/client");
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Error Alert Modal */}
      <Modal
        transparent={true}
        visible={showErrorAlert}
        animationType="fade"
        onRequestClose={() => setShowErrorAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>✕</Text>
            </View>
            <Text style={styles.modalTitle}>Oops...</Text>
            <Text style={styles.modalMessage}>unable to post a job</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setShowErrorAlert(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default PostNewJob;

const styles = StyleSheet.create({
  formCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "slategray",
    height: "90%",
    backgroundColor: "#FDFAFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 20,
  },
  formContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#3A3A3A",
  },
  fieldRow: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  serviceInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 40,
  },
  fieldInputWrapOpen: {
    borderColor: "#2E5AEF",
  },
  serviceInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  jobInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 40,
  },
  jobInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  locationInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 40,
  },
  locationInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  budgetMinInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
  },
  budgetMinInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  budgetMaxInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
  },
  budgetMaxInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  durationInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    height: 40,
    flex: 0.22,
    minWidth: 70,
  },
  durationInput: {
    flex: 1,
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
  },
  descriptionInputWrap: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 90,
  },
  descriptionInput: {
    fontSize: 13,
    color: "#2F2F2F",
    textAlign: "left",
    minHeight: 70,
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetSeparator: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  durationSuffix: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#2E5AEF",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 160,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#E9F1FF",
  },
  dropdownItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#D3E0FF",
  },
  dropdownItemText: {
    color: "#1E40AF",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownEmptyText: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#6B7280",
    fontSize: 13,
  },
  actionRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#CFE5EA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A9C6CE",
  },
  cancelButtonText: {
    color: "#2F2F2F",
    fontWeight: "600",
    fontSize: 13,
  },
  postButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2E5AEF",
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  postButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  // SweetAlert Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
  },
  errorModal: {
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
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIconText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
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
  successButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 100,
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
});
