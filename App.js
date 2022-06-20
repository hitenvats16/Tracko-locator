import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Button,
  TextInput,
  Text,
  View,
  StatusBar as stat,
} from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import * as TaskManager from "expo-task-manager";
import { db } from "./firebase";
import { ref, set } from "firebase/database";
import LottieView from 'lottie-react-native';
import { Avatar } from "@rneui/base";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ChatScreen from "./ChatScreen";

function pushDataToDB(loc, fiboRoom) {
  set(ref(db, fiboRoom), loc);
}

const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";
const Stack = createNativeStackNavigator();

export default function App() {
  const [room, setRoom] = useState();
  const [shown, setShown] = useState(false);
  const [per, setPer] = useState(false);
  const [fiboRoom, setFiboRoom] = useState();
  const [sharePressed, setPressed] = useState(false);

  TaskManager.defineTask(
    TASK_FETCH_LOCATION,
    async ({ data: { locations }, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      const [location] = locations;
      try {
        pushDataToDB(location, fiboRoom);
      } catch (err) {
        console.error(err);
      }
    }
  );

  function stopLocation() {
    Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then(
      (value) => {
        if (value) {
          Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
        }
      }
    );
    console.log("sending location is stopped");
    setShown(false);
    setPressed(false)
  }

  function startSharingLocation() {
    setPressed(true);
    setFiboRoom(room);
    Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      deferredUpdatesInterval: 2000,
      foregroundService: {
        notificationTitle: 'Using your location',
        notificationBody: 'To turn off, go back to the app and switch something off.',
      },
    });
    setShown(true);
  }

  useEffect(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPer(false);
      ToastAndroid.showWithGravity("Permission is denied", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      return;
    } else {
      setPer(true);
    }
  });

  if (sharePressed === false){
    return (
      <View style={styles.container}>
        <Text
          style={{
            marginBottom: 20,
            color: "white",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          Driver's Portal
        </Text>
        <Avatar size={'xlarge'} rounded source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/MyAvatar_%2841%29.png' }} />
        <Text
          style={{
            marginTop: 20,
            color: "white",
            paddingBottom: 10,
            fontSize: 15,
            fontWeight: "700",
          }}
        >
          Enter Room Id and click to start journey
        </Text>
        <TextInput
          placeholder="RoomId"
          style={{
            backgroundColor: "#EAECF0",
            width: 200,
            height: 40,
            borderRadius: 10,
            padding: 10,
            textAlign: "center",
            marginBottom: 10,
          }}
          maxLength={10}
          onChangeText={(val) => {
            setRoom(val);
          }}
          value={room}
        />
        <Button color={'#FFCE00'} title="Start Sharing" disabled={!room} onPress={() => startSharingLocation()} />
        <StatusBar style="light" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <LottieView source={require('./assets/location.json')} autoPlay loop autoSize style={{
          width: 150,
          height: 150,
        }} />
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 10
        }}>Your Location is being shared with roomId: {room}</Text>
        <Button title="Stop Sharing" onPress={() => stopLocation()} color={"red"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1AB6D1",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: stat.currentHeight,
  },
});
