package com.example.myapp.todo.data.local
//
//import android.content.Context
//import androidx.room.Database
//import androidx.room.Room
//import androidx.room.RoomDatabase
//import com.example.myapp.todo.data.Item
//
//
//@Database(entities = [Item::class], version = 2, exportSchema = false)
//abstract class AppDatabase: RoomDatabase() {
//    abstract fun itemDao(): ItemDao
//
//    companion object {
//        @Volatile
//        private var INSTANCE: AppDatabase? = null
//
//        fun getDatabase(context: Context): AppDatabase {
//            return INSTANCE ?: synchronized(this) {
//                val instance = Room.databaseBuilder(
//                    context,
//                    AppDatabase::class.java,
//                    "app_database")
//                    .build()
//                INSTANCE = instance
//                instance
//            }
//        }
//    }
//}

