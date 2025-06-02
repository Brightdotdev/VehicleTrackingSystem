import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
  Button,
  ScrollView,
  SafeAreaView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const CarRequest = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dispatchReason, setDispatchReason] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
const [dropdownY, setDropdownY] = useState(0);
const dropdownAnim = useState(new Animated.Value(0))[0]; 
const dispatchReasonLabels = {
  office: 'Office Transport',
  logistics: 'Logistics Delivery',
  team: 'Team Movement',
  visit: 'Official Visit',
};


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{`{user}'s request for {carname}`}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.carImageText}>car image</Text>
        </View>
        <View style={styles.statusContainer}>
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

      <View style={styles.bottomSection}>
        <Text style={styles.label}>Dispatch End time</Text>
        <Text style={styles.subText}>
          how long do you plan to use the vehicle
        </Text>
        <View style={styles.dateRow}>
          <View style={styles.dateDisplay}>
            <Text style={{ color: "#000" }}>{date.toDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Image
              source={require("../assets/calendar.png")}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        )}

        <Text style={styles.label}>Dispatch Reason</Text>
        <Text style={styles.subText}>why do you need this vehicle?</Text>
        <View
  onLayout={(event) => setDropdownY(event.nativeEvent.layout.y + event.nativeEvent.layout.height)}
>
  <TouchableOpacity
    style={styles.dropdownHeader}
    onPress={() => {
      setShowDropdown(!showDropdown);
      Animated.timing(dropdownAnim, {
        toValue: showDropdown ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }}
  >
    <Text style={styles.dropdownText}>
      {dispatchReason ? dispatchReasonLabels[dispatchReason] : 'Select a reason...'}
    </Text>
    <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
  </TouchableOpacity>
</View>

{showDropdown && (
  <Animated.View
    style={[
      styles.dropdownOverlay,
      {
        top: dropdownY + 10,
        opacity: dropdownAnim,
        transform: [
          {
            scaleY: dropdownAnim,
          },
        ],
      },
    ]}
  >
    {Object.entries(dispatchReasonLabels).map(([value, label]) => (
      <TouchableOpacity
        key={value}
        style={styles.dropdownOption}
        onPress={() => {
          setDispatchReason(value);
          setShowDropdown(false);
        }}
      >
        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    ))}
  </Animated.View>
)}


        <Text style={styles.agreementText}>
          By continuing, you obviously agree to our Terms, Privacy, and the data
          collection we have to do for your dispatch.
        </Text>
  
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.getButton}>
            <Text style={styles.getButtonText}>Get Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

export default CarRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: "50%",
    backgroundColor: "#AFAFAF",
    padding: "5%",
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carImageText: {
    fontSize: 24,
    fontWeight: "700",
  },
    statusContainer: {
    alignItems: 'flex-end',
  },
   dispatchableStatus: {
    flexDirection: "row",
    alignItems: 'center',
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
  },
  bottomSection: {
    paddingHorizontal: "5%",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 20,
  },
  subText: {
    color: "#aaa",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    justifyContent: "space-between",
  },
  dateDisplay: {
  },
  calendarIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  pickerContainer: {
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 30,
  },
  agreementText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
    color: "#444",
  },
  disclaimerText: {
    fontSize: 9,
    textAlign: "center",
    color: "#222",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#404040",
    padding: 14,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  getButton: {
    backgroundColor: "#0051FF",
    padding: 14,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  getButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
 dropdownHeader: {
  backgroundColor: '#ddd',
  borderRadius: 6,
  padding: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  zIndex: 1,
},

dropdownText: {
  color: '#000',
},

dropdownArrow: {
  fontSize: 16,
  color: '#000',
},

dropdownOverlay: {
  position: 'absolute',
  left: '5%',
  right: '5%',
  backgroundColor: '#fff',
  borderRadius: 6,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  zIndex: 99,
  overflow: 'hidden',
},

dropdownOption: {
  padding: 14,
  borderBottomColor: '#eee',
  borderBottomWidth: 1,
},

optionText: {
  color: '#000',
},

});
