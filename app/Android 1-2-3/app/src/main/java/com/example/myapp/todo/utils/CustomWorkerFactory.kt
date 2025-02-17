package com.example.myapp.todo.utils

import android.content.Context
import androidx.work.ListenableWorker
import androidx.work.WorkerFactory
import androidx.work.WorkerParameters
import com.example.myapp.todo.data.ItemRepository

class MyWorkerFactory(
    private val itemRepository: ItemRepository
) : WorkerFactory() {

    override fun createWorker(
        appContext: Context,
        workerClassName: String,
        workerParameters: WorkerParameters
    ): ListenableWorker? {
        return when (workerClassName) {
            SyncDataWorker::class.java.name -> SyncDataWorker(appContext, workerParameters, itemRepository)
            else -> null
        }
    }
}


