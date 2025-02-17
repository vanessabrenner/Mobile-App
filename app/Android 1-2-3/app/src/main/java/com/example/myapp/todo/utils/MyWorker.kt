package com.example.myapp.todo.utils

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.myapp.todo.data.ItemRepository
import android.util.Log
import com.example.myapp.MyApplication
import com.example.myapp.core.TAG

class SyncDataWorker(
    context: Context,
    workerParams: WorkerParameters,
    private val itemRepository: ItemRepository
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            // Verificăm dacă avem conexiune la internet
            if (isNetworkAvailable()) {
                // Dacă există conexiune, trimitem toate itemele la server
                itemRepository.saveItemsToServer() // Trimite toate itemele la server
                Log.d(TAG, "save items to server")
                Result.success()  // Sincronizarea a avut succes
            } else {
                // Dacă nu există conexiune, nu facem nimic
                Result.retry()  // Vom încerca din nou mai târziu
            }
        } catch (e: Exception) {
            // În caz de eroare, returnăm failure
            Result.failure()
        }
    }

    // Verifică dacă există o conexiune activă la internet
    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            val activeNetwork = connectivityManager.activeNetwork
            val networkCapabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
            return networkCapabilities != null && networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        } else {
            val activeNetworkInfo = connectivityManager.activeNetworkInfo
            return activeNetworkInfo != null && activeNetworkInfo.isConnected
        }
    }
}

