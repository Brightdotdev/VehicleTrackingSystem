import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import NotificationDrawer from "../components/NotificationDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [selected, setSelected] = React.useState("Profile");
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const route = useRoute();
  const { name } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(require("../assets/fineGal.png"));
  const [previewUri, setPreviewUri] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Camera access is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true });
    if (!result.cancelled) {
      setPreviewUri(result.assets[0].uri);
      setPreviewVisible(true);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.cancelled) {
      setPreviewUri(result.assets[0].uri);
      setPreviewVisible(true);
    }
  };

  const confirmImage = async () => {
    const finalUri = previewUri;
    setImageUri({ uri: finalUri });
    setPreviewUri(null);
    setPreviewVisible(false);

    try {
      await AsyncStorage.setItem("profileImage", finalUri);
    } catch (e) {
      console.log("Failed to save image:", e);
    }
  };

  const cancelPreview = () => {
    setPreviewUri(null);
    setPreviewVisible(false);
  };

  const viewProfileImage = () => {
    setPreviewUri(imageUri.uri || imageUri);
    setPreviewVisible(true);
  };
  useEffect(() => {
    const loadImage = async () => {
      try {
        const uri = await AsyncStorage.getItem("profileImage");
        if (uri) {
          setImageUri({ uri });
        }
      } catch (e) {
        console.log("Failed to load profile image:", e);
      }
    };

    loadImage();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoutContainer}>
          <Image source={require("../assets/log-in.png")} />
          <Text style={styles.logoutText}>Log Out</Text>
        </View>
        <NotificationDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        />
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={imageUri} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{name || "Username"}</Text>
      </View>

      <View style={styles.dispatchSummary}>
        <Image
          source={require("../assets/truck-icon.png")}
          style={styles.dispatchIcon}
        />
        <Text style={styles.dispatchText}>Total Dispatches</Text>
      </View>

      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Image
            source={require("../assets/history-icon.png")}
            style={styles.historyIcon}
          />
          <Text style={styles.historyTitle}>HISTORY</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Car name</Text>
          <Text style={styles.tableHeader}>Dispatch Status</Text>
          <Text style={styles.tableHeader}>Dispatch Score</Text>
        </View>

        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>Car name</Text>
            <Text style={styles.tableCell}>Dispatch Status</Text>
            <Text style={styles.tableCell}>Dispatch Score</Text>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button
              title="Take Photo (Camera)"
              onPress={() => {
                setModalVisible(false);
                pickFromCamera();
              }}
            />
            <Button
              title="Choose from Gallery"
              onPress={() => {
                setModalVisible(false);
                pickFromGallery();
              }}
            />
            <Button
              title="View Profile Picture"
              onPress={() => {
                setModalVisible(false);
                viewProfileImage();
              }}
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={previewVisible}
        onRequestClose={cancelPreview}
      >
        <View style={styles.previewOverlay}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <Button title="Use This Photo" onPress={confirmImage} />
            <Button title="Cancel" onPress={cancelPreview} />
          </View>
        </View>
      </Modal>

      <View style={styles.footerNav}>
        <TouchableOpacity
          style={selected === "home" ? styles.activeNav : styles.nav}
          onPress={() => {
            setSelected("home");
            navigation.navigate("DispatchRecord", { name });
          }}
        >
          <Image
            source={require("../assets/car-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={selected === "screen1" ? styles.activeNav : styles.nav}
          onPress={() => {
            setSelected("screen1");
            navigation.navigate("Screen1", { name });
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: "5%",
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    fontWeight: "600",
    fontSize: 14,
  },
  bellCircle: {
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
  profileSection: {
    alignItems: "center",
    marginTop: 5,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  username: {
    fontWeight: "600",
    fontSize: 20,
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: "20%",
  },
  dispatchSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    padding: 10,
    paddingLeft: 10,
  },
  dispatchIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  dispatchText: {
    fontWeight: "600",
    fontSize: 14,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    padding: 5,
  },
  historyIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  historyTitle: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: "#F5F5F5",
  },
  tableHeader: {
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
});
