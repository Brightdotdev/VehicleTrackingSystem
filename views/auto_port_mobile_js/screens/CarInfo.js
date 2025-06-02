import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationDrawer from "../components/NotificationDrawer";
import { useState } from "react";

const CarInfo = () => {
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Text style={styles.carName}>Car Name</Text>
          <NotificationDrawer
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
          />
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.carImageText}>car image</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.activeStatus}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Active</Text>
          </View>

          <View style={styles.dispatchableStatus}>
            <Text style={styles.statusTextDark}>Dispatchable</Text>
            <View style={styles.checkIconContainer}>
              <View style={styles.checkIconContain}>
                <Image
                  source={require("../assets/check-check2.png")}
                  style={styles.checkIcon}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Vehicle metadata</Text>
        <View style={styles.metaItem}>
          <Image
            source={require("../assets/location.png")}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>In Transit</Text>
        </View>
        <View style={styles.metaItem}>
          <Image
            source={require("../assets/shield.png")}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>
            Health Score : <Text style={{ color: "#FF9900" }}>64%</Text>
          </Text>
        </View>
        <Text style={styles.infoItem}>Engine Type: Diesel</Text>
        <Text style={styles.infoItem}>Vehicle Type: Sedan</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request Dispatch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
          <Image
            source={require("../assets/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    // flex: 1,
    backgroundColor: "#AFAFAF",
    padding: "5%",
    height: "50%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carName: {
    fontSize: 24,
    fontWeight: "700",
  },
  bellCircle: {
    backgroundColor: "#404040",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "60%",
  },
  carImageText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  statusContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end",
  },
  activeStatus: {
    flexDirection: "row",
    width: "30%",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#69C96B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D4FAD2",
    marginRight: 6,
  },
  dispatchableStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#92A496",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    width: "50%",
  },
  dispatchableStatusContain: {},

  statusText: {
    color: "#004B00",
    fontWeight: "600",
    fontSize: 18,
    width: "90%",
    textAlign: "center",
  },
  statusTextDark: {
    color: "#1E4620",
    fontWeight: "600",
    fontSize: 18,
    marginRight: 6,
    width: "80%",
    textAlign: "center",
  },
  checkIconContain: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E4620",
  },
  checkIconContainer: {
    alignItems: "flex-end",
  },
  checkIcon: {
    width: 20,
    height: 20,
    // tintColor: '#1E4620',
  },
  infoSection: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "5%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  metaIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: "#000",
  },
  metaText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoItem: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 25,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "aboslute",
    bottom: 20,
    paddingHorizontal: "5%",
    width: "100%",
  },
  requestButton: {
    backgroundColor: "#0051FF",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: "45%",
    alignItems: "center",
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#484848",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "45%",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 6,
  },
  arrowIcon: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  },
});
