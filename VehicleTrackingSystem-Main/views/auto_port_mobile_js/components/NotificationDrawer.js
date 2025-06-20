import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import RNModal from 'react-native-modal';

const { height } = Dimensions.get('window');

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Welcome', message: 'Thanks for signing up!', read: false },
    { id: 2, type: 'Promo', message: 'You’ve unlocked 20% off!', read: false },
    { id: 3, type: 'Update', message: 'We’ve improved our app', read: false },
    { id: 4, type: 'System', message: 'System update complete', read: false },
  ]);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');

  const handlePress = (item) => {
    setSelectedNotification(item);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    if (selectedNotification) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === selectedNotification.id ? { ...item, read: true } : item
        )
      );
    }
    setPopupVisible(false);
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderRightActions = (progress, dragX, id) => (
    <TouchableOpacity
      onPress={() => handleDelete(id)}
      style={styles.deleteBox}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const filteredNotifications = notifications.filter((note) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !note.read;
    return note.type.toLowerCase() === filter;
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Header with bell icon */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerVisible(true)}>
            <View style={styles.bellIconCircle}>
              <Image source={require('../assets/bell-icon.png')} style={styles.bellIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Slide-up drawer */}
        <RNModal
          isVisible={drawerVisible}
          onBackdropPress={() => setDrawerVisible(false)}
          onSwipeComplete={() => setDrawerVisible(false)}
          swipeDirection="down"
          style={styles.modal}
          backdropOpacity={0.4}
        >
          <View style={styles.drawer}>
            <View style={styles.indicatorBar} />
            <Text style={styles.title}>User’s Notifications</Text>

            {/* Filter tabs */}
            <View style={styles.tabContainer}>
              {['all', 'unread'].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setFilter(tab)}>
                  <Text style={[styles.tab, filter === tab && styles.activeTab]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView>
              {filteredNotifications.map((note) => (
                <Swipeable
                  key={note.id}
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, note.id)
                  }
                >
                  <TouchableOpacity
                    style={styles.notificationItem}
                    onPress={() => handlePress(note)}
                  >
                    <View>
                      <Text style={styles.type}>{note.type}</Text>
                      <Text style={styles.message}>{note.message}</Text>
                    </View>
                    {!note.read && <View style={styles.dot} />}
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </ScrollView>
          </View>
        </RNModal>

        {/* Popup Modal */}
        <Modal transparent visible={popupVisible} animationType="fade">
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.modalContainer}>
              <View style={styles.popupBox}>
                <Text style={styles.popupTitle}>Notification</Text>
                <Text style={styles.popupMessage}>{selectedNotification?.message}</Text>
                <Pressable style={styles.closeButton} onPress={handleClosePopup}>
                  <Text style={styles.closeButtonText}>Mark as Read & Close</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>
    </GestureHandlerRootView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawer: {
    backgroundColor: '#3E3E3E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    // paddingTop: 10,
    maxHeight: height * 0.75,
  },
  header: {
    marginTop: '5%',
    alignItems: 'flex-end',
  },
  bellIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  bellIconCircle: {
    backgroundColor: '#484848',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorBar: {
    width: 100,
    height: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    color: '#bbb',
    fontWeight: '500',
    marginHorizontal: 6,
    marginVertical: 4,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  type: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#0043CE',
    borderRadius: 5,
    alignSelf: 'center',
  },
  deleteBox: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 5,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  popupBox: {
    backgroundColor: '#2C2C2C',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  popupMessage: {
    fontSize: 15,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0043CE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
