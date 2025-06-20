import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationDrawer from "../components/NotificationDrawer";

const CarInfo2 = () => {
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

      <View style={styles.bottomSection}>
        <View style={styles.activeStatus}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Active</Text>
        </View>

        <Text style={styles.metaTitle}>Vehicle metadata</Text>

        <View style={styles.metaItem}>
          <Image
            source={require("../assets/location.png")}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>In Transit</Text>
        </View>

        <View style={styles.metaItem}>
          <Image
            source={require("../assets/engine.png")}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>Engine Type: Diesel</Text>
        </View>

        <View style={styles.metaItem}>
          <Image
            source={require("../assets/car.png")}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>Vehicle Type: Sedan</Text>
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
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.requestButton} onPress={()=>{navigation.navigate('CarRequest')}}>
          <Text style={styles.requestButtonText}>Request Dispatch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Screen1')}
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

export default CarInfo2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
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
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carImageText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  activeStatus: {
    flexDirection: "row",
    width: "30%",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#1EFF0042",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF4F",
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
    alignSelf: "flex-end",
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
  bottomSection: {
    backgroundColor: "#fff",
    padding: "5%",
    flex: 1,
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#D4FAD2",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusToggleCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#69C96B",
    marginRight: 8,
  },
  statusToggleText: {
    color: "#1E4620",
    fontWeight: "700",
    fontSize: 14,
  },
  metaTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: "#000",
  },
  metaText: {
    fontSize: 16,
    fontWeight: "600",
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
