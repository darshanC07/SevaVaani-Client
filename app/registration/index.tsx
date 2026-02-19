import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const index = () => {
  const router = useRouter()
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
      style={{
        height: height,
        marginTop:
          Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
        padding: 20,
        backgroundColor: 'white',

      }}
    >
      <View style={styles.progressContainer}>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>1</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>2</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>3</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>4</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>5</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          // padding: 20,
          justifyContent: "space-evenly",
          height: height - 170,
          paddingBottom: 50
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Select a Role</Text>
          <Text style={styles.desc}>
            Start working or hiring with direct communication. We make the
            process simple and fast.
          </Text>
        </View>
        <View>
          <TouchableOpacity style={styles.selectionContainer} onPress={()=>router.push("/registration/EmailScreen?role=recruiter")}>
            <View style={styles.imgCircle}>
              <Image
                source={require("../../assets/roles/client.png")}
                style={styles.img}
              />
            </View>
            <View style={styles.roleContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Recruiter
              </Text>
              <Text>
                Hire skilled workers directly and fill your jobs faster.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionContainer} onPress={() => router.push("/registration/EmailScreen?role=worker")}>
            <View style={styles.imgCircle}>
              <Image
                source={require("../../assets/roles/worker.png")}
                style={styles.img}
              />
            </View>
            <View style={styles.roleContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>Worker</Text>
              <Text>
                Discover jobs that match your skills and connect with recruiters
                easily.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.9} onPress={() => router.push("/registration/EnterMobile")}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    // padding: 10,
  },
  line: {
    backgroundColor: "#D9D9D9",
    // backgroundColor:'#4560F4',
    width: "20%",
    alignItems: "center",
    height: 5,
    justifyContent: "center",
    // borderRadius:2
  },
  circle: {
    backgroundColor: "#D9D9D9",
    // backgroundColor:'#4560F4',
    borderRadius: "50%",
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 10,
    color: "white",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  selectionContainer: {
    height: 125,
    backgroundColor: "#95C5D7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
    gap: 12,
  },
  roleContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    gap: 10,
  },
  imgCircle: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 16,
    color: "grey",
    alignSelf: "center",
    // textAlign:'center'
  },
  footer: {
    paddingTop: 16,
    alignItems: "flex-end",
  },
  continueButton: {
    backgroundColor: "#4560F4",
    width: 170,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  }
});
