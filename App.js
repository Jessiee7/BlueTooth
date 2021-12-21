import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, PermissionsAndroid, FlatList } from 'react-native'
import { BleManager } from 'react-native-ble-plx';


const App = () => {

  const manager = new BleManager();
  
  const [deviceId, setDeviceId] = useState('') 
  const [deviceName, setDeviceName] = useState('')
  const [deviceLocalName, setDeviceLocalName] = useState('')
  const [serviceUUID, setServiceUUID] = useState('')
  const [powerOn, setPowerOn] = useState('')
  const [rssi, setRssi] = useState('')
  const [isConnectable, setIsConnectable] = useState('')
  const [scanning, setScanning] = useState('')
    
  useEffect(() => {

     if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
              } else {
                console.log("User refuse");
              }
            });
          }
      });
    }  
  },[])
  
              // useEffect(() => {
              // const subscription = manager.onStateChange((state) => {
              //   if (state === 'PoweredOn') {
              //       setPowerOn('Bluetooth On')
              //       // scanAndConnect();
              //       console.log('Connected', state)
              //       subscription.remove();
              //         // manager.destroy();
              //   }
              //   if (state === 'PoweredOff') {
              //     setPowerOn('Bluetooth Off')
              //      subscription.remove();
              //   }
              // }, true);
              // return () => subscription.remove();
              // }, [manager]);
  

  const checkStatus = () => {
    const subscription = manager.onStateChange((state) => {
                  
                if (state === 'PoweredOn') {
                    setPowerOn('Bluetooth On')
                    // scanAndConnect();
                    console.log('Connected', state)
                    subscription.remove();
                      // manager.destroy();
                }
                if (state === 'PoweredOff') {
                  setPowerOn('Bluetooth Off')
                   subscription.remove();
                }
              }, true);
              return () => subscription.remove();
              }
  
  
  const scanAndConnect = async () => {
   
    if (powerOn === 'Bluetooth On') {
      
      manager.startDeviceScan([], null, (error, device) => {

            setScanning('Scanning...')
        if (error) {
          // Handle error (scanning will be stopped automatically)
          setPowerOn(error)
          console.log('Error', error)
          return
        }
        console.log('----------------------------------------------------------------------------------------------', device)

        console.log(device.name, device.localName, device.serviceUUIDs, device.isConnectable, device.id)
            
        setDeviceId(device.id)
        setDeviceName(device.name)
        setDeviceLocalName(device.localName)
        setServiceUUID(device.serviceUUIDs)
        setRssi(device.rssi)
        setIsConnectable(device.isConnectable)

        setTimeout(() => {
          
        setScanning('')
        }, 3000);
        // manager.connectToDevice(device.id,true)

        manager.stopDeviceScan();
      });
    } else {
      console.log('Something Went Wrong')
                setScanning('Unable To Scan')
    }
          }








  return (
    <View style={styles.mainConainer}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
     
      <TouchableOpacity  onPress={()=> checkStatus()} style={styles.buttonCheck}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
          {'Check Status'}
        </Text>
        </TouchableOpacity>
         <Text style={{ color: powerOn === 'Bluetooth On' ? 'green' : 'red', fontWeight: 'bold', fontSize: 16, marginVertical: '2%' , marginHorizontal: '5%'}} >{powerOn ? powerOn : '<--Check'}</Text>
</View>
        
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: scanning === 'Scanning...' ? 'green' : 'red' , marginVertical: '2%'}}>
          {scanning}
        </Text>

      <TouchableOpacity  onPress={()=> scanAndConnect()} style={styles.button}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'blue'}}>
          {'SCAN'}
        </Text>
      </TouchableOpacity>
              <View style={{ alignItems: 'center', width: '100%'}}>
                <View style={{flexDirection:'row', alignItems: 'center',  width: '80%'}}>
                   <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                       Device Name: 
                </Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green', marginStart: '2%'}}>
                       {deviceName ? deviceName : 'NaN'}
                  </Text>
                </View>

        <View style={{flexDirection:'row', alignItems: 'center',  width: '80%'}}>
                   <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                       Device ID: 
                </Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green', marginStart: '2%'}}>
                       {deviceId}
                  </Text>
                </View>

        <View style={{flexDirection:'row', alignItems: 'center',  width: '80%'}}>
                   <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                        Device UUID: 
                </Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green', marginStart: '2%'}}>
                      {serviceUUID}
                  </Text>
        </View>

        <View style={{flexDirection:'row', alignItems: 'center',  width: '80%'}}>
                   <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                        RSSI: 
                </Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green', marginStart: '2%'}}>
                      {rssi}
                  </Text>
        </View>


          <View style={{flexDirection:'row', alignItems: 'center',  width: '80%'}}>
                   <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                        IsConnectable: 
                </Text>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green', marginStart: '2%'}}>
                      {isConnectable == null ? 'Non Connectable' : 'Connectable'}
                  </Text>
        </View>
  
          </View>
      
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '80%', marginVertical: '2%'}}>
          <TouchableOpacity  onPress={()=> null } style={styles.ConnectBtn}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>
            {'Connect'}
          </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=> null} style={styles.DisconnectBtn}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>
            {'Disconnect'}
          </Text>
        </TouchableOpacity>
      </View>
     
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  mainConainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: '16%'
  },
  button: {
    width: 260, height: 40, borderRadius: 10, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', marginVertical: '3%'
  },
  buttonCheck: {
    width: 120, height: 40, borderRadius: 10, backgroundColor: '#242B2E', justifyContent: 'center', alignItems: 'center', marginVertical: '3%'
  },
  ConnectBtn: {
     width: 100, height: 40, borderRadius: 99, backgroundColor: '#22CB5C', justifyContent: 'center', alignItems: 'center', marginVertical: '3%'
  },
   DisconnectBtn: {
     width: 100, height: 40, borderRadius: 99, backgroundColor: '#FF6263', justifyContent: 'center', alignItems: 'center', marginVertical: '3%'
  }
})

