import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import NotificationDrawer from "../components/NotificationDrawer";

const DispatchRecord = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("home");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const route = useRoute();
  const { name } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../assets/cable-car.png")}
            style={styles.icon}
          />
          <Text style={styles.headerText}>
            {name ? `${name}'s Dispatch Record` : "{user}’s Dispatch Record"}
          </Text>
        </View>

        <NotificationDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        />
      </View>

      <ScrollView style={styles.tableBody}>
        <TouchableOpacity style={styles.tableHeader} onPress={()=>{navigation.navigate('ActiveDispatch')}}>
          <Text style={styles.tableHeaderText}>Car name</Text>
          <Text style={styles.tableHeaderText}>Dispatch Status</Text>
          <Text style={styles.tableHeaderText}>dispatch Score</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tableRow} onPress={()=>{navigation.navigate('PendingDispatch')}}>
          <Text style={styles.tableRowText}>Car name</Text>
          <Text style={styles.tableRowText}>Dispatch Status</Text>
          <Text style={styles.tableRowText}>dispatch Score</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tableRow} onPress={()=>{navigation.navigate('CompletedDispatch')}}>
          <Text style={styles.tableRowText}>Car name</Text>
          <Text style={styles.tableRowText}>Dispatch Status</Text>
          <Text style={styles.tableRowText}>dispatch Score</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tableRow}onPress={()=>{navigation.navigate('ActiveDispatch')}}>
          <Text style={styles.tableRowText}>Car name</Text>
          <Text style={styles.tableRowText}>Dispatch Status</Text>
          <Text style={styles.tableRowText}>dispatch Score</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.bottomText}>
        if you had more they’ll show up here lmao
      </Text>

      <View style={styles.footerNav}>
        <TouchableOpacity
          style={selected === "screen1" ? styles.activeNav : styles.nav}
          onPress={() => {
            setSelected("screen1");
            navigation.navigate("Screen1", { name });
          }}
        >
          <Image
            source={require("../assets/car-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={selected === "home" ? styles.activeNav : styles.nav}
          onPress={() => {
            setSelected("home");
            navigation.navigate("DispatchRecord", { name });
          }}
        >
          <Image
            source={require("../assets/send-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={selected === "profile" ? styles.activeNav : styles.nav}
          onPress={() => {
            setSelected("profile");
            navigation.navigate("Profile", { name });
          }}
        >
          <Image
            source={require("../assets/user-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DispatchRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: "5%",
    marginHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 8,
    resizeMode: "contain",
  },
  bellIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  bellIconCircle: {
    backgroundColor: "#484848",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableHeaderText: {
    fontWeight: "600",
    fontSize: 14,
    width: "30%",
    textAlign: "center",
  },
  tableBody: {
    flexGrow: 0,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableRowText: {
    width: "30%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomText: {
    position: "absolute",
    bottom: 70, // positions it just above footerNav
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  footerNav: {
    height: "6.5%",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#333333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },

  nav: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    height: "100%",
  },

  activeNav: {
    backgroundColor: "#0030A9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    height: "100%",
  },
});
