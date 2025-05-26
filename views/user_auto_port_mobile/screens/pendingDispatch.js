import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { ScrollView } from "react-native-web";

const pendingDispatch = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerHolder}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => {
              navigation.navigate("activeDispatch");
            }}
          >
            <Image
              source={require("../assets/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Dispatch</Text>
        </View>
        <View style={styles.bellIconCircle}>
          <Image
            source={require("../assets/bell-icon.png")}
            style={styles.bellIcon}
          />
        </View>
      </View>

      {/* Dispatch Box */}
      <ScrollView>
        <View style={styles.dispatchBox}>
          <Text style={styles.dispatchTitle}>Tesla’s Dispatch</Text>

          <View style={styles.rowMain}>
            <View style={styles.row}>
              <Text style={styles.label}>Dispatch Status</Text>
            </View>
            <View style={styles.row2}>
              <View
                style={[styles.statusPill, { backgroundColor: "#1A00FF42" }]}
              >
                <View style={styles.whiteDot} />
                <Text style={styles.pillText}>PENDING</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowMain}>
            <View style={styles.row}>
              <Text style={styles.label}>Dispatch Reason</Text>
            </View>
            <View style={styles.row2}>
              <View style={[styles.statusPill, { backgroundColor: "#2B5074" }]}>
                <View style={styles.whiteDot} />
                <Text style={styles.pillText}>Transport</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowMain}>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Dispatch Request Time</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.otherSide}>
                <Text style={styles.label}>Request time</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowMain}>
            <View style={styles.row}>
              <View>
                <Text style={styles.infoText}>End time</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.otherSide}>
                <Text style={styles.infoText}>End Time</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.terminateBtnHolder}>
            <View style={styles.terminateBtn}>
              <Text style={styles.terminateText}>Terminate Dispatch</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default pendingDispatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 200,
  },
  headerHolder: {
    flexDirection: "row",
    alignItems: "center",
  },
  backCircle: {
    backgroundColor: "#484848",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backArrow: {
    color: "white",
    fontSize: 20,
    marginTop: -2,
  },
  bellIconCircle: {
    backgroundColor: "#484848",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  dispatchBox: {
    backgroundColor: "#3A3A3A",
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 20,
  },
  dispatchTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  rowMain: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    width: "55%",
    alignItems: "center",
    marginVertical: 2,
  },
  row2: {
    flexDirection: "row",
    width: "45%",
    alignItems: "center",
    marginVertical: 2,
  },

  label: {
    color: "#E0E0E0",
    fontSize: 15,
    fontWeight: "600",
  },
  infoText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "10%",
    borderRadius: 20,
    width: "100%",
  },
  whiteDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  pillText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
    width: "85%",
    textAlign: "center",
  },
  otherSide: {
    paddingHorizontal: "10%",
  },
  terminateBtnHolder: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  terminateBtn: {
    backgroundColor: "red",
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    width: "75%",
  },
  terminateText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
});
