package com.example.myapp.todo.ui.item

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.myapp.MyApplication
import com.example.myapp.core.Result
import com.example.myapp.core.TAG
import com.example.myapp.todo.data.Item
import com.example.myapp.todo.data.ItemRepository
import com.example.myapp.todo.data.Location
import kotlinx.coroutines.launch
import java.util.*

data class ItemUiState(
    val itemId: String? = null,
    val item: Item = Item(),
    var loadResult: Result<Item>? = null,
    var submitResult: Result<Item>? = null,
)

class ItemViewModel(private val itemId: String?, private val itemRepository: ItemRepository) :
    ViewModel() {

    var uiState: ItemUiState by mutableStateOf(ItemUiState(loadResult = Result.Loading))
        private set

    init {
        Log.d(TAG, "init")
        if (itemId != null) {
            loadItem()
        } else {
            uiState = uiState.copy(loadResult = Result.Success(Item()))
        }
    }

    fun loadItem() {
        viewModelScope.launch {
            itemRepository.itemStream.collect { items ->
                if (uiState.loadResult is Result.Loading) {
                    val item = items.find { it._id == itemId } ?: Item()
                    uiState = uiState.copy(item = item, loadResult = Result.Success(item))
                }
            }
        }
    }

    fun saveOrUpdateItem(
        title: String,
        author: String,
        pages: Int,
        inStock: Boolean,
        location: Location
    ) {
        viewModelScope.launch {
            Log.d(TAG, "saveOrUpdateItem...")
            try {
                uiState = uiState.copy(submitResult = Result.Loading)
                val item = uiState.item.copy(
                    title = title,
                    author = author,
                    pages = pages,
                    inStock = inStock,
                    location = location
                )
                val savedItem = if (itemId == null) {
                    Log.d(TAG, "save")
                    itemRepository.save(item)
                } else {
                    Log.d(TAG, "update")
                    itemRepository.update(item)
                }
                Log.d(TAG, "saveOrUpdateItem succeeded")
                uiState = uiState.copy(submitResult = Result.Success(savedItem))
            } catch (e: Exception) {
                Log.e(TAG, "saveOrUpdateItem failed: ${e.message}", e)
                uiState = uiState.copy(submitResult = Result.Error(e))
            }
        }
    }

    companion object {
        fun Factory(itemId: String?): ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app =
                    (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as MyApplication)
                ItemViewModel(itemId, app.container.itemRepository)
            }
        }
    }
}
