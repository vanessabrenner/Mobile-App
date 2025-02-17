package com.example.myapp.todo.location

import android.util.Log
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

val TAG = "MyMap"

@Composable
fun MyMap(
    lat: Double,
    long: Double,
    modifier: Modifier = Modifier,
    onLocationChanged: (Double, Double) -> Unit
) {
    // Marker State pentru a urmări poziția markerului
    val markerState = rememberMarkerState(position = LatLng(lat, long))
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(markerState.position, 10f)
    }

    // Variabile reactive pentru a actualiza markerul
    var currentPosition by remember { mutableStateOf(LatLng(lat, long)) }

    GoogleMap(
        modifier = modifier,
        cameraPositionState = cameraPositionState,
        onMapClick = { latLng ->
            Log.d(TAG, "onMapClick: $latLng")
            currentPosition = latLng
            markerState.position = latLng
            onLocationChanged(latLng.latitude, latLng.longitude)
        },
        onMapLongClick = { latLng ->
            Log.d(TAG, "onMapLongClick: $latLng")
            currentPosition = latLng
            markerState.position = latLng
            onLocationChanged(latLng.latitude, latLng.longitude)
        }
    ) {
        Marker(
            state = markerState,
            title = "User location",
            snippet = "User selected location"
        )
    }
}
