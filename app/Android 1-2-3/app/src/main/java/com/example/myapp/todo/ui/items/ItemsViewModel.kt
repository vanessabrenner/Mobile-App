package com.example.myapp.todo.ui.items

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.myapp.MyApplication
import com.example.myapp.core.TAG
import com.example.myapp.todo.data.Item
import com.example.myapp.todo.data.ItemRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class ItemsViewModel(private val itemRepository: ItemRepository) : ViewModel() {
    // Flux pentru lista de iteme
    val uiState: Flow<List<Item>> = itemRepository.itemStream

    // Flux pentru starea de expansiune globală
    private val _expandAll = MutableStateFlow(false)
    val expandAll: StateFlow<Boolean> = _expandAll.asStateFlow()

    init {
        Log.d(TAG, "ItemsViewModel initialized")
        loadItems()
    }

    /** Încarcă lista de iteme */
    fun loadItems() {
        Log.d(TAG, "Loading items...")
        viewModelScope.launch {
            itemRepository.refresh()
        }
    }

    /** Activează/dezactivează expansiunea globală */
    fun toggleExpandAll() {
        _expandAll.value = !_expandAll.value
        Log.d(TAG, "toggleExpandAll: ${_expandAll.value}")
    }

    /** Resetează starea de expansiune manual */
    fun resetExpandAll() {
        _expandAll.value = false
        Log.d(TAG, "resetExpandAll: false")
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app =
                    (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as MyApplication)
                ItemsViewModel(app.container.itemRepository)
            }
        }
    }
}
