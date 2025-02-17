package com.example.myapp.todo.location

import android.Manifest
import android.app.Application
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.todo.utils.RequirePermissions
import com.google.accompanist.permissions.ExperimentalPermissionsApi

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MyLocation(lat: Double, long: Double, modifier: Modifier = Modifier, onLocationSelected: (Double, Double) -> Unit) {
    RequirePermissions(
        permissions = listOf(
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION
        ),
        modifier = modifier
    ) {
        ShowMyLocation(
            lat = lat,
            long = long,
            modifier = modifier,
            onLocationSelected = onLocationSelected
        )
    }
}

@Composable
fun ShowMyLocation(lat: Double,
                   long: Double,
                   modifier: Modifier,
                   onLocationSelected: (Double, Double) -> Unit) {
    val myLocationViewModel = viewModel<MyLocationViewModel>(
        factory = MyLocationViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )

    val location = myLocationViewModel.uiState
    if (location != null) {
        MyMap(
            lat = lat,
            long = long,
            modifier = modifier,
            onLocationChanged = onLocationSelected
        )
    } else {
        LinearProgressIndicator()
    }
}
