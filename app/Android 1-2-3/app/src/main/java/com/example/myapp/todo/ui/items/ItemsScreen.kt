package com.example.myapp.todo.ui.items

import android.util.Log
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.R
import com.example.myapp.todo.sensor.ShakeDetector
import com.example.myapp.todo.ui.MyNetworkStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemsScreen(
    onItemClick: (id: String?) -> Unit,
    onAddItem: () -> Unit,
    onLogout: () -> Unit
) {
    val itemsViewModel = viewModel<ItemsViewModel>(factory = ItemsViewModel.Factory)
    val itemsUiState by itemsViewModel.uiState.collectAsStateWithLifecycle(initialValue = listOf())
    val isExpandAll by itemsViewModel.expandAll.collectAsState()

    val context = LocalContext.current
    val shakeDetector = remember {
        ShakeDetector(context) {
            itemsViewModel.toggleExpandAll()
        }
    }

    DisposableEffect(Unit) {
        shakeDetector.register()
        onDispose {
            shakeDetector.unregister()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row {
                        MyNetworkStatus()
                        Text(text = stringResource(id = R.string.items))
                    }
                },
                actions = {
                    Button(onClick = onLogout) { Text("Logout") }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddItem) {
                Icon(Icons.Rounded.Add, contentDescription = "Add")
            }
        }
    ) { paddingValues ->
        ItemList(
            itemList = itemsUiState,
            onItemClick = onItemClick,
            modifier = Modifier.padding(paddingValues),
            isExpandAll = isExpandAll
        )
    }
}


@Preview
@Composable
fun PreviewItemsScreen() {
    ItemsScreen(onItemClick = {}, onAddItem = {}, onLogout = {})
}


