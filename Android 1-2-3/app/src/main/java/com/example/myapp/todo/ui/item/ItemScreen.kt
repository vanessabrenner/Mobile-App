package com.example.myapp.todo.ui

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.R
import com.example.myapp.core.Result
import com.example.myapp.todo.data.Location
import com.example.myapp.todo.location.MyLocation
import com.example.myapp.todo.ui.item.ItemViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemScreen(itemId: String?, onClose: () -> Unit) {
    val itemViewModel = viewModel<ItemViewModel>(factory = ItemViewModel.Factory(itemId))
    val itemUiState = itemViewModel.uiState

    var title by rememberSaveable { mutableStateOf(itemUiState.item.title) }
    var author by rememberSaveable { mutableStateOf(itemUiState.item.author) }
    var pages by rememberSaveable { mutableStateOf(itemUiState.item.pages.toString()) }
    var inStock by rememberSaveable { mutableStateOf(itemUiState.item.inStock) }

    // Coordonate pentru locație
    var latitude by rememberSaveable { mutableStateOf(itemUiState.item.location?.lat ?: 51.5074) }
    var longitude by rememberSaveable { mutableStateOf(itemUiState.item.location?.lng ?: -0.1278) }

    var textInitialized by remember { mutableStateOf(itemId == null) }
    LaunchedEffect(itemId, itemUiState.loadResult) {
        if (textInitialized) return@LaunchedEffect
        if (itemUiState.loadResult !is Result.Loading) {
            with(itemUiState.item) {
                title = this.title
                author = this.author
                pages = this.pages.toString()
                inStock = this.inStock
                latitude = this.location?.lat ?: 51.5074
                longitude = this.location?.lng ?: -0.1278
            }
            textInitialized = true
        }
    }

    LaunchedEffect(itemUiState.submitResult) {
        if (itemUiState.submitResult is Result.Success) {
            onClose()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(id = R.string.item)) },
                actions = {
                    Button(onClick = {
                        itemViewModel.saveOrUpdateItem(
                            title = title,
                            author = author,
                            pages = pages.toIntOrNull() ?: 0,
                            inStock = inStock,
                            location = Location(lat = latitude, lng = longitude)
                        )
                    }) { Text("Save") }
                }
            )
        }
    ) {
        Column(
            modifier = Modifier
                .padding(it)
                .fillMaxSize()
        ) {
            if (itemUiState.loadResult is Result.Loading) {
                CircularProgressIndicator()
                return@Scaffold
            }
            if (itemUiState.submitResult is Result.Loading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            }
            if (itemUiState.loadResult is Result.Error) {
                Text(text = "Failed to load item: ${(itemUiState.loadResult as Result.Error).exception?.message}")
            }
            Column(modifier = Modifier.padding(16.dp)) {
                TextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Title") },
                    modifier = Modifier.fillMaxWidth()
                )
                TextField(
                    value = author,
                    onValueChange = { author = it },
                    label = { Text("Author") },
                    modifier = Modifier.fillMaxWidth()
                )
                TextField(
                    value = pages,
                    onValueChange = { pages = it },
                    label = { Text("Pages") },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = inStock,
                        onCheckedChange = { inStock = it }
                    )
                    Text(text = "In Stock")
                }

                Divider(modifier = Modifier.padding(vertical = 16.dp))
                Text(text = "Location", style = MaterialTheme.typography.titleMedium)

                MyLocation(
                    lat = latitude,
                    long = longitude,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(300.dp),
                    onLocationSelected = { lat, lng ->
                        latitude = lat
                        longitude = lng
                    }
                )
            }
            if (itemUiState.submitResult is Result.Error) {
                Text(
                    text = "Failed to submit item: ${(itemUiState.submitResult as Result.Error).exception?.message}",
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Preview
@Composable
fun PreviewItemScreen() {
    ItemScreen(itemId = "0", onClose = {})
}
