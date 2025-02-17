package com.example.myapp

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.myapp.todo.data.Item
import com.example.myapp.todo.data.local.ItemDao

@Database(entities = [Item::class], version = 4, exportSchema = false)
abstract class MyAppDatabase : RoomDatabase() {
    abstract fun itemDao(): ItemDao

    companion object {
        @Volatile
        private var INSTANCE: MyAppDatabase? = null

        val MIGRATION_3_4 = object : Migration(3, 4) {
            override fun migrate(database: SupportSQLiteDatabase) {
                // Adaugă coloanele pentru locație
                database.execSQL("ALTER TABLE items ADD COLUMN lat REAL NOT NULL DEFAULT 51.5074")
                database.execSQL("ALTER TABLE items ADD COLUMN lng REAL NOT NULL DEFAULT -0.1278")
            }
        }

        fun getDatabase(context: Context): MyAppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context,
                    MyAppDatabase::class.java,
                    "app_database"
                )
                    .addMigrations(MIGRATION_3_4) // Adaugă toate migrațiile
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
