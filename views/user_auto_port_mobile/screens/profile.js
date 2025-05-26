    import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const profile = () => {
  const [selected, setSelected] = React.useState('profile');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topRow}>
        <View style={styles.logoutContainer}>
      <Image source={require('../assets/log-in.png')} />
        <Text style={styles.logoutText}>Log Out</Text>
        </View>
        <View style={styles.bellCircle}>
          <Image source={require('../assets/bell-icon.png')} style={styles.bellIcon} />
        </View>
        </View>

      {/* profile Info */}
      <View style={styles.profileSection}>
        <Image source={require('../assets/fineGal.png')} style={styles.profileImage} />
        <Text style={styles.username}>username</Text>
      </View>

      {/* Total Dispatches */}
      <View style={styles.dispatchSummary}>
        <Image source={require('../assets/truck-icon.png')} style={styles.dispatchIcon} />
        <Text style={styles.dispatchText}>Total Dispatches</Text>
      </View>

      {/* History Table */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Image source={require('../assets/history-icon.png')} style={styles.historyIcon} />
          <Text style={styles.historyTitle}>HISTORY</Text>
        </View>

        {/* Table Headers */}
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Car name</Text>
          <Text style={styles.tableHeader}>Dispatch Status</Text>
          <Text style={styles.tableHeader}>Dispatch Score</Text>
        </View>

        {/* Table Rows */}
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>Car name</Text>
            <Text style={styles.tableCell}>Dispatch Status</Text>
            <Text style={styles.tableCell}>Dispatch Score</Text>
          </View>
        ))}
      </View>

      {/* Footer Navigation */}
      <View style={styles.footerNav}>
      <TouchableOpacity
        style={selected === 'home' ? styles.activeNav : styles.nav}
        onPress={() => {
          setSelected('home');
          navigation.navigate('activeDispatch');
        }}
      >
        <Image source={require('../assets/car-icon.png')} style={styles.footerIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={selected === 'screen1' ? styles.activeNav : styles.nav}
        onPress={() => {
          setSelected('screen1');
          navigation.navigate('screen1'); 
        }}
      >
        <Image source={require('../assets/send-icon.png')} style={styles.footerIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={selected === 'profile' ? styles.activeNav : styles.nav}
        onPress={() => {
          setSelected('profile');
          navigation.navigate('profile'); // your screen name here
        }}
      >
        <Image source={require('../assets/user-icon.png')} style={styles.footerIcon} />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    fontWeight: '600',
    fontSize: 14,
  },
  bellCircle: {
    backgroundColor: '#484848',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 5,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  username: {
    fontWeight: '600',
    fontSize: 20,
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: '20%',
  },
  dispatchSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    padding: 10,
    paddingLeft: 10,
  },
  dispatchIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  dispatchText: {
    fontWeight: '600',
    fontSize: 14,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,  
    padding: 5,
  },
  historyIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  historyTitle: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: '#F5F5F5',
  },
  tableHeader: {
    fontWeight: '600',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
 footerNav: {
    height: '6.5%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  footerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff', // optional
  },

  nav: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    height: '100%',
  },

  activeNav: {
    backgroundColor: '#0030A9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    height: '100%',
  },
});
