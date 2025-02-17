package com.example.myapp.todo.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.example.myapp.todo.utils.ConnectivityManagerNetworkMonitor
import com.example.myapp.todo.utils.SyncDataWorker
import com.example.myapp.todo.utils.createNotificationChannel
import com.example.myapp.todo.utils.showSimpleNotificationWithTapAction
import kotlinx.coroutines.flow.collectLatest

@Composable
fun ConnectivityNotifications() {
    val context = LocalContext.current
    val channelId = "ConnectivityChannel"
    val notificationId = 1

    LaunchedEffect(Unit) {
        createNotificationChannel(channelId, context)
    }

    val networkMonitor = ConnectivityManagerNetworkMonitor(context)

    // `wasOffline` începe cu null și ulterior devine Boolean
    val wasOffline = remember { mutableStateOf<Boolean?>(null) }

    LaunchedEffect(Unit) {
        networkMonitor.isOnline.collectLatest { isOnline ->
            when {
                wasOffline.value == null -> {
                    // Prima verificare: doar setăm valoarea inițială
                    wasOffline.value = !isOnline
                }
                !isOnline && wasOffline.value == false -> {
                    // Am trecut din online în offline
                    showSimpleNotificationWithTapAction(
                        context = context,
                        channelId = channelId,
                        notificationId = notificationId,
                        textTitle = "Conexiune Pierdută",
                        textContent = "Itemele adaugate/actualizate se salveaza local."
                    )
                    wasOffline.value = true
                }
                isOnline && wasOffline.value == true -> {
                    // Am revenit online după ce am fost offline
                    val syncWorkRequest = OneTimeWorkRequestBuilder<SyncDataWorker>()
                        .build()
                    WorkManager.getInstance(context).enqueue(syncWorkRequest)

                    showSimpleNotificationWithTapAction(
                        context = context,
                        channelId = channelId,
                        notificationId = notificationId,
                        textTitle = "Conexiune Restabilită",
                        textContent = "Itemele adaugate/actualizate s-au trimis către server."
                    )
                    wasOffline.value = false
                }
            }
        }
    }
}



