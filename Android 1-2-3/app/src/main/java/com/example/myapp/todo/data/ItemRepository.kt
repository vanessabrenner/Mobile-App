package com.example.myapp.todo.data

import android.content.Context
import android.util.Log
import com.example.myapp.core.TAG
import com.example.myapp.core.data.remote.Api
import com.example.myapp.todo.data.local.ItemDao
import com.example.myapp.todo.data.remote.ItemEvent
import com.example.myapp.todo.data.remote.ItemService
import com.example.myapp.todo.data.remote.ItemWsClient
import com.example.myapp.todo.utils.ConnectivityManagerNetworkMonitor
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import java.util.concurrent.atomic.AtomicInteger

class ItemRepository(
    private val itemService: ItemService,
    private val itemWsClient: ItemWsClient,
    private val itemDao: ItemDao,
    private val context: Context
) {

    private val connectivityManagerNetworkMonitor = ConnectivityManagerNetworkMonitor(context)
    private val tempIdCounter = AtomicInteger(1)

    val itemStream by lazy { itemDao.getAll() }

    init {
        Log.d(TAG, "init")
    }

    private suspend fun isOnline(): Boolean {
        return connectivityManagerNetworkMonitor.isOnline.first()  // Obține starea curentă a conexiunii
    }

    private fun getBearerToken() = "Bearer ${Api.tokenInterceptor.token}"

    suspend fun refresh() {
        Log.d(TAG, "refresh started")
        try {
            val items = itemService.find(authorization = getBearerToken())
            itemDao.deleteAll()
            items.forEach { itemDao.insert(it) }
            Log.d(TAG, "refresh succeeded")
        } catch (e: Exception) {
            Log.w(TAG, "refresh failed", e)
        }
    }

    suspend fun openWsClient() {
        Log.d(TAG, "openWsClient")
        withContext(Dispatchers.IO) {
            getItemEvents().collect {
                Log.d(TAG, "Item event collected $it")
                if (it.isSuccess) {
                    val itemEvent = it.getOrNull();
                    when (itemEvent?.type) {
                        "created" -> handleItemCreated(itemEvent.payload)
                        "updated" -> handleItemUpdated(itemEvent.payload)
                        "deleted" -> handleItemDeleted(itemEvent.payload)
                    }
                }
            }
        }
    }

    suspend fun closeWsClient() {
        Log.d(TAG, "closeWsClient")
        withContext(Dispatchers.IO) {
            itemWsClient.closeSocket()
        }
    }

    suspend fun getItemEvents(): Flow<kotlin.Result<ItemEvent>> = callbackFlow {
        Log.d(TAG, "getItemEvents started")
        itemWsClient.openSocket(
            onEvent = {
                Log.d(TAG, "onEvent $it")
                if (it != null) {
                    trySend(kotlin.Result.success(it))
                }
            },
            onClosed = { close() },
            onFailure = { close() });
        awaitClose { itemWsClient.closeSocket() }
    }

    suspend fun update(item: Item): Item {
        if(isOnline()) {
            Log.d(TAG, "update $item...")
            val updatedItem =
                itemService.update(itemId = item._id, item = item, authorization = getBearerToken())
            Log.d(TAG, "update $item succeeded")
            handleItemUpdated(updatedItem)
            return updatedItem
        }
        else{
            Log.d(TAG, "update $item...")
//            val updatedItem =
//                itemService.update(itemId = item._id, item = item, authorization = getBearerToken())
            val localItem = item.copy(isSynced = false)
//            Log.d(TAG, "update $localItem succeeded")
            handleItemUpdated(localItem)
            Log.d(TAG, "update $item failed (offline), saved just locally with isSynced = false")
            return localItem
        }
    }

    suspend fun save(item: Item): Item {
        if(isOnline()) {
            Log.d(TAG, "save $item...")
            val createdItem = itemService.create(item = item, authorization = getBearerToken())
            Log.d(TAG, "save $item succeeded")
            handleItemCreated(createdItem)
            return createdItem
        }
        else{
            Log.d(TAG, "save $item...")

            // Generăm un ID temporar
            val tempId = "temp-id-${tempIdCounter.getAndIncrement()}"

            // Cream o copie a item-ului cu ID-ul temporar și isSynced = false
            val localItem = item.copy(_id = tempId, isSynced = false)

            handleItemCreated(localItem)
            Log.d(TAG, "save $item failed (offline), saved just locally with isSynced = false and tempId = $tempId")
            return localItem
        }
    }

    private suspend fun handleItemDeleted(item: Item) {
        Log.d(TAG, "handleItemDeleted - todo $item")
    }

    private suspend fun handleItemUpdated(item: Item) {
        Log.d(TAG, "handleItemUpdated...")
        itemDao.update(item)
    }

    private suspend fun handleItemCreated(item: Item) {
        Log.d(TAG, "handleItemCreated...")
        itemDao.insert(item)
    }

    suspend fun deleteAll() {
        itemDao.deleteAll()
    }

    fun setToken(token: String) {
        itemWsClient.authorize(token)
    }

    // Salvează itemele la server
    suspend fun saveItemsToServer() {
        // Obținem itemele care nu au fost sincronizate (isSynced = false)
        val unsyncedItems = itemDao.getUnsyncedItems()

        // Iterăm prin itemele nesincronizate și le trimitem la server
        unsyncedItems.forEach { item ->
            try {
                // Trimitem itemul la server
                itemService.update(
                    itemId = item._id, // Specifică ID-ul necesar pentru URL
                    item = item,
                    authorization = getBearerToken()
                )

                // După ce itemul a fost salvat cu succes pe server, actualizăm flag-ul isSynced
                val updatedItem = item.copy(isSynced = true)  // Cream un nou obiect cu isSynced = true

                Log.d(TAG, "${updatedItem} before update")

                // Actualizăm itemul în baza de date
                itemDao.update(updatedItem)

            } catch (e: Exception) {
                // Gestionează eroarea
                Log.e(TAG, "Failed to save item to server", e)
            }
        }
        refresh() // Poți apela refresh dacă este necesar să actualizezi datele
    }


}