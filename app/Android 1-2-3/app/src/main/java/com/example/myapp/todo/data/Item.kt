package com.example.myapp.todo.data

import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "items")
data class Item(
    @PrimaryKey val _id: String = "",
    val title: String = "",
    val author: String = "",
    val pages: Int = 0,
    val inStock: Boolean = false,
    val isSynced: Boolean = true,  // Flag pentru sincronizare
    @Embedded val location: Location = Location()
)

data class Location(
    val lat: Double = 51.5074,  // Default Londra
    val lng: Double = -0.1278   // Default Londra
)