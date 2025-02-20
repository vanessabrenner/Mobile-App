/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.myapp

import android.app.Application
import androidx.work.Configuration
import android.util.Log
import androidx.work.WorkManager
import com.example.myapp.core.AppContainer
import com.example.myapp.core.TAG
import com.example.myapp.todo.utils.MyWorkerFactory

class MyApplication : Application() {
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "init")
        container = AppContainer(this)

        val config = Configuration.Builder()
            .setWorkerFactory(MyWorkerFactory(container.itemRepository))
            .build()
        WorkManager.initialize(this, config)
    }

}
