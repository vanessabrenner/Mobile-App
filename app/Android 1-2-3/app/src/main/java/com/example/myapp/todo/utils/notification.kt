package com.example.myapp.todo.utils

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.example.myapp.MainActivity

fun createNotificationChannel(channelId: String, context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) { // Corectare comparație
        val name = "MyTestChannel"
        val descriptionText = "My important test channel"
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val channel = NotificationChannel(channelId, name, importance).apply {
            description = descriptionText
        }

        val notificationManager: NotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}

// shows notification with a title and one-line content text
//fun showSimpleNotification(
//    context: Context,
//    channelId: String,
//    notificationId: Int,
//    textTitle: String,
//    textContent: String,
//    priority: Int = NotificationCompat.PRIORITY_DEFAULT
//) {
//    val builder = NotificationCompat.Builder(context, channelId) // Corectare
//        .setSmallIcon(android.R.drawable.ic_notification_overlay) // Iconă de notificare
//        .setContentTitle(textTitle)
//        .setContentText(textContent)
//        .setPriority(priority)
//
//    with(NotificationManagerCompat.from(context)) {
//        notify(notificationId, builder.build()) // Corectare
//    }
//}

// shows a simple notification with a tap action to show an activity
fun showSimpleNotificationWithTapAction(
    context: Context,
    channelId: String,
    notificationId: Int,
    textTitle: String,
    textContent: String,
    priority: Int = NotificationCompat.PRIORITY_DEFAULT
) {
    val intent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK // Corectare
    }

    val pendingIntent: PendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)

    val builder = NotificationCompat.Builder(context, channelId) // Corectare
        .setSmallIcon(android.R.drawable.ic_notification_overlay) // Iconă de notificare
        .setContentTitle(textTitle)
        .setContentText(textContent)
        .setPriority(priority)
        .setContentIntent(pendingIntent) // Adaugare tap action
        .setAutoCancel(true)

    with(NotificationManagerCompat.from(context)) {
        notify(notificationId, builder.build()) // Corectare
    }
}
