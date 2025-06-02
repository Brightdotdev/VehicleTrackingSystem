import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import NotificationDrawer from "../components/NotificationDrawer";

const Screen1 = () => {
  const route = useRoute();
  const { name } = route.params || {};
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState("screen1");
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../assets/cable-car.png")}
            style={styles.icon}
          />
          <Text style={styles.headerText}>
            {name ? `${name}'s fleet` : "{user}’s fleet"}
          </Text>
        </View>
        <NotificationDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Available Vehicle’s</Text>
        {[1, 2].map((_, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardImage}>
              <Text style={styles.imageText}>Vehicle image</Text>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoTitleCheck}>
                <Text style={styles.infoTitle}>Vehicle Model</Text>
                <View style={styles.infoCheck}>
                  <Image source={require("../assets/check-check.png")} />
                </View>
              </View>
              <Text style={styles.infoSubTitle}>Vehicle Name</Text>
              <Text style={styles.infoSubTitle}>Health Score</Text>
              <Text style={styles.infoSubTitle}>Location</Text>
              <Text style={styles.infoSubTitle}>Vehicle Metadata</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.dispatchBtn} onPress={()=>{navigation.navigate('CarInfo')}}>
                  <Text style={styles.btnText}>Request Dispatch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoBtn} onPress={()=>{navigation.navigate('CarInfo')}}>
                  <Image source={require("../assets/Vector.png")} />
                  <Text style={styles.infoBtnText}>Vehicle Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerTextHolder}>
        <Text style={styles.footerText}>Not what you’re looking</Text>
        <Text style={styles.footerText1}>for?...request for a vehicle</Text>
      </View>

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
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: "3%",
    marginHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: "20%",
    aspectRatio: 1,
    marginRight: 10,
    resizeMode: "contain",
  },
  bellIcon: {
    height: undefined,
    aspectRatio: 1,
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
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginTop: "8%",
    marginBottom: "10%",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  scrollContainer: {
    paddingHorizontal: "1%",
    marginBottom: "10%",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: "5%",
    // height: '50%'
  },
  cardImage: {
    width: "45%",
    backgroundColor: "#9D9D9D",
    justifyContent: "center",
    paddingLeft: "7%",
  },
  imageText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 20,
  },
  cardInfo: {
    width: "55%",
    padding: "1%",
    paddingVertical: "3%",
    backgroundColor: "#f0f0f0",
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  infoTitleCheck: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoCheck: {
    backgroundColor: "#00842359",
    width: 20,
    height: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
  },

  infoSubTitle: {
    fontSize: 14,
    margin: "1%",
    color: "#000",
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: "15%",
    justifyContent: "space-between",
  },
  dispatchBtn: {
    backgroundColor: "#0051FF",
    paddingHorizontal: "5%",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBtn: {
    backgroundColor: "#e5e5e5",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    borderRadius: 4,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  infoBtnText: {
    color: "#0057ff",
    fontSize: 10,
    fontWeight: "600",
  },
  footerTextHolder: {
    position: "aboslute",
    bottom: 60,
    width: "100%",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footerText1: {
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
