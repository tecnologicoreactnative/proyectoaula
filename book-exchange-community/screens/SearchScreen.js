import * as React from 'react';
import {View, Text, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function SearchScreen() {
    const [location, setLocation] = React.useState(null);

    const fetchLocation = async () => {

        const loc = await Location.getCurrentPositionAsync();
        setLocation(loc);
    };

    React.useEffect(() => {
        fetchLocation();
    }, []);



    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <MapView
                style={{flex: 1, borderRadius: 5, width: '100%', height: '100%'}}

                showsUserLocation={true}
                userLocationUpdateInterval={50000}
                followsUserLocation={false}
                showsCompass={false}
                showsPointsOfInterest={false}
                showsMyLocationButton={false}
                showsTraffic={false}
                showsIndoors={false}
                showsBuildings={false}

                initialRegion={{
                    latitude: location? location.coords.latitude: 6,
                    longitude: location? location.coords.longitude: -75,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/*<Marker*/}
                {/*    coordinate={{latitude: 6.336039, longitude: -75.570471}}*/}
                {/*    title="Ubicación"*/}
                {/*    description="Descripción de la ubicación"*/}
                {/*/>*/}
            </MapView>
        </View>
    );
}


const styles = {
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    }
}